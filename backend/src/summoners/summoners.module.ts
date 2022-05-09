import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '../database/database.module'
import { SummonersService } from './summoners.service'
import { SummonersController } from './summoners.controller'

@Module({
    imports: [HttpModule, ConfigModule, DatabaseModule],
    providers: [SummonersService],
    controllers: [SummonersController],
})
export class SummonersModule {}
