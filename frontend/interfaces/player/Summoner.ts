import { Game } from './Game'
import { Mastery } from './Mastery'
import { Rank } from './Rank'

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
