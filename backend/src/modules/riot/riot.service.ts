import { HttpService } from '@nestjs/axios'
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { perkUrl, runeUrl } from '../../common/utils/runeUrl'
import { serverRegion, winrate } from '../../common/utils'
import { validateGameType } from '../../common/validators'
import { GameArenaDto, GameDetailDto, GameDto, GameNormalDto, MasteryDto, RankDto } from '../../common/types'
import { RiotChampionsDto, RiotGameDto, RiotMasteryDto, RiotRankDto, RiotSummonerDto } from './types'
import { augmentsData } from 'src/common/data/augments'

export type queueTypeDto = 'ranked' | 'normal' | 'all'

@Injectable()
export class RiotService {
    // Constants
    private readonly API_KEY = this.configService.get<string>('RIOT_API_KEY')
    private readonly HEADERS = { headers: { 'X-Riot-Token': this.API_KEY } }
    private readonly LOGGER = new Logger(this.constructor.name)
    private readonly URLS = {
        summoner: (server: string, name: string) => `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`,
        masteries: (server: string, summoner_id: string) =>
            `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}`,
        rank: (server: string, summoner_id: string) =>
            `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner_id}`,
    }

    // These properties doesnt usually change, so they are generated in the constructor and stored instead of fetching them every time
    version: string // current version of the game
    private champions: Record<string, string> = {} // {champ_id => champ_name}

    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
        this.init()
    }

    /**
     * INIT FUNCTION
     * Is called on the constructor to initialize and cache the values of some common properties
     *  1. Get the latest version of the game
     *  2. Generate the table [champ_id => champ_name]
     */
    private async init(): Promise<void> {
        this.LOGGER.debug('RiotService constructor - catching version and champions')
        /**
         * 1. Get the latest version of the game
         */
        const url = 'https://ddragon.leagueoflegends.com/api/versions.json'
        const versions = await this.httpGet<string[]>(url)

        this.version = versions[0]

        /**
         * 2. Generate the table [champ_id => champ_name]
         */
        const url2 = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/en_US/champion.json`
        const { data } = await this.httpGet<RiotChampionsDto>(url2)

        Object.keys(data).forEach(champion_name => {
            this.champions[data[champion_name].key] = data[champion_name].id
        })
    }

    /**
     * Util function to fetch data from Riot API
     * @param url URL to fetch from
     * @returns Data from the Riot API
     */
    private async httpGet<T>(url: string): Promise<T> {
        try {
            this.LOGGER.debug(`Fetching ${url}`)
            return (await lastValueFrom(this.httpService.get(url, this.HEADERS))).data
        } catch (error) {
            this.LOGGER.error(`Fetching ${url}`, error)

            if (error.response.status === 429)
                throw new HttpException(
                    {
                        status: HttpStatus.TOO_MANY_REQUESTS,
                        error: 'Too many requests to Riot API. Please try again later',
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                )

            if (error.response.status === 404)
                throw new NotFoundException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Something was not found in the Riot API',
                })

            // default error
            throw new BadRequestException('Error fetching data from Riot API. Please check console DEBUG mmhmm logs')
        }
    }

    /**
     * ## Get the basic summoner info (by name)
     * To use other methods, you need to get the summoner id first
     */
    async getBasicInfo(server: string, summonerName: string): Promise<RiotSummonerDto> {
        return this.httpGet<RiotSummonerDto>(this.URLS.summoner(server, summonerName))
    }

    /**
     * ## Get the mastery information
     * @param summonerName Name of the summoner
     * @param server Server of the summoner
     * @param masteriesLimit Limit of the masteries to return
     * @returns Array of masteries
     */
    async getMasteries(summonerName: string, server: string, masteriesLimit: number): Promise<MasteryDto[]> {
        const summoner_id = (await this.getBasicInfo(server, summonerName)).id
        const allMasteries = await this.httpGet<RiotMasteryDto[]>(this.URLS.masteries(server, summoner_id))

        // This response cointains all (+140) champions, so we take the {masteriesLimit} first ones
        this.LOGGER.log(`Found ${allMasteries.length} masteries, returning ${masteriesLimit}`)

        // Slice result if exceeds the limit
        if ((masteriesLimit ?? 0) < allMasteries.length) {
            allMasteries.length = masteriesLimit
        }

        return allMasteries.map(mastery => ({
            name: this.champions[mastery.championId],
            image: `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${this.champions[mastery.championId]}.png`,
            level: mastery.championLevel,
            points: mastery.championPoints,
            chestGranted: mastery.chestGranted,
        }))
    }

    /**
     * ## Get the rank information (by summoner_id)
     * Riot returns an array of 0-2 items with the rank information
     * it's not ordered (if it's 1, it can be 'solo' or 'flex') so we need to check it
     * @param {string} summoner_id ID of the summoner
     * @param {string} server Server of the summoner
     * @returns The info of solo and flex queues
     */
    async getRankData(
        summoner_id: string,
        server: string,
    ): Promise<{
        solo: RankDto
        flex: RankDto
        arena: RankDto
    }> {
        this.LOGGER.log('Getting classification data in ranked queues')

        // This can be: [], [solo], [flex], [arena], [solo, flex], ...
        const rank_data = await this.httpGet<RiotRankDto[]>(this.URLS.rank(server, summoner_id))

        // Default object in case of unranked in any queue
        const league_default: RankDto = {
            rank: 'Unranked',
            image: 'unranked.png',
            lp: 0,
            win: 0,
            lose: 0,
            winrate: 0,
            promos: 'NNN',
        }

        const formatRankData = (data: RiotRankDto): RankDto => {
            const rank = data.queueType === 'CHERRY' ? 'Unranked' : data.tier ? `${data.tier} ${data.rank}` : 'Unranked'
            const image = data.queueType === 'CHERRY' ? 'unranked.png' : data.tier ? `${data.tier.toLowerCase()}.png` : 'unranked.png'

            return {
                rank,
                image,
                lp: data.leaguePoints,
                win: data.wins,
                lose: data.losses,
                winrate: winrate(data['wins'], data['losses']),
                promos: data?.miniSeries?.progress ?? '',
            }
        }

        const out = {
            solo: league_default,
            flex: league_default,
            arena: league_default,
        }

        for (const queue of rank_data) {
            if (queue.queueType === 'RANKED_SOLO_5x5') {
                out.solo = formatRankData(queue)
                continue
            }
            if (queue.queueType === 'CHERRY') {
                out.arena = formatRankData(queue)
                continue
            }
            out.flex = formatRankData(queue)
        }

        return out
    }

    /**
     * ## Check if a match is the last played game
     *
     * @param server The server of the summoner
     * @param puuid The puuid of the summoner
     * @param matchId The id of the match
     * @returns [is_last, last_game_id]
     */
    async isLastGame(server: string, puuid: string, matchId: string): Promise<{ is_last: boolean; last_game_id: string }> {
        this.LOGGER.log(`Is ${matchId} the last played game?`)
        server = serverRegion(server)

        // Get the IDs of the games
        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`
        const gameIDs_list: string[] = (await lastValueFrom(this.httpService.get(url, this.HEADERS))).data

        // Check if the match is the last played game
        const is_last = gameIDs_list[0] === matchId

        this.LOGGER.log(is_last ? 'Yes, it is' : 'No, it is not')
        return {
            is_last,
            last_game_id: gameIDs_list[0],
        }
    }

    /**
     * ## Format Game
     * Format the raw data of a game to our custom schema
     * @param rawGame The raw data of the game as Riot returns
     * @returns The info parsed
     */
    formatGame(rawGame: RiotGameDto, puuid: string): GameNormalDto | GameArenaDto {
        const idx = rawGame.metadata.participants.indexOf(puuid)
        const [initialTeamMate, lastTeamMate] = idx > 4 ? [5, 9] : [0, 4]

        const teamKills: number = rawGame.info.participants
            .slice(initialTeamMate, lastTeamMate + 1)
            .map(p => p.kills)
            .reduce((acc, val) => acc + val)

        const base_game: GameDto = {
            matchId: rawGame.metadata.matchId,
            win: rawGame.info.participants[idx].win,
            participantNumber: idx,
            gameCreation: rawGame.info.gameCreation,
            gameDuration: rawGame.info.gameDuration,
            gameMode: validateGameType(rawGame.info.queueId),
            teamPosition: rawGame.info.participants[idx].teamPosition,
            isEarlySurrender: rawGame.info.participants[idx].gameEndedInEarlySurrender,
            visionScore: rawGame.info.participants[idx].visionScore,
            champLevel: rawGame.info.participants[idx].champLevel,
            championName: rawGame.info.participants[idx].championName,
            kills: rawGame.info.participants[idx].kills,
            deaths: rawGame.info.participants[idx].deaths,
            assists: rawGame.info.participants[idx].assists,
            doubleKills: rawGame.info.participants[idx].doubleKills,
            tripleKills: rawGame.info.participants[idx].tripleKills,
            quadraKills: rawGame.info.participants[idx].quadraKills,
            pentaKills: rawGame.info.participants[idx].pentaKills,
            cs: rawGame.info.participants[idx].neutralMinionsKilled + rawGame.info.participants[idx].totalMinionsKilled,
            gold: rawGame.info.participants[idx].goldEarned,
            ward: rawGame.info.participants[idx].item6 || 2052,
            killParticipation: (rawGame.info.participants[idx].kills + rawGame.info.participants[idx].assists) / teamKills,
            damageDealt: rawGame.info.participants[idx].totalDamageDealtToChampions,
            damageTaken: rawGame.info.participants[idx].totalDamageTaken,
            items: [
                rawGame.info.participants[idx].item0,
                rawGame.info.participants[idx].item1,
                rawGame.info.participants[idx].item2,
                rawGame.info.participants[idx].item3,
                rawGame.info.participants[idx].item4,
                rawGame.info.participants[idx].item5,
            ],
            participants: rawGame.info.participants.map(participant => ({
                summonerName: participant.summonerName,
                championName: participant.championName,
            })),
        }

        if (rawGame.info.queueId === 1700) {
            // RETURN ARENA GAME
            return {
                ...base_game,
                augments: [
                    rawGame.info.participants[idx].playerAugment1,
                    rawGame.info.participants[idx].playerAugment2,
                    rawGame.info.participants[idx].playerAugment3,
                    rawGame.info.participants[idx].playerAugment4,
                ]
                    .filter(augment => augment !== 0)
                    .map(id => augmentsData[id]),
            }
        }

        // RETURN NORMAL (NO ARENA) GAME
        return {
            ...base_game,
            spells: [rawGame.info.participants[idx].summoner1Id, rawGame.info.participants[idx].summoner2Id],
            perks: [
                perkUrl(rawGame.info.participants[idx].perks.styles[0].style),
                runeUrl(
                    rawGame.info.participants[idx].perks.styles[0].selections[0].perk,
                    rawGame.info.participants[idx].perks.styles[0].style,
                ),
            ],
        }
    }

    /**
     * ## Format GameDetail
     * Format the raw data of a game to our custom schema
     * @param rawGame The raw data of the game as Riot returns
     * @returns The info parsed
     */
    formatGameDetail(rawGame: RiotGameDto, puuid: string): GameDetailDto {
        const idx = rawGame.metadata.participants.indexOf(puuid)

        return {
            matchId: rawGame.metadata.matchId,
            gameCreation: rawGame.info.gameCreation,
            gameDuration: rawGame.info.gameDuration,
            participantNumber: idx,
            gameMode: rawGame.info.gameMode,
            teams: rawGame.info.teams.map(team => ({
                teamId: team.teamId,
                win: team.win,
                bans: team.bans.map(ban => ({
                    pickTurn: ban.pickTurn,
                    championId:
                        ban.championId === -1
                            ? null
                            : `http://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${this.champions[ban.championId]}.png`,
                })),
                objectives: Object.entries(team.objectives).map(([type, value]) => ({ type, ...value })),
            })),

            participants: rawGame.info.participants.map(participant => ({
                summonerName: participant.summonerName,
                teamPosition: participant.teamPosition,
                isEarlySurrender: participant.gameEndedInEarlySurrender,
                win: participant.win,
                visionScore: participant.visionScore,
                champ: {
                    champLevel: participant.champLevel,
                    championName: participant.championName,
                    largestMultiKill: participant.largestMultiKill,
                    damageDealt: participant.totalDamageDealtToChampions,
                    damageTaken: participant.totalDamageTaken,
                },
                kills: participant.kills,
                deaths: participant.deaths,
                assists: participant.assists,
                multiKill: {
                    doubles: participant.doubleKills,
                    triples: participant.tripleKills,
                    quadras: participant.quadraKills,
                    pentas: participant.pentaKills,
                },
                gold: participant.goldEarned,
                cs: participant.neutralMinionsKilled + participant.totalMinionsKilled,
                ward: participant.item6 || 2052,
                items: [participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5],
                // spells: [participant.summoner1Id, participant.summoner2Id],
                // perks: [
                //     perkUrl(participant.perks.styles[0].style),
                //     runeUrl(participant.perks.styles[0].selections[0].perk, participant.perks.styles[0].style),
                // ],
                spells: [],
                perks: [],
            })),
        }
    }

    /**
     * ## Get a list of game IDs
     * Gets the last game IDs played from a summoner
     *
     * @param puuid The puuid of the summoner
     * @param server The server of the player
     * @param gamesLimit The number of games to return
     * @param offset The number of games to skip
     * @returns The game IDs list
     */
    async getGameIds(puuid: string, server: string, gamesLimit: number, offset: number, queueType: queueTypeDto): Promise<string[]> {
        server = serverRegion(server)
        const queueTypeFilter: Record<string, string> = {
            ranked: '&type=ranked',
            normal: '&type=normal',
            all: '',
        }
        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${offset}&count=${gamesLimit}${queueTypeFilter[queueType]}`

        return this.httpGet<string[]>(url)
    }

    /**
     * ## Get games detail
     * Loads the information of a chunk of games
     *
     * @param puuid The puuid of the summoner
     * @param server The server of the player
     * @param matchIds The list of match IDs
     * @returns The list of games info
     */
    async getGamesDetail(puuid: string, server: string, matchIds: string[]): Promise<Array<GameNormalDto | GameArenaDto>> {
        this.LOGGER.log(`Getting data from ${matchIds.length} games`)
        // Accumulate the promises of each game
        const promises: Promise<RiotGameDto>[] = matchIds.map((game_id: string) => {
            const url = `https://${serverRegion(server)}.api.riotgames.com/lol/match/v5/matches/${game_id}`

            return this.httpGet<RiotGameDto>(url)
        })

        // Run all the promises in parallel
        const games = await Promise.all(promises)
        const result = games.map(game => this.formatGame(game, puuid))

        return result
    }

    /**
     * ## Get game detail
     * Loads single game information
     *
     * @param puuid The puuid of the summoner
     * @param server The server of the player
     * @param matchIds The match ID
     * @returns Single game info
     */
    async getGameDetail(puuid: string, server: string, matchId: string): Promise<GameDetailDto> {
        const url = `https://${serverRegion(server)}.api.riotgames.com/lol/match/v5/matches/${matchId}`
        const rawGame = await this.httpGet<RiotGameDto>(url)

        return this.formatGameDetail(rawGame, puuid)
    }
}
