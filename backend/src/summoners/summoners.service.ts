import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { Summoner } from 'src/interfaces'

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
        const url = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}`
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
}
