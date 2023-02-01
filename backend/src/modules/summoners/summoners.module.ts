import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '../database/database.module'
import { SummonersService } from './summoners.service'
import { SummonersController } from './summoners.controller'
import { RiotModule } from '../../modules/riot/riot.module'

@Module({
    imports: [ConfigModule, DatabaseModule, RiotModule],
    providers: [SummonersService],
    controllers: [SummonersController],
})
export class SummonersModule {}
