import { PlayerDto } from 'interfaces'
import { createContext } from 'react'

export const PlayersContext = createContext({
    players: <Array<PlayerDto>>[],
    setPlayers: (context: any) => context,
})
