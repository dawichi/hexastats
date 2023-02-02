import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable, of, tap } from 'rxjs'
import { DatabaseService } from '../../modules/database/database.service'
import { RiotService } from '../../modules/riot/riot.service'
import { GameDto, MasteryDto } from '../../types'
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
    private readonly logger = new Logger(this.constructor.name)
    private readonly disabled: boolean = false

    constructor(
        private readonly riotService: RiotService,
        private readonly configService: ConfigService,
        private readonly databaseService: DatabaseService,
    ) {
        this.disabled = configService.get<string>('UPSTASH_REDIS_REST_DISABLE') === 'true'
    }

    /**
     * ## Get cached data from redis
     * @param key redis key
     * @returns data from redis or null
     */
    private async getCachedData(key: string): Promise<GameDto[] | MasteryDto[] | null> {
        this.logger.log(`Checking data for: ${key}`)
        const redisData = await this.databaseService.getOne(key)

        if (!redisData) return null
        const stillValid = validateTTL(redisData.ttl)

        if (!stillValid) return null
        return redisData.data
    }

    /**
     * ## Games flow
     * @returns
     */
    private async gamesFlow(server: string, name: string, cachedData: GameDto[]): Promise<GameDto[] | null> {
        const { puuid } = await this.riotService.getBasicInfo(server, name)
        const { is_last, last_game_id } = await this.riotService.isLastGame(server, puuid, cachedData[0].matchId)

        // Last game is already cached, so just return them
        if (is_last) return cachedData
        const lastGamesPlayed = await this.riotService.getGameIds(puuid, server, 10, 0)
        const lastGameIndex = lastGamesPlayed.indexOf(last_game_id)

        // Last game is not in cache -> +10 games were played since last time -> load new ones
        if (lastGameIndex === -1) return null

        // Last game is in cache -> load the games (1-9) that were played since last time
        const gameIdsPending = lastGamesPlayed.slice(0, lastGameIndex + 1)
        const newGames = await this.riotService.getGamesDetail(puuid, server, gameIdsPending)

        // HACK: to avoid having too many games in cache
        if (cachedData.length > 50) {
            // remove the oldest 10 games
            cachedData = cachedData.slice(0, 40)
        }
        return [...newGames, ...cachedData]
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const { path } = context.switchToHttp().getRequest()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [a, b, server, name, endpoint] = path.split('/')
        const key = `${server}:${name}:${endpoint}`
        let saveAfter = false

        if (!this.disabled) {
            // Cache only masteries and games
            if (/masteries|games/.test(path)) {
                let result = await this.getCachedData(key)

                if (/games/.test(path) && result?.length && 'matchId' in (result[0] as GameDto)) {
                    const games: GameDto[] = result as GameDto[]

                    result = await this.gamesFlow(server, name, games)
                }

                if (result) return of(result)
                saveAfter = true
            }
        }

        return next.handle().pipe(
            tap(data => {
                if (saveAfter) {
                    this.databaseService.addOne(key, data)
                    this.logger.log(`Saved to redis: ${key}`)
                }
                this.logger.log('Done')
            }),
        )
    }
}
