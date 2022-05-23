import { Controller, Get, Logger, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DatabaseService } from '../database/database.service'
import { SummonersService } from './summoners.service'
import { GameDto, MasteryDto, PlayerDto } from './dto'
import { validateTTL } from '../common/validators'
import {
    QueryChampsLimit,
    QueryGamesLimit,
    QueryMasteriesLimit,
    QueryOffset,
    QueryQueueType,
    ParamServer,
    ParamSummonerName,
} from './decorators'

@ApiTags('summoners')
@Controller('summoners')
export class SummonersController {
    private readonly logger: Logger

    constructor(private readonly summonersService: SummonersService, private readonly databaseService: DatabaseService) {
        this.logger = new Logger(this.constructor.name)
    }

    /**
     * ## Get summoner information by summoner name
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
        @Query('queueType') queueType: string,
    ): Promise<PlayerDto> {
        this.logger.verbose(`Started a complete search for: ${summonerName}`)

        const redisData = await this.databaseService.recoverSummonerData(server, summonerName)

        if (redisData) {
            const stillValid = validateTTL(redisData.ttl)
            const numGamesStored = redisData.data.games.length

            if (stillValid) {
                if (numGamesStored >= gamesLimit) {
                    return redisData.data
                } else {
                    this.logger.verbose(`Found ${numGamesStored} games in redis, but ${gamesLimit} are required.`)
                    const { puuid } = await this.summonersService.getSummonerDataByName(summonerName, server)

                    // Append new games to the existing ones in redisData
                    const newGames = await this.summonersService.getGames(
                        puuid,
                        server,
                        gamesLimit - numGamesStored,
                        numGamesStored,
                        queueType,
                    )

                    redisData.data.games.push(...newGames)
                    await this.databaseService.saveSummonerData(server, summonerName, redisData.data)
                    this.logger.verbose('Done!')

                    return redisData.data
                }
            }
        }

        const version = await this.summonersService.getLatestVersion()
        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const { solo, flex } = await this.summonersService.getRankData(summonerData.id, server)
        const masteries = await this.summonersService.getMasteries(summonerData.id, server, 0)
        const games = await this.summonersService.getGames(summonerData.puuid, server, gamesLimit, 0, queueType)

        const result = {
            alias: summonerData.name,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summonerData.profileIconId}.png`,
            level: summonerData.summonerLevel,
            rank: {
                solo,
                flex,
            },
            games,
            masteries,
        }

        await this.databaseService.saveSummonerData(server, summonerName, result)
        this.logger.verbose('Done!')
        return result
    }

    /**
     * ## Get summoner information by summoner name
     * @param server Server name (e.g. 'euw1')
     * @param summonerName Summoner name in the game
     * @param gamesLimit Limit of games to be checked (default: 50)
     * @param offset Offset of the games to be checked (default: 0)
     * @param queueType Specify to check only a specific queue ('ranked' or 'normal')
     * @returns Array of games
     */
    @Get('/:server/:summonerName/games')
    @ApiOperation({
        summary: 'Get champs',
        description: 'Returns the champs information from a summoner. Loads the last X games and returns the stats calculated',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: [GameDto],
    })
    @ParamServer()
    @ParamSummonerName()
    @QueryGamesLimit()
    @QueryOffset()
    @QueryQueueType()
    async getGames(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('gamesLimit') gamesLimit = 10,
        @Query('offset') offset = 0,
        @Query('queueType') queueType: string,
    ): Promise<GameDto[]> {
        this.logger.verbose(`Started a ${gamesLimit} games search for: ${summonerName}`)

        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const games = await this.summonersService.getGames(summonerData.puuid, server, gamesLimit, offset, queueType)

        this.logger.verbose('Done!')

        return games
    }

    /**
     * ## Get masteries of a summoner
     * @param {string} server Server name (e.g. 'euw1')
     * @param {string} summonerName Summoner name in the game
     * @param {number} masteriesLimit Limit of masteries to be returned (default: 24)
     * @returns {Promise<MasteryDto[]>} Player object with all the information
     */
    @Get('/:server/:summonerName/masteries')
    @ApiOperation({
        summary: 'Get masteries',
        description: 'Returns the number of masteries requested, sort by most points',
        deprecated: true,
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: [MasteryDto],
    })
    @ParamServer()
    @ParamSummonerName()
    @QueryMasteriesLimit()
    async getMasteries(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('masteriesLimit') masteriesLimit = 24,
    ): Promise<MasteryDto[]> {
        this.logger.verbose(`Started a masteries search for: ${summonerName}`)

        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const masteries = await this.summonersService.getMasteries(summonerData.id, server, masteriesLimit)

        this.logger.verbose('Done!')

        return masteries
    }
}
