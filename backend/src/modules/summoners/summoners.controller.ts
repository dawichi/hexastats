import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SummonersService } from './summoners.service'
import { ApiCustomResponse, ParamServer, ParamSummonerName, QueryLimit, QueryOffset, QueryQueueType } from '../../common/decorators'
import { GameArenaDto, GameDetailDto, GameDto, GameNormalDto, MasteryDto, PlayerDto, RankDataDto, StatsDto } from '../../common/types'
import { LimitPipe, OffsetPipe, QueueTypePipe, ServerPipe } from '../../common/pipes'
import { QueueType } from 'src/common/schemas'

@ApiTags('summoners')
@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    @Get('/:server/:summonerName')
    @ApiOperation({ summary: 'Get basic data & ranking info' })
    @ApiCustomResponse(RankDataDto)
    @ParamServer()
    @ParamSummonerName()
    async getSummoner(@Param('server', ServerPipe) server: string, @Param('summonerName') summonerName: string): Promise<RankDataDto> {
        return this.summonersService.getSummoner(server, encodeURI(summonerName.trim()))
    }

    @Get('/:server/:summonerName/level-image')
    @ApiOperation({ summary: 'Get only basic data (skip ranking info)' })
    @ApiCustomResponse(PlayerDto)
    @ParamServer()
    @ParamSummonerName()
    async getLevelImage(@Param('server', ServerPipe) server: string, @Param('summonerName') summonerName: string): Promise<PlayerDto> {
        return this.summonersService.getLevelImage(server, encodeURI(summonerName.trim()))
    }

    @Get('/:server/:summonerName/masteries')
    @ApiOperation({ summary: 'Get masteries' })
    @ApiCustomResponse([MasteryDto])
    @ParamServer()
    @ParamSummonerName()
    async getMasteries(@Param('server', ServerPipe) server: string, @Param('summonerName') summonerName: string): Promise<MasteryDto[]> {
        const masteries_limit = 12

        return this.summonersService.getMasteries(server, encodeURI(summonerName.trim()), masteries_limit)
    }

    @Get('/:server/:summonerName/games')
    @ApiOperation({ summary: 'Get games' })
    @ApiCustomResponse([GameDto]) // TODO: Change to GameNormalDto | GameArenaDto
    @ParamServer()
    @ParamSummonerName()
    @QueryLimit()
    @QueryOffset()
    @QueryQueueType()
    async getGames(
        @Param('server', ServerPipe) server: string,
        @Param('summonerName') summonerName: string,
        @Query('limit', LimitPipe) limit: number,
        @Query('offset', OffsetPipe) offset: number,
        @Query('queueType', QueueTypePipe) queueType: QueueType,
    ): Promise<Array<GameNormalDto | GameArenaDto>> {
        return this.summonersService.getGames(server, encodeURI(summonerName.trim()), limit, offset, queueType)
    }

    @Get('/:server/:summonerName/games/:matchId')
    @ApiOperation({ summary: 'Get game detail' })
    @ApiCustomResponse(GameDetailDto)
    @ParamServer()
    @ParamSummonerName()
    async getGameDetail(
        @Param('server', ServerPipe) server: string,
        @Param('summonerName') summonerName: string,
        @Param('matchId') matchId: string,
    ): Promise<GameDetailDto> {
        return this.summonersService.getGameDetail(server, summonerName, matchId)
    }

    @Get('/:server/:summonerName/stats')
    @ApiOperation({ summary: 'Get stats' })
    @ApiCustomResponse([StatsDto])
    @ParamServer()
    @ParamSummonerName()
    async getStats(@Param('server', ServerPipe) server: string, @Param('summonerName') summonerName: string): Promise<StatsDto> {
        return this.summonersService.getStats(server, encodeURI(summonerName.trim()))
    }

    @Get('/:server/:summonerName/stats/add')
    @ApiOperation({ summary: 'Generate new stats with + 10 extra games' })
    @ApiCustomResponse([StatsDto])
    @ParamServer()
    @ParamSummonerName()
    async addStats(@Param('server', ServerPipe) server: string, @Param('summonerName') summonerName: string): Promise<StatsDto> {
        return this.summonersService.addStats(server, encodeURI(summonerName.trim()))
    }
}
