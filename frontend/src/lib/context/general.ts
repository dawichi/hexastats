import { writable, type Writable } from 'svelte/store'

export interface GeneralContextDto {
    darkMode: boolean
}

export const generalContext: Writable<GeneralContextDto> = writable({
    darkMode: false,
})
