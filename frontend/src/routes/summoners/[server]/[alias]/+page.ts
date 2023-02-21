import { SummonerService } from '$lib/services/Summoner.service'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: { server: string; alias: string } }) {
    try {
        return await SummonerService.getData(params.server, params.alias)
    } catch (e: unknown) {
        const err = e as Error
        
        if (err.message === '429') {
            throw error(429, 'Too many requests, please wait a minute and try again.')
        }

        throw error(404, 'Player not found, double check your summoner name and server.')
    }
}
