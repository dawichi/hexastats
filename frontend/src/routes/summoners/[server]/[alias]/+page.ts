import { SummonerService } from '$lib/services/Summoner.service'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: { server: string; alias: string } }) {
    try {
        return await SummonerService.getData(params.server, params.alias)
    } catch (e) {
        throw error(404, 'Player not found, double check your summoner name and server.')
    }
}
