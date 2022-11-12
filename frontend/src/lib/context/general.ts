import { writable, type Writable } from 'svelte/store'

export interface GeneralContextDto {
    darkMode: boolean
    loadingPlayer: boolean
}

export const generalContext: Writable<GeneralContextDto> = writable({
    darkMode: false,
    loadingPlayer: false,
})
