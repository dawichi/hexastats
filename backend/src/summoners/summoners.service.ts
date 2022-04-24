import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { Champ, Mastery, Rank, Summoner } from 'src/interfaces'

@Injectable()
export class SummonersService {
    readonly apiKey: string
    readonly headers: { headers: { 'X-Riot-Token': string } }

    constructor(private configService: ConfigService, private httpService: HttpService) {
        // TODO: check if the api key is valid, if not, throw an error and stop the app
        this.apiKey = this.configService.get<string>('RIOT_API_KEY')
        this.headers = { headers: { 'X-Riot-Token': this.apiKey } }
    }

    private readonly logger = new Logger(SummonersService.name)

    private baseUrl(server: string) {
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
    async getSummonerDataByName(summoner_name: string, server: string): Promise<Summoner> {
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
    async getChampionName(champion_id: number): Promise<string> {
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
     * @returns {Promise<Mastery[]>} The list of biggest masteries
     */
    async getMasteries(summoner_id: string, server: string, masteriesLimit: number): Promise<Mastery[]> {
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
        solo: Rank
        flex: Rank
    }> {
        this.logger.verbose('Getting classification data in ranked queues')
        const url = `${this.baseUrl(server)}league/v4/entries/by-summoner/${summoner_id}`
        const rank_data: any[] = (await lastValueFrom(this.httpService.get(url, this.headers))).data
        const league_default = {
            rank: 'Unranked',
            image: '/images/league-emblems/Unranked.png',
            lp: 0,
            win: 0,
            lose: 0,
            winrate: 0,
        }
        const winrate = (wins: number, losses: number) => (wins && losses ? (wins / (wins + losses)) * 100 : 0)
        const buildRank = (i: number): Rank => {
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

        // Is ranked in only one queue: check which one
        if (rank_data.length == 1) {
            return rank_data[0].queueType == 'RANKED_SOLO_5x5'
                ? {
                      solo: buildRank(0),
                      flex: league_default,
                  }
                : {
                      solo: league_default,
                      flex: buildRank(0),
                  }
        }

        // Is ranked in both queues: check the order
        if (rank_data[0]['queueType'] == 'RANKED_SOLO_5x5') {
            return {
                solo: buildRank(0),
                flex: buildRank(1),
            }
        }
        return {
            solo: buildRank(1),
            flex: buildRank(0),
        }
    }

    /**
     * ## Get the information of a single game
     * By using the game id, we can get all the info of a single game
     * This will be used later to calc the stats by champ
     * @param {string} puuid The puuid of the summoner
     * @param {string} game_id The id of the game
     * @param {string} server The server of the game
     * @returns {Champ} The info of a unique game
     */
    private async getSingleGameInfo(puuid: string, game_id: string, server: string): Promise<Champ> {
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
            totalDamageDealt,
            goldEarned,
        } = data
        const kda = data.challenges.kda
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
            double_kills: doubleKills,
            triple_kills: tripleKills,
            quadra_kills: quadraKills,
            penta_kills: pentaKills,
            cs,
            csmin: cs_min,
            gold: goldEarned,
            avg_damage_taken: totalDamageTaken,
            avg_damage_dealt: totalDamageDealt,
            games: 1,
            max_kills: kills,
            max_deaths: deaths,
            winrate: win ? 1 : 0,
            //'Damage to champions': dmg_champions,
        }
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
        const queueTypes = {
            normal: '&type=normal',
            ranked: '&type=ranked',
        }
        const queue = queueTypes[queueType] ?? ''

        switch (server) {
            case 'oc1':
            case 'la1':
            case 'la2':
            case 'br1':
            case 'na1':
                server = 'AMERICAS'
                break
            case 'jp1':
            case 'kr':
                server = 'ASIA'
                break
            default:
                server = 'EUROPE'
                break
        }

        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${gamesLimit + queue}`
        const games_names: any[] = (await lastValueFrom(this.httpService.get(url, this.headers))).data

        // TODO: Externalize (and factorize with arrays) this 2 functions
        const add_games = (acc: any, cur: any) => {
            const avg = (a: number, b: number, n: number) => (a * n + b) / (n + 1)

            acc.games += 1
            acc.assists = avg(acc.assists, cur.assists, acc.games)
            acc.deaths = avg(acc.deaths, cur.deaths, acc.games)
            acc.kills = avg(acc.kills, cur.kills, acc.games)
            acc.kda = avg(acc.kda, cur.kda, acc.games)
            acc.cs = avg(acc.cs, cur.cs, acc.games)
            acc.csmin = avg(acc.csmin, cur.csmin, acc.games)
            acc.avg_damage_dealt = avg(acc.avg_damage_dealt, cur.avg_damage_dealt, acc.games)
            acc.avg_damage_taken = avg(acc.avg_damage_taken, cur.avg_damage_taken, acc.games)
            acc.double_kills += cur.double_kills
            acc.triple_kills += cur.triple_kills
            acc.quadra_kills += cur.quadra_kills
            acc.penta_kills += cur.penta_kills
            acc.winrate += cur.winrate
            acc.max_deaths = cur.max_deaths > acc.max_deaths ? cur.max_deaths : acc.max_deaths
            acc.max_kills = cur.max_kills > acc.max_kills ? cur.max_kills : acc.max_kills

            return acc
        }

        const temp = {}

        for (const game of games_names) {
            const info = await this.getSingleGameInfo(puuid, game, server)
            const champ = info['name']

            temp[champ] = temp[champ] ? add_games(temp[champ], info) : info
        }
        const result = Object.values(temp)

        result.sort((a: any, b: any) => {
            return b.games - a.games
        })
        return result.slice(0, champsLimit)
    }
}
