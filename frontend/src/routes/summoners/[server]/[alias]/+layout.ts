import { SummonerService } from '$lib/services/Summoner.service'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').LayoutLoad} */
export async function load({ params }: { params: { server: string; alias: string } }) {
    const summonerService = SummonerService.getInstance()
    const player = await summonerService.existPlayer(params.server, params.alias)

    if (!player) {
        throw error(404, 'Player not found, double check your summoner name, tag and server.')
    }

    const masteries = await summonerService.getMasteries(params.server, params.alias)
    const stats = await summonerService.getStats(params.server, params.alias)

    return {
        player,
        masteries,
        stats,
    }
}
