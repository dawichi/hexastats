export interface PlayerStatsResult {
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

export interface DataForChart {
    label: string
    value: number
}

export interface link {
    name: string
    url: string
}
