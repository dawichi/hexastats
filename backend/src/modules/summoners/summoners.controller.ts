import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SummonersService } from './summoners.service'
import { ApiCustomResponse, ParamServer, ParamSummonerName, QueryLimit, QueryOffset } from '../../common/decorators'
import { GameDto, MasteryDto, PlayerDto, RankDataDto, StatsDto } from '../../common/types'
import { LimitPipe, OffsetPipe } from '../../common/pipes'

@ApiTags('summoners')
@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    @Get('/:server/:summonerName')
    @ApiOperation({
        summary: 'Get basic data & ranking info',
    })
    @ApiCustomResponse(RankDataDto)
    @ParamServer()
    @ParamSummonerName()
    async getSummoner(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<RankDataDto> {
        return this.summonersService.getSummoner(server, encodeURI(summonerName.trim()))
    }

    @Get('/:server/:summonerName/level-image')
    @ApiOperation({
        summary: 'Get only basic data (skip ranking info)',
    })
    @ApiCustomResponse(PlayerDto)
    @ParamServer()
    @ParamSummonerName()
    async getLevelImage(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<PlayerDto> {
        return this.summonersService.getLevelImage(server, encodeURI(summonerName.trim()))
    }

    @Get('/:server/:summonerName/masteries')
    @ApiOperation({
        summary: 'Get masteries',
    })
    @ApiCustomResponse([MasteryDto])
    @ParamServer()
    @ParamSummonerName()
    async getMasteries(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<MasteryDto[]> {
        const masteries_limit = 12

        return this.summonersService.getMasteries(server, encodeURI(summonerName.trim()), masteries_limit)
    }

    @Get('/:server/:summonerName/games')
    @ApiOperation({
        summary: 'Get games',
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

    @Get('/:server/:summonerName/stats')
    @ApiOperation({
        summary: 'Get stats',
    })
    @ApiCustomResponse([StatsDto])
    @ParamServer()
    @ParamSummonerName()
    async getStats(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<StatsDto> {
        return this.summonersService.getStats(server, encodeURI(summonerName.trim()))
    }
}
