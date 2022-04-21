import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { Rank, Summoner } from 'src/interfaces'

@Injectable()
export class SummonersService {
    baseUrl: string
    apiKey: string
    headers: { headers: { 'X-Riot-Token': string } }

    // TODO: handle errors when riot api doen't respond
    // it should return 404, 403, etc... instead of 500
    constructor(private configService: ConfigService, private httpService: HttpService) {
        this.baseUrl = 'https://euw1.api.riotgames.com/lol/'
        this.apiKey = this.configService.get<string>('RIOT_API_KEY')
        this.headers = { headers: { 'X-Riot-Token': this.apiKey } }
    }

    /**
     * ## Get the latest version of the game
     * Riot stores all game versions in an array, so by getting
     * the first one you can get the latest version of the api
     * @returns {string}
     */
    private async getLatestVersion(): Promise<string> {
        const url = 'https://ddragon.leagueoflegends.com/api/versions.json'

        return (await lastValueFrom(this.httpService.get(url, this.headers))).data[0]
    }

    /**
     * ## Get the summoner information (by name)
     * To use other methods, you need to get the summoner id first
     * @param {string} summoner_name Alias of the summoner
     * @returns {Promise<Summoner>}
     */
    async getSummonerDataByName(summoner_name: string): Promise<Summoner> {
        const url = `${this.baseUrl}summoner/v4/summoners/by-name/${summoner_name}`

        return (await lastValueFrom(this.httpService.get(url, this.headers))).data
    }

    /**
     * ## Get the champion name (by id)
     * Riot stores an array with all the chamions, so to get the name
     * you need to get the id and search in the array for that id
     * @param {number} champion_id ID of the champion
     * @returns {Promise<string>}
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
     * @returns {Promise<Summoner>}
     */
    async getMasteries(summoner_id: string): Promise<any[]> {
        const version = await this.getLatestVersion()
        const url = `${this.baseUrl}champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}`
        const all_champions = (await lastValueFrom(this.httpService.get(url, this.headers))).data
        // This response cointains all +140 champions, so we filter it
        const masteries = []
        const num_of_champs_we_want = 7

        for (let i = 0; i < num_of_champs_we_want; i++) {
            const champ_name = await this.getChampionName(all_champions[i].championId)

            masteries.push({
                name: champ_name,
                image: `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ_name}.png`,
                level: all_champions[i].championLevel,
                points: all_champions[i].championPoints,
            })
        }
        return masteries
    }

    async getLeague(summoner_id: string): Promise<any> {
        const url = `${this.baseUrl}league/v4/entries/by-summoner/${summoner_id}`
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
        const rank = (i: number): Rank => {
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

        // Is ranked in only one queue
        if (rank_data.length == 1) {
            return rank_data[0].queueType == 'RANKED_SOLO_5x5'
                ? {
                      solo: rank(0),
                      flex: league_default,
                  }
                : {
                      solo: league_default,
                      flex: rank(0),
                  }
        }

        // Is ranked in both queues
        if (rank_data[0]['queueType'] == 'RANKED_SOLO_5x5') {
            return {
                solo: rank(0),
                flex: rank(1),
            }
        }
        return {
            solo: rank(1),
            flex: rank(0),
        }
    }

    private async getGameInfo(puuid: string, game_id: string, server: string): Promise<any> {
        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/${game_id}`
        const game_data: any = (await lastValueFrom(this.httpService.get(url, this.headers))).data
        const idx: number = game_data.metadata.participants.indexOf(puuid)
        const data = game_data.info.participants[idx]
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
            assists: assists,
            deaths: deaths,
            kills: kills,
            kda: kda,
            double_kills: doubleKills,
            triple_kills: tripleKills,
            quadra_kills: quadraKills,
            penta_kills: pentaKills,
            cs: cs,
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

    async getGames(puuid: string, server: string): Promise<any> {
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

        const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`
        const games_names: any[] = (await lastValueFrom(this.httpService.get(url, this.headers))).data

        const avg = (a, b, n) => (a * n + b) / (n + 1)
        const add_games = (acc, cur) => {
            const games_number = acc.games

            acc.games += 1
            acc.assists = avg(acc.assists, cur.assists, games_number)
            acc.deaths = avg(acc.deaths, cur.deaths, games_number)
            acc.kills = avg(acc.kills, cur.kills, games_number)
            acc.kda = avg(acc.kda, cur.kda, games_number)
            acc.cs = avg(acc.cs, cur.cs, games_number)
            acc.csmin = avg(acc.csmin, cur.csmin, games_number)
            acc.avg_damage_dealt = avg(acc.avg_damage_dealt, cur.avg_damage_dealt, games_number)
            acc.avg_damage_taken = avg(acc.avg_damage_taken, cur.avg_damage_taken, games_number)
            acc.double_kills += cur.double_kills
            acc.triple_kills += cur.triple_kills
            acc.quadra_kills += cur.quadra_kills
            acc.penta_kills += cur.penta_kills
            acc.winrate += cur.winrate
            acc.max_deaths = cur.max_deaths > acc.max_deaths ? cur.max_deaths : acc.max_deaths
            acc.max_kills = cur.max_kills > acc.max_kills ? cur.max_kills : acc.max_kills

            return acc
        }

        const games_info = {}

        for (const game of games_names) {
            const info = await this.getGameInfo(puuid, game, server)
            const champ = info['name']

            games_info[champ] = games_info[champ] ? add_games(games_info[champ], info) : info
        }
        const arr = Object.values(games_info)

        arr.sort((a: any, b: any) => {
            return b.games - a.games
        })
        return arr
    }
}
