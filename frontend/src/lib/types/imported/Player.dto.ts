import type { RankStructure } from './Rank.dto'

export interface Player {
    alias: string
    server: string
    image: string
    level: number
    riotIdName: string
    riotIdTag: string
}

export interface RankData extends Player {
    rank: RankStructure
}

