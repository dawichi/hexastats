import { servers, validateServer } from '$lib/config'
import type { GameDto, SummonerDto } from '$lib/types'

import { PUBLIC_IS_DEVELOPMENT } from '$env/static/public'
import type { PlayerDto } from '$lib/types/player/Player.dto'
import type { MasteryDto } from '$lib/types/player/Mastery.dto'

const development = PUBLIC_IS_DEVELOPMENT === 'true'
const backendUrl = development ? 'http://localhost:5000/' : 'https://api-hexastats.vercel.app/'

/**
 * ## Service to manage summoner data requests
 * Controls the data requests to the Riot API by using a redis remote database.
 * Provides caching and an improved management of the data.
 */
export class SummonerService {
    /**
     * ## Requests summoner data from the backend API
     *
     * @param server_idx The index of server in servers array
     * @param summonerName The summoner name to request the data from
     * @returns The summoner data
     */
    static async getData(server_idx: number, summonerName: string): Promise<SummonerDto> {
        const okServer = validateServer(servers[server_idx])

        const playerData = await fetch(`${backendUrl}summoners/${okServer}/${summonerName}`)
        const playerMasteries = await fetch(`${backendUrl}summoners/${okServer}/${summonerName}/masteries`)
        const playerGames = await fetch(`${backendUrl}summoners/${okServer}/${summonerName}/games`)

        if (!playerData.ok || !playerMasteries.ok || !playerGames.ok) throw new Error('Summoner not found')

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
     * ## Requests new extra games from the backend API
     *
     * @param server The server to request the data from
     * @param summonerName The summoner name to request the data from
     * @param gamesLength The number of games already stored
     * @returns The games data
     */
    static async addGames(server: string, summonerName: string, gamesLength: number): Promise<SummonerDto> {
        const gamesLimit = gamesLength + 10
        const okServer = validateServer(server)

        const data = await fetch(`${backendUrl}summoners/${okServer}/${summonerName}?gamesLimit=${gamesLimit}`)
        if (!data.ok) {
            throw new Error('Error while requesting new games, try again...')
        }
        return data.json()
    }
}
