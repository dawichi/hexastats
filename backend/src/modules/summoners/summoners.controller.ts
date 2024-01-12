import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SummonersService } from './summoners.service'
import { ApiCustomResponse, ParamServer, ParamRiotId, QueryLimit, QueryOffset, QueryQueueType } from '../../common/decorators'
import {
    GameArenaDto,
    GameDetailDto,
    GameDto,
    GameNormalDto,
    MasteryDto,
    PlayerDto,
    RankDataDto,
    RiotIdDto,
    StatsDto,
} from '../../common/types'
import { LimitPipe, OffsetPipe, QueueTypePipe, RiotIdPipe, ServerPipe } from '../../common/pipes'
import { QueueType } from '../../common/schemas'

@ApiTags('summoners')
@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    @Get('/:server/:riotId')
    @ApiOperation({ summary: 'Get basic data & ranking info' })
    @ApiCustomResponse(RankDataDto)
    @ParamServer()
    @ParamRiotId()
    async getSummoner(@Param('server', ServerPipe) server: string, @Param('riotId', RiotIdPipe) riotId: RiotIdDto): Promise<RankDataDto> {
        return this.summonersService.getSummoner(server, riotId)
    }

    @Get('/:server/:riotId/level-image')
    @ApiOperation({ summary: 'Get only basic data (skip ranking info)' })
    @ApiCustomResponse(PlayerDto)
    @ParamServer()
    @ParamRiotId()
    async getLevelImage(@Param('server', ServerPipe) server: string, @Param('riotId', RiotIdPipe) riotId: RiotIdDto): Promise<PlayerDto> {
        return this.summonersService.getLevelImage(server, riotId)
    }

    @Get('/:server/:riotId/masteries')
    @ApiOperation({ summary: 'Get masteries' })
    @ApiCustomResponse([MasteryDto])
    @ParamServer()
    @ParamRiotId()
    async getMasteries(@Param('server', ServerPipe) server: string, @Param('riotId', RiotIdPipe) riotId: RiotIdDto): Promise<MasteryDto[]> {
        const masteries_limit = 12

        return this.summonersService.getMasteries(server, riotId, masteries_limit)
    }

    @Get('/:server/:riotId/games')
    @ApiOperation({ summary: 'Get games' })
    @ApiCustomResponse([GameDto]) // TODO: Change to GameNormalDto | GameArenaDto
    @ParamServer()
    @ParamRiotId()
    @QueryLimit()
    @QueryOffset()
    @QueryQueueType()
    async getGames(
        @Param('server', ServerPipe) server: string,
        @Param('riotId', RiotIdPipe) riotId: RiotIdDto,
        @Query('limit', LimitPipe) limit: number,
        @Query('offset', OffsetPipe) offset: number,
        @Query('queueType', QueueTypePipe) queueType: QueueType,
    ): Promise<Array<GameNormalDto | GameArenaDto>> {
        return this.summonersService.getGames(server, riotId, limit, offset, queueType)
    }

    @Get('/:server/:riotId/games/:matchId')
    @ApiOperation({ summary: 'Get game detail' })
    @ApiCustomResponse(GameDetailDto)
    @ParamServer()
    @ParamRiotId()
    async getGameDetail(
        @Param('server', ServerPipe) server: string,
        @Param('riotId', RiotIdPipe) riotId: RiotIdDto,
        @Param('matchId') matchId: string,
    ): Promise<GameDetailDto> {
        return this.summonersService.getGameDetail(server, riotId, matchId)
    }

    @Get('/:server/:riotId/stats')
    @ApiOperation({ summary: 'Get stats' })
    @ApiCustomResponse([StatsDto])
    @ParamServer()
    @ParamRiotId()
    async getStats(@Param('server', ServerPipe) server: string, @Param('riotId', RiotIdPipe) riotId: RiotIdDto): Promise<StatsDto> {
        return this.summonersService.getStats(server, riotId)
    }

    @Get('/:server/:riotId/stats/add')
    @ApiOperation({ summary: 'Generate new stats with + 10 extra games' })
    @ApiCustomResponse([StatsDto])
    @ParamServer()
    @ParamRiotId()
    async addStats(@Param('server', ServerPipe) server: string, @Param('riotId', RiotIdPipe) riotId: RiotIdDto): Promise<StatsDto> {
        return this.summonersService.addStats(server, riotId)
    }
}
