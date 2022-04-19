import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { SummonersService } from './summoners.service'
import { SummonersController } from './summoners.controller'

@Module({
    imports: [HttpModule],
    providers: [SummonersService],
    controllers: [SummonersController],
})
export class SummonersModule {}
