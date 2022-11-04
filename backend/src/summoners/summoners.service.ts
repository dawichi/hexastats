import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { serverRegion, spellUrl, winrate } from '../common/utils'
import { validateQueueType, validateGameType } from '../common/validators'
import { GameDto, MasteryDto, PlayerDto, RankDto } from '../types'
import { SummonerDto } from './types/summoner.dto'

export type queueTypeDto = 'ranked' | 'normal' | 'all'

@Injectable()
export class SummonersService {
    private readonly apiKey: string
    private readonly headers: { headers: { 'X-Riot-Token': string } }
    private readonly logger = new Logger(this.constructor.name)

    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
        this.apiKey = this.configService.get<string>('RIOT_API_KEY')
        this.headers = { headers: { 'X-Riot-Token': this.apiKey } }
    }

    private baseUrl(server: string): string {
        return `https://${server}.api.riotgames.com/lol/`
    }

    private async getLatestVersion(): Promise<string> {
        const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

        return (await lastValueFrom(this.httpService.get(url, this.headers))).data[0]
    }

    /**
     * ## Get the basic summoner info (by name)
     * To use other methods, you need to get the summoner id first
     */
    async getBasicInfo(summonerName: string, server: string): Promise<SummonerDto> {
        const url = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`

        return (await lastValueFrom(this.httpService.get(url, this.headers))).data
    }

    /**
     * ## Get new data of the summoner
     */
    async getData(summonerName: string, server: string, gamesLimit: number, queueType: queueTypeDto): Promise<PlayerDto> {
        const info = await this.getBasicInfo(summonerName, server)
        const { solo, flex } = await this.getRankData(info.id, server)
        const masteries = await this.getMasteries(info.id, server, 24)
        const games = await this.getGames(info.puuid, server, gamesLimit, 0, queueType)

        const version = await this.getLatestVersion()

        return {
            alias: info.name,
            server,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${info.profileIconId}.png`,
            level: info.summonerLevel,
            rank: {
                solo,
                flex,
            },
            games,
            masteries,
        }
    }

    /**
     * ## Get the champion names table
     * Riot stores an array with all the chamions names
     * @returns A object with pairs `[id => name]` of all champions
     */
    private async getChampionNames(): Promise<Record<string, string>> {
        const version = await this.getLatestVersion()
        const url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
        const res = (await lastValueFrom(this.httpService.get(url, this.headers))).data.data
        const champions: Record<string, string> = {}

        Object.keys(res).forEach(champion_name => {
            champions[res[champion_name].key] = res[champion_name].id
        })

        return champions
    }

    /**
     * ## Get the mastery information (by summoner_id)
     * Riot returns an array of masteries with all your played champs,
     * so we filter the response to get only the first 7 with most points
     * @param {string} summoner_id ID of the summoner
     * @param {string} server Server of the summoner
     * @param {string} masteriesLimit Limit of the masteries to return
     * @returns {Promise<MasteryDto[]>} The list of biggest masteries
     */
    private async getMasteries(summoner_id: string, server: string, masteriesLimit: number): Promise<MasteryDto[]> {
        this.logger.verbose(`Getting masteries about best ${masteriesLimit} champs`)
        const url = `${this.baseUrl(server)}champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}`
        const allMasteries = (await lastValueFrom(this.httpService.get(url, this.headers))).data

        // This response cointains all (+140) champions, so we take the {masteriesLimit} first ones
        const masteries: MasteryDto[] = []

        this.logger.log(`Found ${allMasteries.length} masteries`)

        // Slice result if exceeds the limit
        if ((masteriesLimit ?? 0) < allMasteries.length) {
            allMasteries.length = masteriesLimit
        }

        const version = await this.getLatestVersion()
        const champ_names_table = await this.getChampionNames()

        for (let i = 0; i < allMasteries.length; i++) {
            const champ_name = champ_names_table[allMasteries[i].championId]

            masteries.push({
                name: champ_name,
                image: `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ_name}.png`,
                level: allMasteries[i].championLevel,
                points: allMasteries[i].championPoints,
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
        this.logger.verbose('Getting classification data in ranked queues')
        const url = `${this.baseUrl(server)}league/v4/entries/by-summoner/${summoner_id}`
        const rank_data: any[] = (await lastValueFrom(this.httpService.get(url, this.headers))).data
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

        const soloFirst = rank_data[0].queueType == 'RANKED_SOLO_5x5'

        const buildRank = (i: number): RankDto => ({
            rank: rank_data[i].tier ? `${rank_data[i].tier} ${rank_data[i].rank}` : 'Unranked',
            image: rank_data[i].tier ? `${rank_data[i].tier.toLowerCase()}.png` : 'unranked.png',
            lp: rank_data[i].leaguePoints,
            win: rank_data[i].wins,
            lose: rank_data[i].losses,
            winrate: winrate(rank_data[i]['wins'], rank_data[i]['losses']),
        })

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
     * ## Process the data of a game
     * @param idx The index of the summoner
     * @param param1 The data of the game
     * @returns {GameDto} The info of a unique game formatted
     */
    private async processGame(
        matchId: string,
        idx: number,
        { gameDuration, teams, participants }: any,
        gameMode: string,
    ): Promise<GameDto> {
        const version = await this.getLatestVersion()
        const champ_names = await this.getChampionNames()
        const itemUrl = (id: number) => {
            if (!id) return null
            return `http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`
        }

        participants = participants.map((participant: any) => {
            return {
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
                items: {
                    0: itemUrl(participant.item0),
                    1: itemUrl(participant.item1),
                    2: itemUrl(participant.item2),
                    3: itemUrl(participant.item3),
                    4: itemUrl(participant.item4),
                    5: itemUrl(participant.item5),
                    6: itemUrl(participant.item6 || 2052),
                },
                spells: {
                    0: spellUrl(participant.summoner1Id),
                    1: spellUrl(participant.summoner2Id),
                },
            }
        })
        teams = teams.map((team: any) => {
            team = team.bans.map((ban: any) => {
                if (ban.championId !== -1) {
                    ban.championId = `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ_names[ban.championId]}.png`
                } else {
                    ban.championId = null
                }
                return ban
            })
            return team
        })
        return {
            matchId,
            participantNumber: idx,
            gameDuration,
            gameMode,
            teams,
            participants,
        }
    }

    /**
     * ## Check if a match is the last played game
     *
     * @param server The server of the summoner
     * @param puuid The puuid of the summoner
     * @param matchId The id of the match
     * @returns True if the match is the last played game
     */
    async isLastGame(server: string, puuid: string, matchId: string): Promise<boolean> {
        this.logger.verbose(`Checking if match ${matchId} is the last played game`)
        server = serverRegion(server)

        // Get the IDs of the games
        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`
        const gameIDs_list: string[] = (await lastValueFrom(this.httpService.get(url, this.headers))).data

        // Check if the match is the last played game
        const result = gameIDs_list[0] === matchId

        this.logger.verbose(`${result ? 'Yes, it is' : 'No, it is not'} the last played game`)
        return result
    }

    /**
     * ## Get the games of a summoner
     * Gets the last games played from a summoner
     *
     * @param {string} puuid The puuid of the summoner
     * @param {string} server The server of the player
     * @param {number} gamesLimit The number of games to return
     * @param {number} offset The number of games to skip before starting to analyze
     * @param {string} queueType Specify to check only a specific queue ('ranked', 'normal', 'all')
     * @returns {Player} The info of the player
     */
    async getGames(puuid: string, server: string, gamesLimit: number, offset: number, queueType: string): Promise<any[]> {
        this.logger.verbose(`Getting data from last ${gamesLimit} games`)

        server = serverRegion(server)
        const queue = validateQueueType(queueType)

        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${offset}&count=${gamesLimit}${queue}`
        const games_list: string[] = (await lastValueFrom(this.httpService.get(url, this.headers))).data

        // Accumulate the promises of each game
        const promises: Promise<any>[] = games_list.map((game_id: string) => {
            const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/${game_id}`

            return lastValueFrom(this.httpService.get(url, this.headers))
        })

        // Run all the promises in parallel
        const games = await Promise.all(promises)
        const result = []

        for (const game of games) {
            const idx: number = game.data.metadata.participants.indexOf(puuid)
            const matchId = game.data.metadata.matchId
            const { gameId } = game.data.info
            const gameType = validateGameType(game.data.info.queueId)

            this.logger.log(`Processing game: ${gameId} \t ${gameType} \t ${game.data.info.participants[idx].championName}`)

            result.push(await this.processGame(matchId, idx, game.data.info, gameType))
        }

        return result
    }
}
