import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { Summoner } from 'src/interfaces'

const url = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
const versions = 'https://ddragon.leagueoflegends.com/api/versions.json'

@Injectable()
export class SummonersService {
    baseUrl: string
    getHeaders: {
        headers: {
            'X-Riot-Token': string
        }
    }
    constructor(private configService: ConfigService, private httpService: HttpService) {
        this.getHeaders = {
            headers: {
                'X-Riot-Token': this.getApiKey(),
            },
        }
        this.baseUrl = 'https://euw1.api.riotgames.com/lol'
    }
    private getApiKey(): string {
        return this.configService.get<string>('RIOT_API_KEY') ?? 'No_ApiKey'
    }
    private async getVersion(): Promise<string> {
        const response = this.httpService.get(versions, this.getHeaders)
        return (await lastValueFrom(response)).data[0]
    }
    async getSummonerByName(name: string): Promise<Summoner> {
        return (await lastValueFrom(this.httpService.get(`${url + name}`, this.getHeaders))).data
    }
    async getChampionName(champion_id: number): Promise<any> {
        const version = await this.getVersion()
        const champs_url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
        const champion_names = (await lastValueFrom(this.httpService.get(champs_url, this.getHeaders))).data.data
        return Object.keys(champion_names).find(champion_name => champion_names[champion_name].key == champion_id)
    }

    async getMastery(summoner_id: string): Promise<any[]> {
        const masteries = []
        const version = await this.getVersion()
        const url = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}`
        const response = (await lastValueFrom(this.httpService.get(url, this.getHeaders))).data
        for (let i = 0; i < 7; i++) {
            const name = await this.getChampionName(response[i].championId)
            masteries.push({
                name: name,
                image: `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${name}.png`,
                level: response[i].championLevel,
                points: response[i].championPoints,
            })
        }
        return masteries
    }
}
