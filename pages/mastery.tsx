import { useContext } from 'react'
import { Mastery } from 'interfaces/player'
import { styles } from 'styles/styles.config'
import { parse_k_num } from 'utils'
import { Container, EmptyPlayers, PlayerImg } from 'components'
import { PlayersContext } from 'hooks/PlayersContext'

// ┌────────────────┐
// │ MASTERIES PAGE:│
// └────────────────┘
// Visualize each player in a table
// Each row of the table is a champ with his stats
export default function Masteries() {
    const { players } = useContext(PlayersContext)

    if (!players || players.length === 0) {
        return <EmptyPlayers />
    }

    return (
        <Container title={'Mastery'} description={'Your 7 champions with most points'}>
            <div className='grid gap-4 xl:grid-cols-2'>
                {players.map((player, idx_player) => {
                    let total_masteries = 0
                    player.masteries.map((mastery: Mastery) => (total_masteries += mastery.points))

                    return (
                        <div key={idx_player} className={`p-2 m-2 ${styles.card} ${styles.foreground} md:grid grid-cols-4`}>
                            <div className='flex items-center'>
                                <PlayerImg image={player.image} alias={player.alias} level={player.level} />
                                <div className='flex flex-col'>
                                    <h2 className='text-xl'>{player.alias}</h2>
                                    <h4>{parse_k_num(total_masteries, 0, false)}</h4>
                                </div>
                            </div>
                            <div className='col-span-3 grid grid-cols-4 sm:grid-cols-7'>
                                {player.masteries.map((mastery: Mastery, idx_mastery: number) => (
                                    <div key={idx_mastery} className='p-2 text-center'>
                                        <span>
                                            {mastery.points > 100000 ? '🔥' : ''}
                                            {parse_k_num(mastery.points, 0, true)}
                                        </span>
                                        <div className='relative h-24 flex justify-center'>
                                            <img
                                                className='w-14 rounded absolute t-0 r-0'
                                                src={'/images/mastery_' + mastery.level + '.png'}
                                                alt={mastery.name}
                                            />
                                            <img className='w-14 rounded absolute t-0 r-0' src={mastery.image} alt={mastery.name} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Container>
    )
}
