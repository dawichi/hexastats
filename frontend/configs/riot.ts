const endpoints = {
    summoner: 'summoner/v4/summoners/by-name/',
    championRotations: 'platform/v3/champion-rotations',
    // TODO: endpoints generados por la IA, no se si funcinoan xD
    // match: 'match/',
    // matchlist: 'match/by-puuid/',
    // league: 'league/',
    // leaguePositions: 'league/positions/by-summoner/',
    // leagueEntries: 'league/entries/by-summoner/',
    // leagueEntriesByQueue: 'league/entries/by-queue/',
}

export const riot: {
    apiKey: string
    baseUrl: string
    endpoints: {
        summoner: string
        championRotations: string
    }
    utils: {
        // eslint-disable-next-line no-unused-vars
        profileIconUrl: (id: number) => string
    }
} = {
    apiKey: process.env.API_KEY,
    baseUrl: 'https://euw1.api.riotgames.com/lol/',
    endpoints: new Proxy(endpoints, {
        get: (target, prop) => riot.baseUrl + target[prop],
        set: () => {
            throw new Error("You can't modify the riot config")
        },
    }),
    utils: {
        profileIconUrl: (id: number) => `http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/${id}.png`,
    },
}
