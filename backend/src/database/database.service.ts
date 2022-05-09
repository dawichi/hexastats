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
