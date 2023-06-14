import { SummonerService } from "$lib/services/Summoner.service";
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: { server: string; alias: string } }) {
    const player = await SummonerService.existPlayer(params.server, params.alias)

    if (!player) {
        throw error(404, 'Player not found, double check your summoner name and server.')
    }

    return {
        player,
        server: params.server,
    }
}
