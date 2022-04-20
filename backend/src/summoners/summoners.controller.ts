import { Controller, Get } from '@nestjs/common'
import { SummonersService } from './summoners.service'

@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    @Get()
    async getUsers(): Promise<string> {
        return this.summonersService.getData()
    }
}
