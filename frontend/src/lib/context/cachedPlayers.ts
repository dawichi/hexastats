import type { CachedNameDto } from '$lib/types'
import { writable, type Writable } from 'svelte/store'

export const filteredCachedPlayersContext: Writable<CachedNameDto[]> = writable([])
