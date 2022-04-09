/* eslint-disable no-unused-vars */
const endpoints = {
    summoner: 'summoner/v4/summoners/by-name/',
    championRotations: 'platform/v3/champion-rotations',
    championMastery: 'champion-mastery/v4/champion-masteries/by-summoner/',
    summonerLeague: 'league/v4/entries/by-summoner/'
    // TODO: endpoints generados por la IA, no se si funcinoan xD
    // match: 'match/',
    // matchlist: 'match/by-puuid/',
    // league: 'league/',
    // leaguePositions: 'league/positions/by-summoner/',
    // leagueEntriesByQueue: 'league/entries/by-queue/',
}

export const riot: {
    apiKey: string
    baseUrl: string
    endpoints: {
        summoner: string
        championRotations: string
		championMastery: string
        summonerLeague: string
    }
    utils: {
        cdn: string,
        profileIconUrl: (id: number) => string,
        championImageUrl: (id: number) => string,
        leagueIconUrl: (league: string) =>string,
    }
} = {
    apiKey: 'process.env.RIOT_API_KEY',
    baseUrl: 'https://euw1.api.riotgames.com/lol/',
    endpoints: new Proxy(endpoints, {
        get: (target, prop) => riot.baseUrl + target[prop],
        set: () => {
            throw new Error("You can't modify the riot config")
        },
    }),
    utils: {
        cdn: 'https://ddragon.leagueoflegends.com/cdn/12.6.1/',
        profileIconUrl: (id: number) => riot.utils.cdn + `img/profileicon/${id}.png`,
        championImageUrl: (id: number) => riot.utils.cdn + `img/champion/${id}.png`,
        leagueIconUrl: (league: string) => riot.utils.cdn
    },
}
