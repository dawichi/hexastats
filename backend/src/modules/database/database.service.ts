import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Redis } from '@upstash/redis'
import { GameDto, MasteryDto, PrintDatabaseDto, RedisRecordGamesDto, RedisRecordMasteriesDto } from '../../common/types'

@Injectable()
export class DatabaseService {
    private readonly logger: Logger
    private readonly redis: Redis

    constructor() {
        this.redis = Redis.fromEnv()
        this.logger = new Logger(this.constructor.name)
    }

    /**
     * ## LIST all the database keys registered
     *
     * @returns Array of all keys in the database
     */
    async printAll(): Promise<PrintDatabaseDto> {
        const keys = await this.redis.keys('*')

        this.logger.log(`REDIS: Found ${keys.length} keys!`)
        return { total: keys.length, keys }
    }

    /**
     * ## DELETE ALL database registers
     *
     * @returns Confirmation that the database was deleted
     */
    async deleteAll(): Promise<boolean> {
        const keys = await this.redis.keys('*')

        this.logger.log(`REDIS: Deleting ${keys.length} keys...`)
        await this.redis.flushdb()
        return true
    }

    /**
     * ## DELETE ONE key from the database
     *
     * @param key Key to be deleted
     * @returns Confirmation that the register was deleted
     */
    async deleteOne(key: string): Promise<boolean> {
        this.logger.log(`REDIS: Deleting ${key}...`)
        await this.redis.del(key)
        return true
    }

    /**
     * ## GET data from a key
     *
     * @param key Key to be searched
     * @returns Data stored in the key
     */
    async getGames(server: string, summonerName: string): Promise<RedisRecordGamesDto> {
        const key = `${server}:${summonerName}:games`
        const data: RedisRecordGamesDto = await this.redis.get(key)

        if (!data) {
            this.logger.warn(`Data not found! Key: ${key}`)
        }

        return data
    }

    /**
     * ## GET data from a key
     *
     * @param key Key to be searched
     * @returns Data stored in the key
     */
    async getMasteries(server: string, summonerName: string): Promise<RedisRecordMasteriesDto> {
        const key = `${server}:${summonerName}:masteries`
        const data: RedisRecordMasteriesDto = await this.redis.get(key)

        if (!data) {
            this.logger.warn(`Data not found! Key: ${key}`)
        }
        return data
    }

    /**
     * ## POST data in a key
     *
     * @param key Key to be stored
     * @param summonerData Data to be stored in the key
     */
    async addOne(key: string, summonerData: GameDto[] | MasteryDto[]) {
        this.logger.log(`REDIS: saving ${key} data...`)

        // to avoid having too many games in cache
        if (summonerData.length > 50) {
            this.logger.log(`> 50 games in cache (${summonerData.length}), removing the oldest 10`)
            summonerData = summonerData.slice(0, 50)
        }

        const newRecord = {
            ttl: Date.now(),
            data: summonerData,
        }

        await this.redis.set(key, newRecord)
    }

    /**
     * ## TEST delete last game played
     */
    async deleteLast(key: string): Promise<boolean> {
        this.logger.log(`REDIS: Deleting last game played from ${key}...`)

        const data: RedisRecordGamesDto | RedisRecordMasteriesDto = await this.redis.get(key)

        if (data) {
            data.data = data.data.slice(1)
            await this.redis.set(key, data)
        }
        return true
    }
}
