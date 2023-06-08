import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { SummonersService } from './summoners.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiCustomResponse, ParamServer, ParamSummonerName, QueryLimit, QueryOffset } from '../../common/decorators'
import { CacheInterceptor } from '../../common/handlers/cache.interceptor'
import { GameDto, MasteryDto, PlayerDto, RankDataDto } from '../../common/types'
import { LimitPipe, OffsetPipe } from '../../common/pipes'

@ApiTags('summoners')
@Controller('summoners')
@UseInterceptors(CacheInterceptor)
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    /**
     * ## Get name, level and image
     * Returns complete information about a summoner.
     */
    @Get('/:server/:summonerName')
    @ApiOperation({
        summary: 'Get summoner data and ranking infor',
        description: 'Returns the basic data along with the ranking information',
    })
    @ApiCustomResponse(RankDataDto)
    @ParamServer()
    @ParamSummonerName()
    getSummoner(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<RankDataDto> {
        return this.summonersService.getSummoner(server, encodeURI(summonerName.trim()))
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
    @ApiCustomResponse(PlayerDto)
    @ParamServer()
    @ParamSummonerName()
    getLevelImage(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<PlayerDto> {
        return this.summonersService.getLevelImage(server, encodeURI(summonerName.trim()))
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
        return this.summonersService.getMasteries(server, encodeURI(summonerName.trim()))
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
    @QueryLimit()
    @QueryOffset()
    async getGames(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('limit', LimitPipe) limit: number,
        @Query('offset', OffsetPipe) offset: number,
    ): Promise<GameDto[]> {
        return this.summonersService.getGames(server, encodeURI(summonerName.trim()), limit, offset)
    }
}
