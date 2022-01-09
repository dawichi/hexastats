import React from 'react'

// TODO: why the types in context (<Array<Player>>) doesn't work ._.
export const PlayersContext = React.createContext({
	players: [],
	setPlayers: (context: any) => context, 
})
