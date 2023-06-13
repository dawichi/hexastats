import { goto } from '$app/navigation'
import { SummonerService } from '$lib/services/Summoner.service'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: { server: string; alias: string } }) {
    try {
        console.log(params)
        const player = await SummonerService.existPlayer(params.server, params.alias)
        if (!player) {
            throw error(404, 'Player not found, double check your summoner name and server. Avoid writing names directly from URL, search them in Home Page.')
        }

        // Redirect to first page
        goto(`/summoners/${params.server}/${params.alias}/1`)
    } catch (e: unknown) {
        const err = e as Error

        if (err.message === '429') {
            throw error(429, 'Too many requests, please wait a minute and try again.')
        }

        throw error(404, 'Player not found, double check your summoner name and server. Avoid writing names directly from URL, search them in Home Page.')
    }
}
