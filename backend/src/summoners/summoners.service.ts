import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { spellUrl } from '../common/utils'
import { validateQueueType, validateGameType } from '../common/validators'
import { GameDto, MasteryDto, RankDto, SummonerDto } from './dto'

@Injectable()
export class SummonersService {
    private readonly apiKey: string
    private readonly headers: { headers: { 'X-Riot-Token': string } }
    private readonly logger: Logger

    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
        this.apiKey = this.configService.get<string>('RIOT_API_KEY')
        this.headers = { headers: { 'X-Riot-Token': this.apiKey } }
        this.logger = new Logger(this.constructor.name)
    }

    /**
     * ## Get the RIOT base URL based on the server variable
     * @param {string} server Server of the summoner
     * @returns {string} The base url of the api
     */
    private baseUrl(server: string): string {
        return `https://${server}.api.riotgames.com/lol/`
    }

    /**
     * ## Get the latest version of the game
     * Riot stores all game versions in an array, so by getting
     * the first one you can get the latest version of the api
     * @returns {string} The latest version of the game
     */
    async getLatestVersion(): Promise<string> {
        const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

        return (await lastValueFrom(this.httpService.get(url, this.headers))).data[0]
    }

    /**
     * ## Get the summoner information (by name)
     * To use other methods, you need to get the summoner id first
     * @param {string} summoner_name Alias of the summoner
     * @param {string} server Server of the summoner
     * @returns {Promise<Summoner>} The summoner information
     */
    async getSummonerDataByName(summoner_name: string, server: string): Promise<SummonerDto> {
        this.logger.verbose('Getting summoner data')
        const url = `${this.baseUrl(server)}summoner/v4/summoners/by-name/${summoner_name}`

        return (await lastValueFrom(this.httpService.get(url, this.headers))).data
    }

    /**
     * ## Get the champion names table (by id)
     * Riot stores an array with all the chamions, so to get the name
     * you need to get the id and search in the array for that id
     * @returns {Promise<{[key: string]: string}>} A object with pairs [id => name] of all champions
     */
    private async getChampionNames(): Promise<{
        [key: string]: string
    }> {
        const version = await this.getLatestVersion()
        const url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
        const res = (await lastValueFrom(this.httpService.get(url, this.headers))).data.data
        const champion_names: { [key: string]: string } = {}

        Object.keys(res).forEach(champion_name => {
            champion_names[res[champion_name].key] = res[champion_name].id
        })

        return champion_names
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
    async getMasteries(summoner_id: string, server: string, masteriesLimit: number): Promise<MasteryDto[]> {
        this.logger.verbose(`Getting masteries about best ${masteriesLimit} champs`)
        const version = await this.getLatestVersion()
        const url = `${this.baseUrl(server)}champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}`
        const champ_names_table = await this.getChampionNames()
        const all_champions = (await lastValueFrom(this.httpService.get(url, this.headers))).data
        // This response cointains all +140 champions, so we take the {masteriesLimit} first ones
        const masteries: MasteryDto[] = []

        this.logger.log(`Found ${all_champions.length} masteries`)

        // Slice result if exceeds the limit
        if (masteriesLimit) {
            if (masteriesLimit < all_champions.length) {
                all_champions.length = masteriesLimit
            }
        }

        for (let i = 0; i < all_champions.length; i++) {
            const champ_name = champ_names_table[all_champions[i].championId]

            masteries.push({
                name: champ_name,
                image: `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ_name}.png`,
                level: all_champions[i].championLevel,
                points: all_champions[i].championPoints,
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
        const winrate = (wins: number, losses: number): number => {
            if (!(wins + losses)) return 0
            return (wins / (wins + losses)) * 100
        }
        const buildRank = (i: number): RankDto => {
            return {
                rank: rank_data[i].tier ? `${rank_data[i].tier} ${rank_data[i].rank}` : 'Unranked',
                image: rank_data[i].tier ? `${rank_data[i].tier.toLowerCase()}.png` : 'unranked.png',
                lp: rank_data[i].leaguePoints,
                win: rank_data[i].wins,
                lose: rank_data[i].losses,
                winrate: parseInt(winrate(rank_data[i]['wins'], rank_data[i]['losses']).toFixed(0)),
            }
        }

        // Is unranked in both queues
        if (!rank_data.length) {
            return {
                solo: league_default,
                flex: league_default,
            }
        }

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
     * ## Server region validator
     * Depending of the server, the games must be requested to a different region
     * @param {string} server Server name (e.g. 'euw1')
     * @returns {string} region name (e.g. 'europe')
     */
    private serverRegion(server: string): string {
        const servers: { [key: string]: string } = {
            oc1: 'americas',
            la1: 'americas',
            la2: 'americas',
            br1: 'americas',
            na1: 'americas',
            jp1: 'asia',
            kr: 'asia',
            euw1: 'europe',
            eun1: 'europe',
            tr1: 'europe',
            ru: 'europe',
        }

        return servers[server] ?? 'europe'
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
        server = this.serverRegion(server)

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

        server = this.serverRegion(server)
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
