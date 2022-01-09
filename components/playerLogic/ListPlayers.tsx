import React, { useContext } from 'react'
import { PlayersContext } from '../../hooks/PlayersContext'

// Lists a compressed list of players in context 
const ListPlayers = () => {

	const { players } = useContext(PlayersContext)

	return (
		<div>
			{players && (
				<div className='flex justify-center items-center'>
					{players.map((player, idx) => (
						<div key={idx} className='bg-red-400/50 p-2 m-1 border'>
							{player.alias}
						</div>
					))}
				</div>
			)}	
		</div>
	)
}

export default ListPlayers
