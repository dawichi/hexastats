import { HttpService } from '@nestjs/axios'
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { perkUrl, runeUrl } from '../../common/utils/runeUrl'
import { serverRegion, spellUrl, winrate } from '../../common/utils'
import { validateGameType } from '../../common/validators'
import { GameDto, MasteryDto, RankDto, TeamDto } from '../../types'
import { RiotChampionsDto, RiotGameDto, RiotMasteryDto, RiotRankDto, RiotSummonerDto } from './types'

export type queueTypeDto = 'ranked' | 'normal' | 'all'

@Injectable()
export class RiotService {
    private readonly apiKey = this.configService.get<string>('RIOT_API_KEY')
    private readonly headers = { headers: { 'X-Riot-Token': this.apiKey } }
    private readonly logger = new Logger(this.constructor.name)

    // These properties doesnt usually change, so they are generated in the constructor and stored instead of fetching them every time
    version: string
    private champions: Record<string, string> = {}

    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
        this.init()
    }

    /**
     * Util function to fetch data from Riot API
     * @param url URL to fetch from
     * @returns Data from the Riot API
     */
    private async httpGet<T>(url: string): Promise<T> {
        try {
            this.logger.debug(`Fetching ${url}`)
            return (await lastValueFrom(this.httpService.get(url, this.headers))).data
        } catch (error) {
            this.logger.error(error)
            this.logger.error(`Error fetching data from ${url}`)

            if (error.response.status === 429)
                throw new HttpException(
                    {
                        status: HttpStatus.TOO_MANY_REQUESTS,
                        error: 'Too many requests to Riot API. Please try again later',
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                )

            // default error
            throw new BadRequestException('Error fetching data from Riot API. Please check console DEBUG mmhmm logs')
        }
    }

    /**
     * INIT FUNCTION
     * Is called on the constructor to initialize and cache the values of some common properties
     *  1. Get the latest version of the game
     *  2. Generate the table [champ_id => champ_name]
     */
    private async init(): Promise<void> {
        this.logger.debug('RiotService constructor - catching version and champions')
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

    private baseUrl(server: string): string {
        return `https://${server}.api.riotgames.com/lol/`
    }

    /**
     * ## Get the basic summoner info (by name)
     * To use other methods, you need to get the summoner id first
     */
    async getBasicInfo(server: string, summonerName: string): Promise<RiotSummonerDto> {
        const url = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`

        return this.httpGet<RiotSummonerDto>(url)
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
        const url = `${this.baseUrl(server)}champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}`
        const allMasteries = await this.httpGet<RiotMasteryDto[]>(url)

        // This response cointains all (+140) champions, so we take the {masteriesLimit} first ones
        const masteries: MasteryDto[] = []

        this.logger.log(`Found ${allMasteries.length} masteries`)

        // Slice result if exceeds the limit
        if ((masteriesLimit ?? 0) < allMasteries.length) {
            allMasteries.length = masteriesLimit
        }

        for (let i = 0; i < allMasteries.length; i++) {
            const champ_name = this.champions[allMasteries[i].championId]

            masteries.push({
                name: champ_name,
                image: `http://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${champ_name}.png`,
                level: allMasteries[i].championLevel,
                points: allMasteries[i].championPoints,
                chestGranted: allMasteries[i].chestGranted,
            })
        }
        return masteries
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
    }> {
        this.logger.log('Getting classification data in ranked queues')
        const url = `${this.baseUrl(server)}league/v4/entries/by-summoner/${summoner_id}`
        const rank_data = await this.httpGet<RiotRankDto[]>(url)
        const league_default = {
            rank: 'Unranked',
            image: 'unranked.png',
            lp: 0,
            win: 0,
            lose: 0,
            winrate: 0,
        }

        // Is unranked in both queues
        if (!rank_data.length) {
            return {
                solo: league_default,
                flex: league_default,
            }
        }

        const buildRank = (i: number): RankDto => ({
            rank: `${rank_data[i].tier} ${rank_data[i].rank}` ?? 'Unranked',
            image: `${rank_data[i].tier.toLowerCase()}.png` ?? 'unranked.png',
            lp: rank_data[i].leaguePoints,
            win: rank_data[i].wins,
            lose: rank_data[i].losses,
            winrate: winrate(rank_data[i]['wins'], rank_data[i]['losses']),
        })

        const soloFirst = rank_data[0].queueType == 'RANKED_SOLO_5x5'

        // Is ranked in only one queue: check which one
        if (rank_data.length == 1) {
            return {
                solo: soloFirst ? buildRank(0) : league_default,
                flex: soloFirst ? league_default : buildRank(0),
            }
        }

        // If not, both have data
        return {
            solo: soloFirst ? buildRank(0) : buildRank(1),
            flex: soloFirst ? buildRank(1) : buildRank(0),
        }
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
        this.logger.log(`Is ${matchId} the last played game?`)
        server = serverRegion(server)

        // Get the IDs of the games
        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`
        const gameIDs_list: string[] = (await lastValueFrom(this.httpService.get(url, this.headers))).data

        // Check if the match is the last played game
        const is_last = gameIDs_list[0] === matchId

        this.logger.log(is_last ? 'Yes, it is' : 'No, it is not')
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
    formatGame(rawGame: RiotGameDto, puuid: string): GameDto {
        const itemUrl = (id: number) => (id ? `http://ddragon.leagueoflegends.com/cdn/${this.version}/img/item/${id}.png` : null)

        function parseChampionId(id: number): string | null {
            if (id === -1) return null
            return `http://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${this.champions[id]}.png`
        }

        return {
            matchId: rawGame.metadata.matchId,
            participantNumber: rawGame.metadata.participants.indexOf(puuid),
            gameCreation: rawGame.info.gameCreation,
            gameDuration: rawGame.info.gameDuration,
            gameMode: validateGameType(rawGame.info.queueId),
            teams: rawGame.info.teams.map(team => ({
                teamId: team.teamId,
                win: team.win,
                bans: team.bans.map(ban => ({
                    championId: parseChampionId(ban.championId),
                    pickTurn: ban.pickTurn,
                })),
                objectives: team.objectives,
            })),
            participants: rawGame.info.participants.map(participant => ({
                summonerName: participant.summonerName,
                win: participant.win,
                timePlayed: participant.timePlayed,
                teamPosition: participant.teamPosition,
                visionScore: participant.visionScore,
                champ: {
                    champLevel: participant.champLevel,
                    championName: participant.championName,
                    largestMultiKill: participant.largestMultiKill,
                    damageDealt: participant.totalDamageDealtToChampions,
                    damageTaken: participant.totalDamageTaken,
                },
                kda: {
                    assists: participant.assists,
                    deaths: participant.deaths,
                    kills: participant.kills,
                },
                multiKill: {
                    doubles: participant.doubleKills,
                    triples: participant.tripleKills,
                    quadras: participant.quadraKills,
                    pentas: participant.pentaKills,
                },
                farm: {
                    gold: participant.goldEarned,
                    cs: participant.neutralMinionsKilled + participant.totalMinionsKilled,
                },
                ward: itemUrl(participant.item6 || 2052),
                items: [
                    itemUrl(participant.item0),
                    itemUrl(participant.item1),
                    itemUrl(participant.item2),
                    itemUrl(participant.item3),
                    itemUrl(participant.item4),
                    itemUrl(participant.item5),
                ],
                spells: [spellUrl(participant.summoner1Id), spellUrl(participant.summoner2Id)],
                perks: [
                    perkUrl(participant.perks.styles[0].style),
                    runeUrl(participant.perks.styles[0].selections[0].perk, participant.perks.styles[0].style),
                ],
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
    async getGameIds(puuid: string, server: string, gamesLimit: number, offset: number): Promise<string[]> {
        server = serverRegion(server)
        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${offset}&count=${gamesLimit}`

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
    async getGamesDetail(puuid: string, server: string, matchIds: string[]): Promise<GameDto[]> {
        this.logger.log(`Getting data from ${matchIds.length} games`)
        // Accumulate the promises of each game
        const promises: Promise<RiotGameDto>[] = matchIds.map((game_id: string) => {
            const url = `https://${serverRegion(server)}.api.riotgames.com/lol/match/v5/matches/${game_id}`

            return this.httpGet<RiotGameDto>(url)
        })

        // Run all the promises in parallel
        const games = await Promise.all(promises)
        const result: GameDto[] = games.map(game => this.formatGame(game, puuid))

        return result
    }
}
