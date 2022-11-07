import type { Game } from './Game'
import type { Mastery } from './Mastery'
import type { Rank } from './Rank'

/**
 * ## Interface for a summoner data
 * Complete information about a summoner
 */
export interface Summoner {
    alias: string
    server: string
    image: string
    level: number
    rank: {
        solo: Rank
        flex: Rank
    }
    games: Game[]
    masteries: Mastery[]
}
