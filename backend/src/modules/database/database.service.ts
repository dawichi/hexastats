import { Injectable, Logger } from '@nestjs/common'
import { Redis } from '@upstash/redis'
import { ConfigService } from '@nestjs/config'

import { StatsDto } from '../../common/types'
import { PrintKeysDto } from './types/responses.dto'

@Injectable()
export class DatabaseService {
    private readonly LOGGER: Logger = new Logger(this.constructor.name)
    private readonly REDIS: Redis = Redis.fromEnv()
    private readonly REDIS_DISABLED: boolean = false

    constructor(private readonly configService: ConfigService) {
        this.REDIS_DISABLED = configService.get<string>('UPSTASH_REDIS_REST_DISABLE') === 'true'
    }

    /**
     * /database/print
     */
    async keys(): Promise<PrintKeysDto> {
        if (this.REDIS_DISABLED) {
            this.LOGGER.warn('REDIS: Redis is disabled, no keys returned')
            return { total: 0, keys: [] }
        }

        const keys = await this.REDIS.keys('*')

        this.LOGGER.log(`REDIS: Found ${keys.length} keys!`)
        return { total: keys.length, keys }
    }

    /**
     * /database/print/:server/:summonerName/stats
     */
    async getStats(server: string, summonerName: string): Promise<StatsDto | null> {
        const key = `${server}:${summonerName}:stats`
        const data: StatsDto = await this.REDIS.get(key)

        if (!data) {
            this.LOGGER.warn(`Stats not found! Key: ${key}`)
            return null
        }

        this.LOGGER.log(`REDIS: Found data for ${server}:${summonerName} -> ${data.gamesUsed.length} games!`)
        return data
    }

    /**
     * /database/reset
     */
    async deleteAll(): Promise<boolean> {
        const keys = await this.REDIS.keys('*')

        this.LOGGER.log(`REDIS: Deleting all ${keys.length} keys...`)
        await this.REDIS.flushdb()
        return true
    }

    /**
     * /database/delete/:key
     */
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
    async set(key: string, stats: StatsDto) {
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
    // async deleteLast(key: string): Promise<boolean> {
    //     this.LOGGER.log(`REDIS: Deleting last game played from ${key}...`)

    //     const data: RedisRecordGamesDto | RedisRecordMasteriesDto = await this.REDIS.get(key)

    //     if (data) {
    //         data.data = data.data.slice(1)
    //         await this.REDIS.set(key, data)
    //     }
    //     return true
    // }
}
