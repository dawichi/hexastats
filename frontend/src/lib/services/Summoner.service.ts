import { validateServer } from '$lib/config'
import type { GameDto, MasteryDto, PlayerDto, RankDataDto, StatsDto, SummonerDto } from '$lib/types'

import { PUBLIC_IS_DEVELOPMENT } from '$env/static/public'

const development = PUBLIC_IS_DEVELOPMENT === 'true'
export const backendUrl = development ? 'http://localhost:5000/' : 'https://api-hexastats.vercel.app/'

/**
 * ## Service to manage summoner data requests
 * Controls the data requests to the Riot API by using a redis remote database.
 * Provides caching and an improved management of the data.
 */
export class SummonerService {
    private static handleError(response: Response) {
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
    static async getData({
        server,
        summonerName,
        limit,
        offset,
        fetch,
    }: {
        server: string
        summonerName: string
        limit: number
        offset: number
        fetch: typeof window.fetch
    }): Promise<SummonerDto> {
        const okServer = validateServer(server)

        const [playerData, playerMasteries, playerGames] = await Promise.all([
            fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}`),
            fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/masteries`),
            fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/games?offset=${offset}&limit=${limit}&queueType=all`),
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
     * ## Requests summoner stats from the backend API
     */
    static async getStats({ server, summonerName, fetch }: { server: string; summonerName: string; fetch: typeof window.fetch }): Promise<StatsDto> {
        const okServer = validateServer(server)
        const statsData = await fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/stats`)
        this.handleError(statsData)
        return statsData.json()
    }

    /**
     * ## Requests to add new +10 extra stats from the API
     */
    static async addStats(server: string, summonerName: string): Promise<StatsDto> {
        const okServer = validateServer(server)
        const statsData = await fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/stats/add`)
        this.handleError(statsData)
        return statsData.json()
    }

    /**
     * ## Checks if the player exists on the server
     * @returns The player basic data if it exists, null otherwise
     */
    static async existPlayer(server: string, summonerName: string): Promise<null | PlayerDto> {
        const okServer = validateServer(server)
        const playerData = await fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}`)
        return playerData.ok ? playerData.json() : null
    }
}
