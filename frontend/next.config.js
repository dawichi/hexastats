module.exports = {
    reactStrictMode: true,
    images: {
        domains: ['opgg-static.akamaized.net', 'ddragon.leagueoflegends.com', 'img.buymeacoffee.com', 'avatars.githubusercontent.com', 'raw.communitydragon.org'],
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    env: {
        LOCAL_API: process.env.LOCAL_API,
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    }
}
