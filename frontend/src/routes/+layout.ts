import { RiotService } from '$lib/services/Riot.service'
import { SummonerService } from '$lib/services/Summoner.service'

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }: { fetch: typeof window.fetch }): Promise<void> {
        const url = 'https://ddragon.leagueoflegends.com/api/versions.json'
        const response = await fetch(url)
        const versions: Array<string> = await response.json()

        // Init singleton services
        const riotService = RiotService.getInstance(versions[0])
        const summonerService = SummonerService.getInstance(fetch)
}
