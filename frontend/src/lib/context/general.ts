import { writable, type Writable } from 'svelte/store'
import type { PlayerDto } from '$lib/types'

export interface GeneralContextDto {
    darkMode: boolean
    cachedPlayers: Array<PlayerDto>
    loadingPlayer: boolean
}

export const generalContext: Writable<GeneralContextDto> = writable({
    darkMode: false,
    cachedPlayers: [],
    loadingPlayer: false,
})
