import type { SummonerDto } from '$lib/types'
import { writable, type Writable } from 'svelte/store'

export const playersContext: Writable<SummonerDto[]> = writable([])

export const playerContext: Writable<SummonerDto> = writable({} as SummonerDto)
