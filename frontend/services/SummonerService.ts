import axios from 'axios'
import { environment, servers, validateServer } from 'configs'
import { GameDto, SummonerDto} from 'interfaces'


/**
 * ## Service to manage summoner data requests
 * Controls the data requests to the Riot API by using a redis remote database.
 * Provides caching and an improved management of the data.
 */
export class SummonerService {
    private readonly players: SummonerDto[]
    private readonly setPlayers: any

    constructor (players: SummonerDto[], setPlayers: any) {
        this.players = players
        this.setPlayers = setPlayers
    }

    /**
     * ## Saves summoner data into the React Context
     *
     * @param data The summoner data to save
     */
    private saveSummoner(data: SummonerDto) {
        const newPlayers = this.players.concat(data)
        this.setPlayers(newPlayers)
        localStorage.setItem('players', JSON.stringify(newPlayers))
    }

    /**
     * ## Requests summoner data from the backend API
     *
     * @param server_idx The index of server in servers array
     * @param summonerName The summoner name to request the data from
     * @returns The summoner data
     */
    async get(server_idx: number, summonerName: string): Promise<void> {
        const okServer = validateServer(servers[server_idx])
        const { data }: { data: SummonerDto } = await axios.get(`${environment.backendUrl}summoners/${okServer}/${summonerName}`)
        
        return this.saveSummoner(data)
    }

    /**
     * ## Saves summoner games into the React Context
     *
     * @param summonerName The summoner name
     * @param data The summoner games to save
     */
    private saveGames(summonerName: string, data: GameDto[]): void {
        const newPlayers = this.players.map(player => {
            if (player.alias === summonerName) {
                player.games = data
            }
            
            return player
        })
        this.setPlayers(newPlayers)
        localStorage.setItem('players', JSON.stringify(newPlayers))
    }

    /**
     * ## Requests new extra games from the backend API
     *
     * @param server The server to request the data from
     * @param summonerName The summoner name to request the data from
     * @param games The number of games already stored
     * @returns The games data
     */
    async addGames(server: string, summonerName: string, games: number): Promise<any> {
        const gamesLimit = games + 10
        const okServer = validateServer(server)
        let newGames: GameDto[]
        try {
            const { data }: { data: SummonerDto } = await axios.get(`${environment.backendUrl}summoners/${okServer}/${summonerName}?gamesLimit=${gamesLimit}`)
            newGames = data.games
        } catch {
            console.error('Error while requesting new games, try again...')
            
            return null
        }

        return this.saveGames(summonerName, newGames)
    }
}
