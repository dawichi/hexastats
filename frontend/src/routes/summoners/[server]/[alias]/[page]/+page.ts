import { SummonerService } from '$lib/services/Summoner.service'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }: { fetch: typeof window.fetch; params: { server: string; alias: string; page: number } }) {
    try {
        return await SummonerService.getData({
            server: params.server,
            summonerName: params.alias,
            limit: 10,
            offset: params.page * 10 - 10,
            fetch,
        })
    } catch (e: unknown) {
        const err = e as Error

        if (err.message === '429') {
            throw error(429, 'Too many requests, please wait a minute and try again.')
        }

        throw error(404, 'Player not found, double check your summoner name and server.')
    }
}
