import { backendUrl } from '$lib/services/Summoner.service'
import { error } from '@sveltejs/kit'

type CachedPlayer = {
    server: string
    name: string
}

/** @type {import('./$types').PageLoad} */
export async function load(): Promise<{ cachedPlayers: CachedPlayer[] }> {
    try {
        const response = await fetch(`${backendUrl}database/print`)
        const data = await response.json()

        // keys = ['server:name', 'server:name', ...]
        const keys: string[] = data.keys.map((key: string) => {
            const [server, name] = key.split(':')
            return `${server}:${decodeURI(name)}`
        })
        return {
            cachedPlayers: [...new Set(keys)].map((key: string) => ({
                server: key.split(':')[0],
                name: key.split(':')[1],
            })),
        }
    } catch (e: unknown) {
        throw error(500, 'Server is not up, try in a few minutes.')
    }
}
