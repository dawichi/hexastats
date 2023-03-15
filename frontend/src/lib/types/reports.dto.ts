import type { PlayerDto } from './player/Player.dto'

export type StatRow = {
    games: number
    wins: number
    kda: {
        kills: number
        deaths: number
        assists: number
    }
    farm: {
        cs: number
        csmin: number
        gold: number
    }
    multiKill: {
        doubles: number
        triples: number
        quadras: number
        pentas: number
    }
    stats: {
        maxKills: number
        maxDeaths: number
        avgDamageDealt: number
        avgDamageTaken: number
        visionScore: number
    }
}

export interface Report extends PlayerDto {
    stats_by_champ: Record<string, StatRow>
    stats_by_position: Record<string, StatRow>
}
