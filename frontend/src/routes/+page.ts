import { backendUrl } from '$lib/services/Summoner.service'
import type { CachedNameDto } from '$lib/types'

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }: { fetch: typeof window.fetch }): Promise<{ cachedPlayers: CachedNameDto[] }> {
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
                image: '',
                level: 0,
            })),
        }
    } catch (e: unknown) {
        console.error("Cached Players not working")
        return {
            cachedPlayers: [],
        }
    }
}
