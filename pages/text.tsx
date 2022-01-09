import React, { useContext } from 'react'
import { RankStructure } from '../components'
import { PlayersContext } from '../hooks/PlayersContext'

const text = () => {

	const context = useContext(PlayersContext)

	return (
		<div>
			{context.players && (
				<div className='flex flex-col justify-center items-center'>
					{context.players.map(player => {
						return (
							<div className='flex items-center justify-center gap-4 border'>
								<div className='relative flex flex-col items-center text-sm text-white'>
									<img className='m-3 w-14 rounded' src={player.image && player.image} alt={player.alias && player.alias} />
									<span className='px-1 absolute bottom-0 bg-zinc-700 border border-yellow-500 rounded-full'>{player.level}</span>
								</div>
								<h2 className='text-xl'>{player.alias && player.alias}</h2>
								{player.rank && player.rank.solo && <RankStructure title={'Solo/Duo'} rankdata={player.rank.solo} />}
								{player.rank && player.rank.flex && <RankStructure title={'Flex'} rankdata={player.rank.flex} />}
							</div>
						)
					})}
				</div>
			)}	
		</div>
	)
}

export default text
