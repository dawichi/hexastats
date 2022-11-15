export type PlayerStoredDto = {
    serverIdx: number
    name: string
    level: number
    image: string
}

const key = 'players'

/**
 * ## Service to manage the localStorage data
 */
export class LocalStorageService {
    static list(): PlayerStoredDto[] {
        return JSON.parse(localStorage.getItem(key) ?? '[]')
    }

    static add(player: PlayerStoredDto): void {
        const list = LocalStorageService.list()

        // If the new player was present, remove it
        const idx = list.findIndex((p) => p.name === player.name)
        if (idx !== -1) list.splice(idx, 1)

        // Max store 4 names
        if (list.length > 3) list.pop()
        
        localStorage.setItem(key, JSON.stringify([player, ...list]))
    }
}
