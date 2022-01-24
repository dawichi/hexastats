import { useContext } from 'react'
import { PlayersContext } from 'hooks/PlayersContext'
import { Container, EmptyPlayers } from 'components'
import Image from 'next/image'

// ┌────────────────┐
// │ MULTIPLE PAGE: │
// └────────────────┘
// Home page, visualize each player in a table
// Each row of the table is a champ with his stats
export default function Multiple() {
    const { players } = useContext(PlayersContext)

    if (!players || players.length === 0) {
        return <EmptyPlayers />
    }

    const structure = (title: string, stat: string) => (
        <div className='p-2'>
            <h2 className='text-2xl text-center mb-5'>{title}</h2>
            {players.map((player, idx) => {
                let games = 0
                let stat_value = 0


                player.champs.map(champ => {
                    games += champ.games
                    stat_value += champ[stat]
                })

                const result = parseFloat((stat_value / games).toFixed(2))

                const width = (result * 100) / 2
				
                return (
                    <div key={idx}>
                        <div className='grid grid-cols-2 lg:grid-cols-3'>
                            <div className='flex items-center justify-start '>
								<div className='m-2 w-14 rounded h-14 relative'>
									<Image src={player.image} alt={player.alias} layout='fill'/>
								</div>
                                <p>{player.alias}</p>
                            </div>
                            {result != 0 && (
                                <div className='lg:col-span-2 flex flex-col justify-center'>
									<div className='flex justify-between items-center'>
										<span>{result} &nbsp; &nbsp; by game</span>
										<span>{stat_value} total</span>
									</div>
                                    <div className='h-3 rounded w-full bg-zinc-400/50'>
                                        <div className='h-3 rounded bg-red-200' style={{ width: width + '%' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )

    return (
        <Container title={'Multiple kills'} description={'How likely are you to make a multikill in a game?'}>
            <div className='grid gap-4 lg:grid-cols-2'>
                {structure('Doble kills', 'double_kills')}
                {structure('Triple kills', 'triple_kills')}
                {structure('Quadra kills', 'quadra_kills')}
                {structure('Penta kills', 'penta_kills')}
            </div>
        </Container>
    )
}
