import type { GameDto, SummonerDto } from '$lib/types'
import { writable, type Writable } from 'svelte/store'

export const playersContext: Writable<SummonerDto[]> = writable([])

export const playerContext: Writable<SummonerDto> = writable({} as SummonerDto)

export const filteredGamesContext: Writable<{
    activeFilter: string,
    games: GameDto[],
}> = writable({
    activeFilter: '',
    games: [],
})
