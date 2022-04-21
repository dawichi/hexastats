export interface RankInterface {
    rank: string
    image: string
    lp: number
    win: number
    lose: number
    winrate: number
}

export interface ChampInterface {
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
    max_kills: number
    max_deaths: number
    avg_damage_dealt: number
    avg_damage_taken: number
    double_kills: number
    triple_kills: number
    quadra_kills: number
    penta_kills: number
}

export interface MasteryInterface {
    name: string
    image: string
    level: number
    points: number
}

export interface PlayerInterface {
    alias: string
    image: string
    level: number
    rank: {
        solo: RankInterface
        flex: RankInterface
    }
    champs: ChampInterface[]
    masteries: MasteryInterface[]
}
