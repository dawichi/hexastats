import { Controller, Get, Param } from '@nestjs/common'
import { Summoner } from 'src/interfaces'
import { SummonersService } from './summoners.service'

@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}
    @Get('/mastery/:id')
    async getMasteries(@Param('id') id: string): Promise<any> {
        return await this.summonersService.getMastery(id)
    }
    @Get('/:name')
    async getSummonerByName(@Param('name') name: string): Promise<Summoner> {
        return await this.summonersService.getSummonerByName(name)
    }
}
