import { SummonerService } from '$lib/services/Summoner.service'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }: { fetch: typeof window.fetch; params: { server: string; alias: string } }) {
    try {
        return await SummonerService.getData(params.server, params.alias, fetch)
    } catch (e: unknown) {
        const err = e as Error

        if (err.message === '429') {
            throw error(429, 'Too many requests, please wait a minute and try again.')
        }

        throw error(404, 'Player not found, double check your summoner name and server.')
    }
}
