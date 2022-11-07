import { Controller, Get, Logger, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SummonersService } from './summoners.service'
import { validateTTL } from '../common/validators'
import { PlayerDto } from '../types'
import { DatabaseService } from '../database/database.service'
import { QueryGamesLimit, QueryQueueType, ParamServer, ParamSummonerName } from './decorators'

@ApiTags('summoners')
@Controller('summoners')
export class SummonersController {
    private readonly logger: Logger

    constructor(private readonly summonersService: SummonersService, private readonly databaseService: DatabaseService) {
        this.logger = new Logger(this.constructor.name)
    }

    /**
     * ## Get summoner cached data
     */
    private async getCachedData(server: string, summonerName: string, gamesLimit: number): Promise<PlayerDto> | null {
        // [ 1º CHECK ]: there is data in redis
        const redisData = await this.databaseService.getOne(`${server}:${summonerName}`)

        if (!redisData) return null

        // [ 2º CHECK ]: the data is still valid
        const stillValid = validateTTL(redisData.ttl)
        const numGamesStored: number = redisData.data.games.length

        if (!stillValid) return null

        // [ 3º CHECK ]: we have cached the last game
        // TODO: Eventually we could add the new ones and return mixed data
        const summonerData = await this.summonersService.getBasicInfo(summonerName, server)
        const isLastGame = await this.summonersService.isLastGame(server, summonerData.puuid, redisData.data.games[0].matchId)

        if (!isLastGame) return null

        // [ 4º CHECK ]: there are enough games
        if (numGamesStored >= gamesLimit) {
            this.logger.verbose(`Requested ${gamesLimit} games and ${numGamesStored} are stored. Returning the stored data.`)
            return redisData.data
        }

        // In case there are not enough games, we need to add new ones from the API to the stored data
        this.logger.verbose(`Found ${numGamesStored} games in redis, but ${gamesLimit} are required.`)
        this.logger.verbose('Adding 10 new games to redis data.')
        const { puuid } = await this.summonersService.getBasicInfo(summonerName, server)
        const newGames = await this.summonersService.getGames(puuid, server, 10, numGamesStored, 'all')

        // Store the new games in database with the already cached ones
        redisData.data.games.push(...newGames)
        await this.databaseService.addOne(`${server}:${summonerName}`, redisData.data)
        this.logger.verbose('Done!')
        return redisData.data
    }

    /**
     * ## Get summoner information by summoner name
     * Returns complete information about a summoner.
     *
     * @param {string} server Server name (e.g. 'euw1')
     * @param {string} summonerName Summoner name in the game
     * @returns {Promise<PlayerDto>} Player object with all the information
     */
    @Get('/:server/:summonerName')
    @ApiOperation({
        summary: 'Get player info',
        description: 'Returns the complete info (summoner data, rankings, masteries and champs)',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: PlayerDto,
    })
    @ParamServer()
    @ParamSummonerName()
    @QueryGamesLimit()
    @QueryQueueType()
    async getSummoner(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('gamesLimit') gamesLimit = 10,
        @Query('queueType') queueType: 'ranked' | 'normal' | 'all' = 'all',
    ): Promise<PlayerDto> {
        const cachedData = await this.getCachedData(server, summonerName, gamesLimit)

        if (cachedData) {
            this.logger.verbose('Returning cached data!')
            return cachedData
        }

        this.logger.verbose('Returning new data!')
        const newData = await this.summonersService.getData(summonerName, server, gamesLimit, queueType)

        this.logger.verbose('Saving new data in redis!')
        await this.databaseService.addOne(`${server}:${summonerName}`, newData)

        this.logger.verbose('Done!')
        return newData
    }
}
