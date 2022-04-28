import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { ChampDto, MasteryDto, RankDto, SummonerDto } from 'src/interfaces'

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
     * ## Get the champion name (by id)
     * Riot stores an array with all the chamions, so to get the name
     * you need to get the id and search in the array for that id
     * @param {number} champion_id ID of the champion
     * @returns {Promise<string>} The name of the champion
     */
    private async getChampionName(champion_id: number): Promise<string> {
        const version = await this.getLatestVersion()
        const url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
        const champion_names = (await lastValueFrom(this.httpService.get(url, this.headers))).data.data

        return Object.keys(champion_names).find(champion_name => champion_names[champion_name].key == champion_id)
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
        const all_champions = (await lastValueFrom(this.httpService.get(url, this.headers))).data
        // This response cointains all +140 champions, so we filter it
        const masteries = []

        for (let i = 0; i < masteriesLimit; i++) {
            const champ_name = await this.getChampionName(all_champions[i].championId)

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
                image: rank_data[i].tier ? `${rank_data[i].tier}.png` : 'unranked.png',
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
     * ## Get the information of a single game
     * By using the game id, we can get all the info of a single game
     * This will be used later to calc the stats by champ
     * @param {string} puuid The puuid of the summoner
     * @param {string} game_id The id of the game
     * @param {string} server The server of the game
     * @returns {ChampDto} The info of a unique game
     */
    private async getSingleGameInfo(puuid: string, game_id: string, server: string): Promise<ChampDto> {
        this.logger.log(`Loading game: ${game_id}`)
        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/${game_id}`
        const game_data: any = (await lastValueFrom(this.httpService.get(url, this.headers))).data

        const idx: number = game_data.metadata.participants.indexOf(puuid)
        const data: any = game_data.info.participants[idx]

        const {
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
        } = data

        const kda = deaths ? (kills + assists) / deaths : kills + assists
        const cs = data.totalMinionsKilled + data.neutralMinionsKilled
        const cs_min = parseFloat(((60 * cs) / game_data.info.gameDuration).toFixed(1))

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
            csmin: cs_min,
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

        const props_increment = ['doubleKills', 'tripleKills', 'quadraKills', 'pentaKills', 'winrate']
        const props_average = [
            'kills',
            'deaths',
            'assists',
            'kda',
            'cs',
            'csmin',
            'avgDamageTaken',
            'avgDamageDealt',
            'visionScore',
            'timePlayed',
            'turretKills',
        ]
        const props_max = ['maxKills', 'maxDeaths']

        // Incremental props: just add the new value to the accumulated value
        for (const prop of props_increment) {
            acc[prop] += cur[prop]
        }

        // Average props: calculate the average of the accumulated value and the new value
        for (const prop of props_average) {
            acc[prop] = avg(acc[prop], cur[prop], acc.games)
        }

        // Max props: return the bigger value between the accumulated value and the new value
        for (const prop of props_max) {
            acc[prop] = cur[prop] > acc[prop] ? cur[prop] : acc[prop]
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
        const servers = {
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
     * @param {string} queueType Specify to check only a specific queue ('ranked', 'normal', 'all')
     * @returns {Player} The info of the player
     */
    async getChampsData(puuid: string, server: string, gamesLimit: number, queueType: string, champsLimit: number): Promise<any> {
        this.logger.verbose(`Getting data from last ${gamesLimit} games`)
        // Validate queueType
        const queueTypes = {
            normal: '&type=normal',
            ranked: '&type=ranked',
        }
        const queue = queueTypes[queueType] ?? ''

        server = this.serverRegion(server)

        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${gamesLimit + queue}`
        const games_list: string[] = (await lastValueFrom(this.httpService.get(url, this.headers))).data

        const temp = {}

        for (const game of games_list) {
            const info = await this.getSingleGameInfo(puuid, game, server)
            const champ = info['name']

            temp[champ] = temp[champ] ? this.accumulateGameData(temp[champ], info) : info
        }
        const result = Object.values(temp)

        result.sort((a: any, b: any) => {
            return b.games - a.games
        })
        return result.slice(0, champsLimit)
    }
}
