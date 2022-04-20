import { Controller, Get, Param } from '@nestjs/common'
import { Summoner } from 'src/interfaces'
import { SummonersService } from './summoners.service'

@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    @Get()
    async test(): Promise<string> {
        return await this.summonersService.getChampionName(420)
    }

    @Get('/mastery/:id')
    async getMasteries(@Param('id') id: string): Promise<any> {
        return await this.summonersService.getMasteries(id)
    }

    @Get('/:name')
    async getSummonerByName(@Param('name') name: string): Promise<Summoner> {
        console.log('ci')
        return await this.summonersService.getSummonerDataByName(name)
    }
}
