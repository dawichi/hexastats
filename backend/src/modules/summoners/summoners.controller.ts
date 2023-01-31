import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { SummonersService } from './summoners.service'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ApiCustomResponse, ParamServer, ParamSummonerName } from 'src/common/decorators'
import { GameDto, MasteryDto, PlayerDto } from 'src/types'
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
     */
    @Get('/:server/:summonerName')
    @ApiOperation({
        summary: 'Get summoner data and ranking infor',
        description: 'Returns the basic data along with the ranking information',
    })
    @ApiCustomResponse(PlayerDto)
    @ParamServer()
    @ParamSummonerName()
    getSummoner(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<PlayerDto> {
        return this.summonersService.getSummoner(server, summonerName)
    }

    /**
     * ## Get name, level and image
     * Returns complete information about a summoner.
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

    /**
     * ## Get games
     */
    @Get('/:server/:summonerName/games')
    @ApiOperation({
        summary: 'Get games',
        description: 'Returns an array of games',
    })
    @ApiCustomResponse([GameDto])
    @ParamServer()
    @ParamSummonerName()
    async getGames(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<GameDto[]> {
        return this.summonersService.getGames(server, summonerName)
    }
}
