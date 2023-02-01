import type { RankDto } from './Rank.dto'

/**
 * Basic interface for a player
 * without games and masteries
 */
export interface PlayerDto {
    alias: string
    server: string
    image: string
    level: number
    rank: {
        solo: RankDto
        flex: RankDto
    }
}
