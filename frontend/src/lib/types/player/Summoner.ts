import type { GameDto } from './Game.dto'
import type { MasteryDto } from './Mastery.dto'
import type { PlayerDto } from './Player.dto'

/**
 * ## Interface for a summoner data
 * Complete information about a summoner
 */
export interface SummonerDto extends PlayerDto {
    games: GameDto[]
    masteries: MasteryDto[]
}
