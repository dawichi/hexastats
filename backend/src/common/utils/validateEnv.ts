export const validateEnv = () => {
    const err = []

    // Validate if RIOT API KEY is set
    if (!process.env.RIOT_API_KEY) {
        err.push('RIOT_API_KEY is not set in the .env file')
    }

    // Validate if the redis URL is set
    if (!process.env.UPSTASH_REDIS_REST_URL) {
        err.push('UPSTASH_REDIS_REST_URL is not set in the .env file')
    }

    // Validate if the redis TOKEN URL is set
    if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
        err.push('UPSTASH_REDIS_REST_TOKEN is not set in the .env file')
    }

    return err
}
