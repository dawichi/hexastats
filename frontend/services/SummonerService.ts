import axios from 'axios'
import { environment, servers, validateServer } from 'configs'
import { SummonerDto} from 'interfaces'


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
     * @param server The server to request the data from
     * @param summonerName The summoner name to request the data from
     * @returns The summoner data
     */
    async get(server: string, summonerName: string) {
        const okServer = validateServer(servers[server])
        const { data }: { data: SummonerDto } = await axios.get(`${environment.backendUrl}summoners/${okServer}/${summonerName}`)
        
        return this.saveSummoner(data)
    }

}
