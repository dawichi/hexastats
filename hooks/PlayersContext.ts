import { Player } from 'interfaces/player'
import { createContext } from 'react'

export const PlayersContext = createContext({
    players: <Array<Player>>[],
    setPlayers: (context: any) => context,
})
