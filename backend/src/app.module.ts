import { Module } from '@nestjs/common'
import { SummonersModule } from './summoners/summoners.module'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [ConfigModule.forRoot(), SummonersModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
