import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable, of, tap } from 'rxjs'
import { DatabaseService } from '../../modules/database/database.service'
import { RiotService } from '../../modules/riot/riot.service'
import { GameDto } from '../../common/types'
import { validateTTL } from '../validators'

/**
 * ## Cache interceptor
 * Example: /euw/brr1/masteries
 *
 * We don't want to reload the masteries EACH time the user asks for them.
 * This cache intercepts the request, and in case the data is already in redis,
 * and the TTL is still valid, it returns the data from redis directly.
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
    private readonly LOGGER = new Logger(this.constructor.name)
    private readonly REDIS_DISABLED: boolean = false

    constructor(
        private readonly riotService: RiotService,
        private readonly configService: ConfigService,
        private readonly databaseService: DatabaseService,
    ) {
        this.REDIS_DISABLED = configService.get<string>('UPSTASH_REDIS_REST_DISABLE') === 'true'
    }

    /**
     * -------------------------------
     * ## Games flow
     * -------------------------------
     */
    private async gamesFlow(server: string, name: string, cachedData: GameDto[]): Promise<GameDto[] | null> {
        this.LOGGER.log(`Games flow for ${server}:${name}, ${cachedData.length} games in cache`)
        const { puuid } = await this.riotService.getBasicInfo(server, name)
        const { is_last, last_game_id } = await this.riotService.isLastGame(server, puuid, cachedData[0].matchId)

        // Last game is already cached, so just return them
        if (is_last) return cachedData
        const lastGamesPlayed = await this.riotService.getGameIds(puuid, server, 10, 0, 'all')
        const lastGameIndex = lastGamesPlayed.indexOf(last_game_id)

        // Last game is not in cache OR +10 games were played since last time -> load new ones
        if (lastGameIndex === -1 || lastGameIndex > 9) return null

        // Load the games (1-9) that were played since last time
        const lastTenGameIDs = await this.riotService.getGameIds(puuid, server, 10, 0, 'all')
        const lastGameIDsStored = cachedData.map(game => game.matchId)
        const gameIdsPending = lastTenGameIDs.filter(id => !lastGameIDsStored.includes(id))
        const newGames = await this.riotService.getGamesDetail(puuid, server, gameIdsPending)

        this.LOGGER.log(`${gameIdsPending.length} new games added to existing ${cachedData.length}`)
        // this.databaseService.set(`${server}:${name}:games`, [...newGames, ...cachedData])
        return [...newGames, ...cachedData]
    }

    /**
     * -------------------------------
     * ## Actual Interceptor
     * -------------------------------
     */
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const { path } = context.switchToHttp().getRequest()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [a, b, server, name, endpoint] = path.split('/')
        const key = `${server}:${name}:${endpoint}`

        if (this.REDIS_DISABLED || !/stats/.test(path)) {
            // Skip the interceptor
            return next.handle().pipe()
        }

        this.LOGGER.log(`Intercepted! Checking data for: ${key}`)
        const redisData = await this.databaseService.getStats(server, name)

        if (redisData && redisData) {
            if (/masteries/.test(path)) {
                this.LOGGER.log('Returning masteries directly from redis')
                return of(redisData)
            }

            // The request is about games, which implies a more complex logic flow than masteries
            // const result = await this.gamesFlow(server, name, redisData as GameDto[])

            // if (result) {
            //     return of(result)
            // }
        }

        // If we reach this point, it means that the data is not in redis, or the TTL is expired
        // So we continue with the process and using the tap operator, we save the data to redis AFTER the request is done
        return next.handle().pipe(
            tap(data => {
                this.databaseService.set(key, data)
                this.LOGGER.log(`Saved to redis: ${key}`)
                this.LOGGER.log('Done')
            }),
        )
    }
}
