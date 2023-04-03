import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { LoggerMiddleware } from './common/middlewares/logger.middleware'
import { SummonersModule } from './modules/summoners/summoners.module'
import { ConfigModule } from '@nestjs/config'
import { RiotModule } from './modules/riot/riot.module'

@Module({
    imports: [ConfigModule.forRoot(), RiotModule, SummonersModule],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('summoners', 'database')
    }
}
