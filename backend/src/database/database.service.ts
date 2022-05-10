import { Injectable, Logger } from '@nestjs/common'
import { Redis } from '@upstash/redis'

interface SummonerDataForRedis {
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

    async checkAll(): Promise<string[]> {
        this.logger.log('Checking all registered keys in redis...')
        const keys = await this.redis.keys('*')

        this.logger.log(`Found ${keys.length} keys!`)
        return keys
    }

    async reset(): Promise<boolean> {
        this.logger.log('Reseting the database...')
        await this.redis.flushdb()
        this.logger.log('Database reseted!')
        return true
    }

    async deleteSummonerData(server: string, summonerName: string) {
        this.logger.log('Deleting data in redis...')
        await this.redis.del(`${server}:${summonerName}`)
        return true
    }

    async recoverSummonerData(server: string, summonerName: string): Promise<SummonerDataForRedis> {
        this.logger.log('Checking if data exists in redis...')
        const data: SummonerDataForRedis = await this.redis.get(`${server}:${summonerName}`)

        this.logger.log(data ? 'Data found!' : 'Data not found!')
        return data
    }

    async saveSummonerData(server: string, summonerName: string, summonerData: any) {
        this.logger.log('Saving data in redis...')

        const stored = {
            ttl: Date.now(),
            data: summonerData,
        }

        await this.redis.set(`${server}:${summonerName}`, stored)
        this.logger.log(`${server} : ${summonerName} - Data saved!`)
    }
}
