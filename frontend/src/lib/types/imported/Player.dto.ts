import type { RankStructure } from './Rank.dto'

export interface Player {
    alias: string
    server: string
    image: string
    level: number
}

export interface RankData extends Player {
    rank: RankStructure
}

