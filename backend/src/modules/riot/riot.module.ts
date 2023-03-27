import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RiotController } from './riot.controller'
import { RiotService } from './riot.service'

@Module({
    imports: [HttpModule, ConfigModule],
    providers: [RiotService],
    exports: [RiotService],
    controllers: [RiotController],
})
export class RiotModule {}
