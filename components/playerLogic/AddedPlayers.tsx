import React, { useContext } from 'react'
import { RankStructure } from '..'
import { PlayersContext } from '../../hooks/PlayersContext'
import { styles } from '../../styles/styles.config'

// Lists a extended view of players added in context, with its rank data
const AddedPlayers = () => {

	const { players, setPlayers } = useContext(PlayersContext)

	const handleDeletePlayer = (player_to_delete: number) => {
		const start = players.slice(0, player_to_delete)
		const end = players.slice(player_to_delete+1, players.length)
		setPlayers(start.concat(end))
	}

	return (
		<div className='container mx-auto'>
			{players && (
				<div className='grid grid-cols-4 gap-4'>
					{players.map((player, idx) => (
						<div key={idx} className={`${styles.foreground} ${styles.card} p-4 relative`}>
							<RankStructure player={player}/>

							<button
								onClick={() => handleDeletePlayer(idx)}
								className='p-1 px-2 absolute top-0 right-0 hover:bg-red-500 rounded-sm'
							>
								<i className="bi bi-person-x-fill"></i>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default AddedPlayers
