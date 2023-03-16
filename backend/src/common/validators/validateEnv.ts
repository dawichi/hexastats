import { Logger } from '@nestjs/common'

/**
 * ## Validate if environment variables are set
 *
 * @returns Array with erros if any
 */
export function validateEnv(): void {
    const logger = new Logger(validateEnv.name)
    const err = []

    // Validate if RIOT API KEY is set
    if (!process.env.RIOT_API_KEY) {
        err.push('Missing in .env file: RIOT_API_KEY')
        err.push('Example value: RGAPI-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX')
    }

    // Validate if the Redis URL is set
    if (!process.env.UPSTASH_REDIS_REST_URL) {
        err.push('Missing in .env file: UPSTASH_REDIS_REST_URL')
        err.push('Example value: http://localhost:6379')
    }

    // Validate if the redis TOKEN URL is set
    if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
        err.push('Missing in .env file: UPSTASH_REDIS_REST_TOKEN')
        err.push('Example value: 1234567890')
    }

    // Validate if the redis is disabled
    if (!process.env.UPSTASH_REDIS_REST_DISABLE) {
        err.push('Missing in .env file: UPSTASH_REDIS_REST_DISABLE')
        err.push('Example value: true')
    }

    // Validate boolean format
    if (process.env.UPSTASH_REDIS_REST_DISABLE !== 'true' && process.env.UPSTASH_REDIS_REST_DISABLE !== 'false') {
        err.push('Invalid format in .env file: UPSTASH_REDIS_REST_DISABLE')
        err.push('Example value: true')
    }

    if (err.length > 0) {
        err.forEach(error => logger.error(error))
        process.exit(1)
    }
}
