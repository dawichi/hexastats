import { Injectable, Logger } from '@nestjs/common'
import { Redis } from '@upstash/redis'

@Injectable()
export class DatabaseService {
    private readonly logger: Logger
    private readonly redis: Redis

    constructor() {
        this.redis = Redis.fromEnv()
        this.logger = new Logger(this.constructor.name)
    }

    set(key: string, value: any) {
        this.logger.log('has hecho un SET')
        this.redis.set(key, value)
    }

    get(key: string) {
        this.logger.log('has hecho un GET')
        return this.redis.get(key)
    }

    getAll() {
        return this.redis.append('test', 'test')
    }
}
