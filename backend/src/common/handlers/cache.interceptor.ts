import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable, of, tap } from 'rxjs'
import { DatabaseService } from 'src/modules/database/database.service'
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

    constructor(private readonly databaseService: DatabaseService) {}

    /**
     * ## Get cached data from redis
     * @param key redis key
     * @returns data from redis or null
     */
    private async getCachedData(key: string): Promise<any | null> {
        this.logger.log(`Checking data for: ${key}`)
        const redisData = await this.databaseService.getOne(key)

        if (!redisData) return null
        const stillValid = validateTTL(redisData.ttl)

        if (/undefined/.test(key) || !stillValid || !redisData) return null
        return redisData.data
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const { path } = context.switchToHttp().getRequest()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [a, b, server, name, endpoint] = path.split('/')
        const key = `${server}:${name}:${endpoint}`

        if (/masteries/.test(path)) {
            const result = await this.getCachedData(key)

            if (result) return of(result)
        }

        if (/games/.test(path)) {
            const result = await this.getCachedData(key)

            if (result) return of(result)
        }

        return next.handle().pipe(
            tap(data => {
                this.logger.log(`After Interceptor`)
                this.databaseService.addOne(key, data)
                this.logger.log(`Saved to redis: ${key}`)
            }),
        )
    }
}
