import { Module } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { DatabaseController } from './database.controller'
import { ConfigService } from '@nestjs/config'

@Module({
    providers: [DatabaseService, ConfigService],
    exports: [DatabaseService],
    controllers: [DatabaseController],
})
export class DatabaseModule {}
