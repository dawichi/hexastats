import { RiotService } from '$lib/services/Riot.service'
import { SummonerService, backendUrl } from '$lib/services/Summoner.service'
import type { PlayerDto } from '$lib/types'

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }: { fetch: typeof window.fetch }): Promise<{ error: boolean; cachedPlayers: Array<PlayerDto> }> {
    /**
     * This layout do not return any data
     * It is used to initialize the singleton services
     */
    const versions_res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
    const versions: Array<string> = await versions_res.json()

    // Initialize the singleton services
    const riotService = RiotService.getInstance(versions[0])
    const summonerService = SummonerService.getInstance(fetch)

    // Fetch the cached players
    try {
        const cached_res = await fetch(`${backendUrl}database/print`)

        // In case of error (backend down), notify the error through `error` flag
        const error = !cached_res.ok
        const cached: Array<string> = error ? [] : (await cached_res.json())?.keys

        return {
            error,
            cachedPlayers: cached.map((key: string) => ({
                server: key.split(':')[0],
                alias: key.split(':')[1],
                riotIdName: key.split(':')[1].split('#')[0],
                riotIdTag: key.split(':')[1].split('#')[1],
                image: '',
                level: 0,
            })),
        }
    } catch (error) {
        return {
            error: true,
            cachedPlayers: [],
        }
    }
}
