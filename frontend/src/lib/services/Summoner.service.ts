import { validateServer } from '$lib/config'
import type { GameDto, MasteryDto, RankDataDto, StatsDto, SummonerDto } from '$lib/types'

import { PUBLIC_IS_DEVELOPMENT } from '$env/static/public'

const development = PUBLIC_IS_DEVELOPMENT === 'true'
export const backendUrl = development ? 'http://localhost:5000/' : 'https://api-hexastats.vercel.app/'

/**
 * ## Service to manage summoner data requests
 * Controls the data requests to the Riot API by using a redis remote database.
 * Provides caching and an improved management of the data.
 */
export class SummonerService {
    private static instance: SummonerService
    public readonly Sveltefetch: typeof window.fetch
    
    constructor(fetch: typeof window.fetch) {
        // This fetch is the svelteKit fetch, not the browser one
        this.Sveltefetch = fetch
    }

    public static getInstance(Sveltefetch: typeof window.fetch = fetch): SummonerService {
        if (!SummonerService.instance) {
            console.log('Creating SummonerService instance')
            SummonerService.instance = new SummonerService(Sveltefetch)
        }
        return SummonerService.instance
    }

    private handleError(response: Response) {
        // ERROR HANDLING
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('429')
            }
            throw new Error()
        }
    }

    /**
     * ## Requests summoner data from the backend API
     */
    async getData({
        server,
        summonerName,
        limit,
        offset,
    }: {
        server: string
        summonerName: string
        limit: number
        offset: number
    }): Promise<SummonerDto> {
        const okServer = validateServer(server)

        const [playerData, playerMasteries, playerGames] = await Promise.all([
            this.Sveltefetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}`),
            this.Sveltefetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/masteries`),
            this.Sveltefetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/games?offset=${offset}&limit=${limit}&queueType=all`),
        ])

        this.handleError(playerData)
        this.handleError(playerMasteries)
        this.handleError(playerGames)

        const summonerData: RankDataDto = await playerData.json()
        const masteries: MasteryDto[] = await playerMasteries.json()
        const games: GameDto[] = await playerGames.json()

        return {
            ...summonerData,
            masteries,
            games,
        }
    }

    
    /**
     * ## Requests only masteries from the backend API
     */
    async getMasteries(server: string, summonerName: string): Promise<MasteryDto[]> {
        const okServer = validateServer(server)
        const masteries = await this.Sveltefetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/masteries`)
        this.handleError(masteries)
        return masteries.json()
    }

    /**
     * ## Requests summoner stats from the backend API
     */
    async getStats(server: string, summonerName: string): Promise<StatsDto> {
        const okServer = validateServer(server)
        const statsData = await this.Sveltefetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/stats`)
        this.handleError(statsData)
        return statsData.json()
    }

    /**
     * ## Requests to add new +10 extra stats from the API
     */
    async addStats(server: string, summonerName: string): Promise<StatsDto> {
        const okServer = validateServer(server)
        const statsData = await this.Sveltefetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/stats/add`)
        this.handleError(statsData)
        return statsData.json()
    }

    /**
     * ## Checks if the player exists on the server
     * @returns The player basic data if it exists, null otherwise
     */
    async existPlayer(server: string, summonerName: string): Promise<null | RankDataDto> {
        const okServer = validateServer(server)
        const playerData = await this.Sveltefetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}`)
        return playerData.ok ? playerData.json() : null
    }
}
