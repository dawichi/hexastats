import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { SummonersModule } from './summoners/summoners.module'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [ConfigModule.forRoot(), UsersModule, SummonersModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
