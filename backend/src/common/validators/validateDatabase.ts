import { Logger } from '@nestjs/common'
import { Redis } from '@upstash/redis'

/**
 * ## Validates if redis is working
 * @returns Promise<boolean>
 */
export const validateDatabase = async (): Promise<void> => {
    const logger = new Logger(validateDatabase.name)
    const redis = Redis.fromEnv()

    try {
        await redis.set('test', 'test')
        await redis.get('test')
        await redis.del('test')
    } catch {
        logger.error('Database is not working!')
        process.exit(1)
    }
}
