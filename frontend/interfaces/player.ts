import { GameDto } from 'interfaces'

export interface Rank {
    rank: string
    image: string
    lp: number
    win: number
    lose: number
    winrate: number
}

export interface Champ {
    name: string
    image: string
    games: number
    winrate: number
    kda: number
    kills: number
    deaths: number
    assists: number
    cs: number
    csmin: number
    gold: number
    maxKills: number
    maxDeaths: number
    avgDamageDealt: number
    avgDamageTaken: number
    visionScore: number
    doubleKills: number
    tripleKills: number
    quadraKills: number
    pentaKills: number
}

export interface Mastery {
    name: string
    image: string
    level: number
    points: number
}

export interface Player {
    // name: string
    alias: string
    image: string
    level: number
    rank: {
        solo: Rank
        flex: Rank
    }
    games: GameDto[]
    masteries: Mastery[]
}
