import { Injectable, Logger } from '@nestjs/common'
import { Redis } from '@upstash/redis'
import { ConfigService } from '@nestjs/config'
import { RiotIdDto, StatsDto } from '../../common/types'
import { PrintKeysDto } from './types/responses.dto'

let is_redis_disabled = false

/**
 * This decorator wraps all the methods providing:
 * - A default response in case of redis being disabled in .env
 * - Error catching wrapping the method
 *
 * @param response_on_error If not provided, it will return null
 */
function Wrapper(response_on_error: any = null) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value
        const LOGGER = new Logger(target.constructor.name)

        descriptor.value = async function (...args: any[]) {
            // Before running any method, check if redis is disabled
            if (is_redis_disabled) {
                LOGGER.warn('REDIS: Redis is disabled')
                return response_on_error
            }

            // Wraps the method, catching any error
            try {
                return originalMethod.apply(this, args)
            } catch (err) {
                LOGGER.error('Error with Redis!', err)
                return response_on_error
            }
        }
    }
}

@Injectable()
export class DatabaseService {
    private readonly LOGGER: Logger = new Logger(this.constructor.name)
    private readonly REDIS: Redis = Redis.fromEnv()
    private readonly REDIS_DISABLED: boolean = false

    constructor(private readonly configService: ConfigService) {
        this.REDIS_DISABLED = configService.get<string>('UPSTASH_REDIS_REST_DISABLE') === 'true'
        is_redis_disabled = this.REDIS_DISABLED
    }

    /**
     * /database/print
     */
    @Wrapper({ total: 0, keys: [] })
    async keys(): Promise<PrintKeysDto> {
        try {
            const keys = await this.REDIS.keys('*')

            this.LOGGER.log(`REDIS: Found ${keys.length} keys!`)
            return { total: keys.length, keys }
        } catch (err) {
            // If keys() fails, probably is because the redis keys exceeded the limit
            // For now there is no intention to implement scan(), so just delete all keys
            this.LOGGER.error('REDIS: Error while getting keys', err)
            this.LOGGER.log('REDIS: Deleting all keys to avoid issues')
            await this.REDIS.flushdb()
            return { total: 0, keys: [] }
        }
    }

    /**
     * /database/print/:server/:riotId/stats
     */
    @Wrapper()
    async getStats(server: string, riotId: RiotIdDto): Promise<StatsDto | null> {
        const key = `${server}:${riotId.name}#${riotId.tag}:stats`
        const data: StatsDto | null = await this.REDIS.get(key)

        if (!data) {
            this.LOGGER.warn(`REDIS: Stats not found! Key: ${key}`)
            return null
        }

        this.LOGGER.log(`REDIS: Found data for ${server}:${riotId.name}#${riotId.tag} -> ${data.gamesUsed.length} games!`)
        return data
    }

    /**
     * /database/reset
     */
    @Wrapper(false)
    async deleteAll(): Promise<boolean> {
        const keys = await this.REDIS.keys('*')

        this.LOGGER.log(`REDIS: Deleting all ${keys.length} keys...`)
        await this.REDIS.flushdb()
        return true
    }

    /**
     * /database/delete/:key
     */
    @Wrapper(false)
    async deleteOne(key: string): Promise<boolean> {
        this.LOGGER.log(`REDIS: Deleting single key ${key}...`)
        await this.REDIS.del(key)
        return true
    }

    /**
     * ## POST data in a key
     *
     * @param key Key to be stored
     * @param summonerData Data to be stored in the key
     */
    @Wrapper()
    async set(key: string, stats: StatsDto): Promise<void> {
        this.LOGGER.log(`REDIS: saving ${key} data -> ${stats.gamesUsed.length} games`)

        // to avoid having too many games in cache (limit aprox 800)
        // TODO: the limit with the stats probably is incredible higher (2k? 3k?)
        // if (summonerData.length > 690) {
        //     this.LOGGER.log(`> 690 games in cache (${summonerData.length}), removing the oldest 10`)
        //     summonerData = summonerData.slice(0, 690)
        // }

        await this.REDIS.set(key, stats)
    }

    /**
     * ## TEST delete last game played
     */
    @Wrapper(false)
    async deleteLast(server: string, riotId: RiotIdDto): Promise<boolean> {
        const key = `${server}:${riotId.name}#${riotId.tag}:stats`
        const data: StatsDto | null = await this.REDIS.get(key)

        if (data && data.gamesUsed.length > 2) {
            data.gamesUsed.shift()
            this.LOGGER.log(`REDIS: Deleting last game played from ${key}...`)

            await this.REDIS.set(key, data)
            return true
        }

        this.LOGGER.warn(`REDIS: No games found for ${key}`)
        return false
    }
}
