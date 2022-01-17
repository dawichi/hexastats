import { createContext } from 'react'

// TODO: why the types in context (<Array<Player>>) doesn't work ._.
export const PlayersContext = createContext({
    players: [],
    setPlayers: (context: any) => context,
})
