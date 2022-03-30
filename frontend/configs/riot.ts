/* eslint-disable no-unused-vars */
const endpoints = {
    summoner: 'summoner/v4/summoners/by-name/',
    championRotations: 'platform/v3/champion-rotations',
    championMastery: 'champion-mastery/v4/champion-masteries/by-summoner/'
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
		championMastery: string
    }
    utils: {
        baseImgUrl: string,
        profileIconUrl: (id: number) => string,
        championImageUrl: (id: number) => string,
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
        baseImgUrl: 'https://ddragon.leagueoflegends.com/cdn/12.6.1/img/',
        profileIconUrl: (id: number) => riot.utils.baseImgUrl + `profileicon/${id}.png`,
        championImageUrl: (id: number) => riot.utils.baseImgUrl + `champion/${id}.png`,
    },
}
