import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { ChampDto, MasteryDto, RankDto, SummonerDto } from './dto'

@Injectable()
export class SummonersService {
    private readonly apiKey: string
    private readonly headers: { headers: { 'X-Riot-Token': string } }

    constructor(private configService: ConfigService, private httpService: HttpService) {
        this.apiKey = this.configService.get<string>('RIOT_API_KEY')
        this.headers = { headers: { 'X-Riot-Token': this.apiKey } }
    }

    private readonly logger: Logger = new Logger(SummonersService.name)

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

        this.logger.verbose(`Fount ${all_champions.length} masteries`)

        // Slice result if exceeds the limiit
        if (masteriesLimit < all_champions.length) {
            all_champions.length = masteriesLimit
        }

        for (let i = 0; i < all_champions.length; i++) {
            const champ_name = champ_names_table[all_champions[i].championId]

            this.logger.log(`Mastery: ${champ_name}`)

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
        const winrate = (wins: number, losses: number) => (wins && losses ? (wins / (wins + losses)) * 100 : 0)
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
     * ## Formats the data of a game
     * From the riot game data structure, it formats it to return only
     * the info we need, following the ChampDto structure
     * @param {number} gameDuration The duration of the game in seconds
     * @param {object} data The data of the game
     * @returns {ChampDto} The info of a unique game formatted
     */
    private async processGameData(
        gameDuration: number,
        {
            championName,
            assists,
            deaths,
            kills,
            doubleKills,
            tripleKills,
            quadraKills,
            pentaKills,
            win,
            totalDamageTaken,
            totalDamageDealtToChampions,
            goldEarned,
            visionScore,
            timePlayed,
            turretKills,
            totalMinionsKilled,
            neutralMinionsKilled,
        }: any,
    ): Promise<ChampDto> {
        const kda = deaths ? (kills + assists) / deaths : kills + assists
        const cs = totalMinionsKilled + neutralMinionsKilled
        const csmin = parseFloat(((60 * cs) / gameDuration).toFixed(1))

        return {
            //'time': f'{minutes}:{seconds}',
            name: championName,
            image: `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/${championName}.png`,
            assists,
            deaths,
            kills,
            kda,
            doubleKills,
            tripleKills,
            quadraKills,
            pentaKills,
            cs,
            csmin,
            gold: goldEarned,
            avgDamageDealt: totalDamageDealtToChampions,
            avgDamageTaken: totalDamageTaken,
            games: 1,
            maxKills: kills,
            maxDeaths: deaths,
            winrate: win ? 1 : 0,
            visionScore,
            timePlayed,
            turretKills,
        }
    }

    /**
     * ## Accumulates the game information from a champion
     * To calculate the average information about a champion, we need to accumulate
     * the data from all the games played with it. So with this function, it modifies the values
     * depending of it its an incremental value (like number of games played) or an average (like the winrate)
     * @param {ChampDto} acc Accumulated data object
     * @param {ChampDto} cur Current data object
     * @returns {ChampDto} Modified accumulated data object
     */
    private accumulateGameData(acc: ChampDto, cur: ChampDto): ChampDto {
        const avg = (a: number, b: number, n: number) => parseFloat(((a * n + b) / (n + 1)).toFixed(2))

        const props_max = ['maxKills', 'maxDeaths']
        const props_increment = ['doubleKills', 'tripleKills', 'quadraKills', 'pentaKills', 'winrate']
        const props_average = [
            'kills',
            'deaths',
            'assists',
            'kda',
            'cs',
            'csmin',
            'gold',
            'avgDamageTaken',
            'avgDamageDealt',
            'visionScore',
            'timePlayed',
            'turretKills',
        ]

        // Max props: return the bigger value between the accumulated value and the new value
        for (const prop of props_max) {
            acc[prop] = cur[prop] > acc[prop] ? cur[prop] : acc[prop]
        }

        // Incremental props: just add the new value to the accumulated value
        for (const prop of props_increment) {
            acc[prop] += cur[prop]
        }

        // Average props: calculate the average of the accumulated value and the new value
        for (const prop of props_average) {
            acc[prop] = avg(acc[prop], cur[prop], acc.games)
        }

        // Don't accumulate games before to don't break averages for loop
        acc.games += 1
        return acc
    }

    /**
     * ## Server region validator
     * Depending of the server, the games must be requested to a different region
     * @param {string} server Server name (e.g. 'euw1')
     * @returns {string} region name (e.g. 'EUROPE')
     */
    private serverRegion(server: string): string {
        const servers: { [key: string]: string } = {
            oc1: 'AMERICAS',
            la1: 'AMERICAS',
            la2: 'AMERICAS',
            br1: 'AMERICAS',
            na1: 'AMERICAS',
            jp1: 'ASIA',
            kr: 'ASIA',
            euw1: 'EUROPE',
            eun1: 'EUROPE',
            tr1: 'EUROPE',
            ru: 'EUROPE',
        }

        return servers[server] ?? 'EUROPE'
    }

    /**
     * ## Get the stats by champ
     * Loops over last 100 games and gets the stats by champ
     * Calls each game info individually and calculates the stats by champ
     * @param {string} puuid The puuid of the summoner
     * @param {string} server The server of the player
     * @param {number} champsLimit The number of champs to return
     * @param {number} gamesLimit The number of games to analyze
     * @param {number} offset The number of games to skip before starting to analyze
     * @param {string} queueType Specify to check only a specific queue ('ranked', 'normal', 'all')
     * @returns {Player} The info of the player
     */
    async getChampsData(
        puuid: string,
        server: string,
        champsLimit: number,
        gamesLimit: number,
        offset: number,
        queueType: string,
    ): Promise<any> {
        this.logger.verbose(`Getting data from last ${gamesLimit} games`)
        // Validate queueType
        const queueTypes: { [key: string]: string } = {
            normal: '&type=normal',
            ranked: '&type=ranked',
            all: '',
        }
        const queue = queueTypes[queueType] ?? '&type=normal'

        server = this.serverRegion(server)

        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${offset}&count=${gamesLimit}${queue}`
        const games_list: string[] = (await lastValueFrom(this.httpService.get(url, this.headers))).data

        // Accumulate the promises of each game
        const promises: Promise<any>[] = games_list.map((game_id: string) => {
            const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/${game_id}`

            return lastValueFrom(this.httpService.get(url, this.headers))
        })

        // Run all the promises in parallel
        const games = await Promise.all(promises)
        const temp: { [key: string]: ChampDto } = {}

        for (const game of games) {
            const idx: number = game.data.metadata.participants.indexOf(puuid)
            const data: any = game.data.info.participants[idx]
            const { gameId, gameMode, gameDuration } = game.data.info

            this.logger.log(`Processing game: ${gameId} \t ${gameMode} \t ${data.championName}`)

            const gameInfo = await this.processGameData(gameDuration, data)
            const champName: string = gameInfo.name

            temp[champName] = temp[champName] ? this.accumulateGameData(temp[champName], gameInfo) : gameInfo
        }
        const result = Object.values(temp)

        // Sort the champs by number of games played
        result.sort((a: any, b: any) => {
            return b.games - a.games
        })

        // Slice result if exceeds the limiit
        if (champsLimit < result.length) {
            result.length = champsLimit
        }

        this.logger.verbose(`Got { ${Object.keys(temp).length} } champs from { ${games.length} } games`)
        this.logger.verbose(`Returning { ${result.length} } champs. Max set to { ${champsLimit} }`)

        return result
    }
}
