export interface Rank {
    rank: string
    image: string
    lp: number
    win: number
    lose: number
    winrate: number
    promos: string
}

export interface RankStructure {
    solo: Rank
    flex: Rank
}

