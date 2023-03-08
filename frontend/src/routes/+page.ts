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
        const promises = data.keys.map((key: string) => {
            const [server, name] = key.split(':')
            return fetch(`${backendUrl}summoners/${server}/${name}/level-image`)
        })
        const responses = await Promise.all(promises)
        const datas = await Promise.all(responses.map(res => res.json()))
        
        return {
            cachedPlayers: [...new Set(keys)].map((key: string) => ({
                server: key.split(':')[0],
                name: key.split(':')[1],
                image: datas[keys.indexOf(key)].image,
                level: datas[keys.indexOf(key)].level,
            })),
        }
    } catch (e: unknown) {
        console.error("Cached Players not working")
        return {
            cachedPlayers: [],
        }
    }
}
