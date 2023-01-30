import { Injectable, Logger, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { validateTTL } from '../../common/validators'
import { MasteryDto, PlayerDto } from '../../types'
import { DatabaseService } from '../database/database.service'
import { InfoResponse } from '../../common/types/InfoResponse.dto'
import { RiotService } from 'src/modules/riot/riot.service'

@ApiTags('summoners')
@Injectable()
export class SummonersService {
    private readonly logger = new Logger(this.constructor.name)

    constructor(private readonly riotService: RiotService, private readonly databaseService: DatabaseService) {}

    /**
     * ## Get summoner cached data
     */
    // private async getCachedData(server: string, summonerName: string, gamesLimit: number): Promise<PlayerDto> | null {
    //     // [ 1º CHECK ]: there is data in redis
    //     const redisData = await this.databaseService.getOne(`${server}:${summonerName}`)

    //     if (!redisData) return null

    //     // [ 2º CHECK ]: the data is still valid
    //     const stillValid = validateTTL(redisData.ttl)
    //     const numGamesStored: number = redisData.data.games.length

    //     if (!stillValid) return null

    //     // [ 3º CHECK ]: we have cached the last game
    //     // TODO: Eventually we could add the new ones and return mixed data
    //     const summonerData = await this.riotService.getBasicInfo(summonerName, server)
    //     const isLastGame = await this.riotService.isLastGame(server, summonerData.puuid, redisData.data.games[0].matchId)

    //     if (!isLastGame) return null

    //     // [ 4º CHECK ]: there are enough games
    //     if (numGamesStored >= gamesLimit) {
    //         this.logger.verbose(`Requested ${gamesLimit} games and ${numGamesStored} are stored. Returning the stored data.`)
    //         return redisData.data
    //     }

    //     // In case there are not enough games, we need to add new ones from the API to the stored data
    //     this.logger.verbose(`Found ${numGamesStored} games in redis, but ${gamesLimit} are required.`)
    //     this.logger.verbose('Adding 10 new games to redis data.')
    //     const { puuid } = await this.riotService.getBasicInfo(summonerName, server)
    //     const newGames = await this.riotService.getGames(puuid, server, 10, numGamesStored, 'all')

    //     // Store the new games in database with the already cached ones
    //     redisData.data.games.push(...newGames)
    //     await this.databaseService.addOne(`${server}:${summonerName}`, redisData.data)
    //     this.logger.verbose('Done!')
    //     return redisData.data
    // }

    // async getSummoner(
    //     server: string,
    //     summonerName: string,
    //     gamesLimit = 10,
    //     queueType: 'ranked' | 'normal' | 'all' = 'all',
    // ): Promise<PlayerDto> {
    //     // const cachedData = await this.getCachedData(server, summonerName, gamesLimit)

    //     // if (cachedData) {
    //     //     this.logger.verbose('Returning cached data!')
    //     //     return cachedData
    //     // }

    //     this.logger.verbose('Returning new data!')
    //     const newData = await this.riotService.getData(summonerName, server, gamesLimit, queueType)

    //     this.logger.verbose('Saving new data in redis!')
    //     await this.databaseService.addOne(`${server}:${summonerName}`, newData)

    //     this.logger.verbose('Done!')
    //     return newData
    // }

    // async getData(server: string, summonerName: string): Promise<PlayerDto> {
    //     return this.riotService.getData(summonerName, server)
    // }

    async getLevelImage(server: string, summonerName: string): Promise<InfoResponse> {
        const data = await this.riotService.getBasicInfo(summonerName, server)
        const version = await this.riotService.getLatestVersion()

        this.logger.log(`Returning ${data.name} lv ${data.summonerLevel}`)
        return {
            name: data.name,
            level: data.summonerLevel,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.profileIconId}.png`,
        }
    }

    async getMasteries(server: string, summonerName: string): Promise<MasteryDto[]> {
        return this.riotService.getMasteries(summonerName, server, 24)
    }
}
