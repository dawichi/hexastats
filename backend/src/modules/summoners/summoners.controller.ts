import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { SummonersService } from './summoners.service'
import { ParseUUIDPipe } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ParamServer, ParamSummonerName, QueryGamesLimit, QueryQueueType } from 'src/common/decorators'
import { MasteryDto, PlayerDto } from 'src/types'
import { InfoResponse } from 'src/common/types/InfoResponse.dto'

@Controller('products')
export class ProductsController {
    constructor(private readonly summonersService: SummonersService) {}

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
    getSummoner(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('gamesLimit') gamesLimit = 10,
        @Query('queueType') queueType: 'ranked' | 'normal' | 'all' = 'all',
    ) {
        return this.summonersService.getSummoner(server, summonerName, gamesLimit, queueType)
    }

    @Get('/:server/:summonerName/level-image')
    @ApiOperation({
        summary: 'Get level and image only',
        description: 'Returns the name, level and image only',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: InfoResponse,
    })
    @ParamServer()
    @ParamSummonerName()
    getBasicSumoner(@Param('server') server: string, @Param('summonerName') summonerName: string){
        return this.summonersService.getBasicSummoner(server, summonerName)
    }
    
    @Get('/:server/:summonerName/masteries')
    @ApiOperation({
        summary: 'Get level and image only',
        description: 'Returns the name, level and image only',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: [MasteryDto],
    })
    @ParamServer()
    @ParamSummonerName()
    async getMasteries(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<MasteryDto[]> {
        return this.summonersService.getMasteries(summonerName, server)
    }
}
