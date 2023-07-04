import type { GameDetailDto } from '$lib/types'
import { writable, type Writable } from 'svelte/store'

export const modalGameContext: Writable<{
    isModalOpen: boolean
    game: GameDetailDto
}> = writable({
    isModalOpen: false,
    game: {} as GameDetailDto,
})
