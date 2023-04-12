import { writable, type Writable } from 'svelte/store'
import type { PlayerDto } from '$lib/types'

export interface GeneralContextDto {
    darkMode: boolean
    version: string
    cachedPlayers: Array<PlayerDto>
    loadingPlayer: boolean
}

export const generalContext: Writable<GeneralContextDto> = writable({
    darkMode: false,
    version: '13.7.1', // will be overwritten by load()
    cachedPlayers: [],
    loadingPlayer: false,
})
