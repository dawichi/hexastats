import { validateServer } from '$lib/config'
import type { GameDto, SummonerDto } from '$lib/types'

import { PUBLIC_IS_DEVELOPMENT } from '$env/static/public'
import type { PlayerDto } from '$lib/types/player/Player.dto'
import type { MasteryDto } from '$lib/types/player/Mastery.dto'

const development = PUBLIC_IS_DEVELOPMENT === 'true'
export const backendUrl = development ? 'http://localhost:5000/' : 'https://api-hexastats.vercel.app/'

/**
 * ## Service to manage summoner data requests
 * Controls the data requests to the Riot API by using a redis remote database.
 * Provides caching and an improved management of the data.
 */
export class SummonerService {
    /**
     * ## Requests summoner data from the backend API
     * @param server The server to request the data from
     * @param summonerName The summoner name to request the data from
     * @returns The summoner data
     */
    static async getData(server: string, summonerName: string): Promise<SummonerDto> {
        const okServer = validateServer(server)

        const playerData = await fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}`)
        const playerMasteries = await fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/masteries`)
        const playerGames = await fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/games`)

        // ERRIR HANDLING
        if (!playerData.ok || !playerMasteries.ok || !playerGames.ok) {
            if (playerGames.status === 429) {
                throw new Error('429')
            }
            throw new Error()
        }


        const summonerData: PlayerDto = await playerData.json()
        const masteries: MasteryDto[] = await playerMasteries.json()
        const games: GameDto[] = await playerGames.json()

        return {
            ...summonerData,
            masteries,
            games,
        }
    }

    /**
     * ## Checks if the player exists on the server
     * @param server Server to check if the player exists on it
     * @param summonerName Summoner name to check if it exists
     * @returns The player basic data if it exists, null otherwise
     */
    static async existPlayer(server: string, summonerName: string): Promise<null | PlayerDto> {
        const okServer = validateServer(server)
        const playerData = await fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}`)

        return playerData.ok ? playerData.json() : null
    }

    /**
     * ## Requests 10 extra games from the backend API
     * @param server The server to request the data from
     * @param summonerName The summoner name to request the data from
     * @returns The new games data
     */
    static async addGames(server: string, summonerName: string): Promise<GameDto[]> {
        const NUM_GAMES_TO_ADD = 10
        const okServer = validateServer(server)

        const data = await fetch(`${backendUrl}summoners/${okServer}/${encodeURI(summonerName.trim())}/addGames/${NUM_GAMES_TO_ADD}`)
        if (!data.ok) {
            throw new Error('Error while requesting new games, try again...')
        }
        return data.json()
    }
}
