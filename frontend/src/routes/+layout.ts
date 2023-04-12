import { backendUrl } from '$lib/services/Summoner.service'

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }: { fetch: typeof window.fetch }): Promise<{ version: string }> {
    try {
        const url = 'https://ddragon.leagueoflegends.com/api/versions.json'
        const response = await fetch(url)
        const versions: Array<string> = await response.json()

        return {
            version: versions[0],
        }
    } catch (e: unknown) {
        const version = '13.7.1'
        console.error(`[${backendUrl}riot/version] not working -> returning last known: ${version}`)

        return {
            version,
        }
    }
}
