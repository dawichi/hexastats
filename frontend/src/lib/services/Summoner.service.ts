import { servers, validateServer } from '$lib/config'
import type { GameDto, SummonerDto} from '$lib/types'

const development = true
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
    static async getSummonerByName(server_idx: number, summonerName: string): Promise<SummonerDto> {
        const okServer = validateServer(servers[server_idx])
        const data = await fetch(`${backendUrl}summoners/${okServer}/${summonerName}`)

        if (!data.ok) {
            throw new Error('Summoner not found')
        }
        return data.json()
    }

    // /**
    //  * ## Saves summoner games into the React Context
    //  *
    //  * @param summonerName The summoner name
    //  * @param data The summoner games to save
    //  */
    // private saveGames(summonerName: string, data: GameDto[]): void {
    //     const newPlayers = this.players.map(player => {
    //         if (player.alias === summonerName) {
    //             player.games = data
    //         }
            
    //         return player
    //     })
    //     this.setPlayers(newPlayers)
    //     localStorage.setItem('players', JSON.stringify(newPlayers))
    // }

    // /**
    //  * ## Requests new extra games from the backend API
    //  *
    //  * @param server The server to request the data from
    //  * @param summonerName The summoner name to request the data from
    //  * @param games The number of games already stored
    //  * @returns The games data
    //  */
    // async addGames(server: string, summonerName: string, games: number): Promise<any> {
    //     const gamesLimit = games + 10
    //     const okServer = validateServer(server)
    //     let newGames: GameDto[]
    //     try {
    //         const { data }: { data: SummonerDto } = await axios.get(`${environment.backendUrl}summoners/${okServer}/${summonerName}?gamesLimit=${gamesLimit}`)
    //         newGames = data.games
    //     } catch {
    //         console.error('Error while requesting new games, try again...')
            
    //         return null
    //     }

    //     return this.saveGames(summonerName, newGames)
    // }
}
