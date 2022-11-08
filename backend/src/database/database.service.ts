import { Injectable, Logger } from '@nestjs/common'
import { Redis } from '@upstash/redis'
import { PlayerDto } from '../types'

type RecordDto = {
    ttl: number
    data: PlayerDto
}

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
    async list(): Promise<string[]> {
        this.logger.log('Checking all registered keys in redis...')
        const keys = await this.redis.keys('*')

        this.logger.log(`Found ${keys.length} keys!`)
        return keys
    }

    /**
     * ## DELETE ALL database registers
     *
     * @returns Confirmation that the database was deleted
     */
    async deleteAll(): Promise<boolean> {
        this.logger.log('Reseting the database...')
        await this.redis.flushdb()
        this.logger.log('Database reseted!')
        return true
    }

    /**
     * ## DELETE ONE key from the database
     *
     * @param key Key to be deleted
     * @returns Confirmation that the register was deleted
     */
    async deleteOne(key: string): Promise<boolean> {
        this.logger.log('Deleting data in redis...')
        await this.redis.del(key.toLowerCase())
        return true
    }

    /**
     * ## GET data from a key
     *
     * @param key Key to be searched
     * @returns Data stored in the key
     */
    async getOne(key: string): Promise<RecordDto> {
        const data: RecordDto = await this.redis.get(key.toLowerCase())

        this.logger.log(data ? 'Redis: Data found!' : 'Redis: Data not found!')
        return data
    }

    /**
     * ## POST data in a key
     *
     * @param key Key to be stored
     * @param summonerData Data to be stored in the key
     */
    async addOne(key: string, summonerData: PlayerDto) {
        key = key.toLowerCase()
        this.logger.log('Saving data in redis...')

        const newRecord: RecordDto = {
            ttl: Date.now(),
            data: summonerData,
        }

        await this.redis.set(key, newRecord)
        this.logger.log(`${key} - Data saved!`)
    }
}
