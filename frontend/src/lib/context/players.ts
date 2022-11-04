import { writable, type Writable } from 'svelte/store'

export const players: Writable<GameDTO> = writable({
    view: 'welcome',
})
