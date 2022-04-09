module.exports = {
    reactStrictMode: true,
    images: {
        domains: ['opgg-static.akamaized.net', 'ddragon.leagueoflegends.com', 'img.buymeacoffee.com', 'avatars.githubusercontent.com'],
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
}
