import { Injectable, Logger } from '@nestjs/common'
import { Redis } from '@upstash/redis'

/**
 * ## Schema for the database
 */
interface SummonerDataDTO {
    ttl: number
    data: any
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
     * ## Print all the database keys registered
     *
     * @returns Array of all keys in the database
     */
    async printKeys(): Promise<string[]> {
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
    async flushDb(): Promise<boolean> {
        this.logger.log('Reseting the database...')
        await this.redis.flushdb()
        this.logger.log('Database reseted!')
        return true
    }

    /**
     * ## DELETE ONE key from the database
     *
     * @param server Server name
     * @param summonerName Summoner name
     * @returns Confirmation that the register was deleted
     */
    async deleteOne(server: string, summonerName: string) {
        this.logger.log('Deleting data in redis...')
        await this.redis.del(`${server}:${summonerName}`)
        return true
    }

    /**
     * ## GET data from a key
     *
     * @param server Server name
     * @param summonerName Summoner name
     * @returns Data stored in the key
     */
    async getData(server: string, summonerName: string): Promise<SummonerDataDTO> {
        this.logger.log('Checking if data exists in redis...')
        const data: SummonerDataDTO = await this.redis.get(`${server}:${summonerName}`)

        this.logger.log(data ? 'Data found!' : 'Data not found!')
        return data
    }

    /**
     * ## POST data in a key
     *
     * @param server Server name
     * @param summonerName Summoner name
     * @param summonerData Data to be stored in the key
     */
    async postData(server: string, summonerName: string, summonerData: any) {
        this.logger.log('Saving data in redis...')

        const stored = {
            ttl: Date.now(),
            data: summonerData,
        }

        await this.redis.set(`${server}:${summonerName}`, stored)
        this.logger.log(`${server} : ${summonerName} - Data saved!`)
    }
}
