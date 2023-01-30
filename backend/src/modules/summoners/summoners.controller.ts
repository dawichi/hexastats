import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { SummonersService } from './summoners.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiCustomResponse, ParamServer, ParamSummonerName } from 'src/common/decorators'
import { MasteryDto } from 'src/types'
import { InfoResponse } from 'src/common/types/InfoResponse.dto'
import { CacheInterceptor } from 'src/common/handlers/cache.interceptor'

@ApiTags('summoners')
@Controller('summoners')
@UseInterceptors(CacheInterceptor)
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    // @ApiOperation({
    //     summary: 'Get player info',
    //     description: 'Returns the player (summoner data and ranking information)',
    // })
    // @ParamServer()
    // @ParamSummonerName()
    // @QueryGamesLimit()
    // @QueryQueueType()
    // getSummoner(
    //     @Param('server') server: string,
    //     @Param('summonerName') summonerName: string,
    //     @Query('gamesLimit') gamesLimit = 10,
    //     @Query('queueType') queueType: 'ranked' | 'normal' | 'all' = 'all',
    // ) {
    //     return this.summonersService.getSummoner(server, summonerName, gamesLimit, queueType)
    // }

    /**
     * ## Get name, level and image
     * Returns complete information about a summoner.
     *
     * @param server Server name (e.g. 'euw1')
     * @param summonerName Summoner name in the game
     * @returns Player object with all the information
     */
    // @Get('/:server/:summonerName')
    // @ApiOperation({
    //     summary: 'Get summoner data and ranking infor',
    //     description: 'Returns the basic data along with the ranking information',
    // })
    // @ApiCustomResponse(PlayerDto)
    // @ParamServer()
    // @ParamSummonerName()
    // getData(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<PlayerDto> {
    //     return this.summonersService.getData(server, summonerName)
    // }

    /**
     * ## Get name, level and image
     * Returns complete information about a summoner.
     *
     * @param server Server name (e.g. 'euw1')
     * @param summonerName Summoner name in the game
     * @returns Player object with all the information
     */
    @Get('/:server/:summonerName/level-image')
    @ApiOperation({
        summary: 'Get level and image',
        description: 'Returns the name, level and image',
    })
    @ApiCustomResponse(InfoResponse)
    @ParamServer()
    @ParamSummonerName()
    getLevelImage(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<InfoResponse> {
        return this.summonersService.getLevelImage(server, summonerName)
    }

    /**
     * ## Get masteries
     * @param server Server name (e.g. 'euw1')
     * @param summonerName Summoner name in the game
     * @returns Array of masteries
     */
    @Get('/:server/:summonerName/masteries')
    @ApiOperation({
        summary: 'Get masteries',
        description: 'Returns an array of masteries',
    })
    @ApiCustomResponse([MasteryDto])
    @ParamServer()
    @ParamSummonerName()
    async getMasteries(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<MasteryDto[]> {
        return this.summonersService.getMasteries(server, summonerName)
    }
}
