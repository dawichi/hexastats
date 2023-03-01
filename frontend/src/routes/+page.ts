import { backendUrl } from '$lib/services/Summoner.service'
import type { CachedNameDto } from '$lib/types'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load(): Promise<{ cachedPlayers: CachedNameDto[] }> {
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
            return fetch(`http://localhost:5000/summoners/${server}/${name}/level-image`)
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
        throw error(500, 'Server is not up, try in a few minutes.')
    }
}
