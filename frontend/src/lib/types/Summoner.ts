import type { Game } from './imported/Game.dto'
import type { Mastery } from './imported/Mastery.dto'
import type { RankData } from './imported/Player.dto'

/**
 * ## Interface for a summoner data
 * Complete information about a summoner
 */
export interface Summoner extends RankData {
    games: Game[]
    masteries: Mastery[]
}
