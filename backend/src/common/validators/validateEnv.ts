/**
 * ## Validate if environment variables are set
 *
 * @returns Array with erros if any
 */
export const validateEnv = (): string[] => {
    const err = []

    // Validate if RIOT API KEY is set
    if (!process.env.RIOT_API_KEY) {
        err.push('RIOT_API_KEY is not set in the .env file')
        err.push('Example value: RGAPI-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX')
    }

    // Validate if the redis is disabled
    if (!process.env.UPSTASH_REDIS_REST_DISABLE) {
        err.push('UPSTASH_REDIS_REST_DISABLE is not set in the .env file')
        err.push('Example value: false')
    }

    // Validate if the redis URL is set
    if (!process.env.UPSTASH_REDIS_REST_URL) {
        err.push('UPSTASH_REDIS_REST_URL is not set in the .env file')
        err.push('Example value: http://localhost:3000')
    }

    // Validate if the redis TOKEN URL is set
    if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
        err.push('UPSTASH_REDIS_REST_TOKEN is not set in the .env file')
        err.push('Example value: 1234567890')
    }

    return err
}
