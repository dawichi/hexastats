import type { PlayerDto } from '$lib/types/player/Player.dto'
import { writable, type Writable } from 'svelte/store'

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

export interface ReportDto extends PlayerDto {
    stats_by_champ: Record<string, StatRow>
    stats_by_position: Record<string, StatRow>
}

export const reportsContext: Writable<ReportDto[]> = writable([])
