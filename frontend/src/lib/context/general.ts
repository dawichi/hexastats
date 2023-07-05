import { writable, type Writable } from 'svelte/store'
import type { GameDetailDto, PlayerDto } from '$lib/types'

// Handle if the dark mode is enabled or not
export const darkModeContext: Writable<boolean> = writable(false)

// Caches the players for the search in SearchPlayer.svelte
export const cachedPlayersContext = writable<Array<PlayerDto>>([])

// Caches the modal used to display the game details 
export const modalGameContext = writable({
    isModalOpen: false,
    game: {} as GameDetailDto,
})
