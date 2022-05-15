import { useContext } from 'react'
import { PlayersContext } from 'hooks/PlayersContext'
import { Container, EmptyPlayers, PlayerImg } from 'components'
import { statTitle } from 'utils'
import { Champ } from 'interfaces/Player'

// ┌────────────────┐
// │ MULTIPLE PAGE: │
// └────────────────┘
// Home page, visualize each player in a table
// Each row of the table is a champ with his stats
export default function Multiple() {
    const { players } = useContext(PlayersContext)

    const containerProps = {
        title: 'Multiple kills',
        description: 'How likely are you to make a multikill in a game?',
    }

    if (!players || players.length === 0) {
        return (
            <Container {...containerProps}>
                <EmptyPlayers />
            </Container>
        )
    }

    const MultipleStructure = ({ stat }: { stat: string }) => (
        <div className='p-2'>
            <h2 className='text-2xl text-center mb-5'>{statTitle(stat)}</h2>
            {players.map((player, idx) => {
                let games = 0
                let stat_value = 0

                player.champs?.map((champ: Champ) => {
                    games += champ.games
                    stat_value += champ[stat]
                })

                const result = games ? parseFloat((stat_value / games).toFixed(2)) : 0

                // Expected maximum for each stat
                const widths = {
                    double_kills: 4,
                    triple_kills: 1.5,
                    quadra_kills: 0.6,
                    penta_kills: 0.1,
                }

                return (
                    <div key={idx}>
                        <div className='grid grid-cols-2 lg:grid-cols-3'>
                            <div className='flex items-center justify-start '>
                                <div className='m-2 w-14 rounded h-14 relative'>
                                    <PlayerImg image={player.image} alias={player.alias} level={player.level} margin={'m-0'} />
                                </div>
                                <p>{player.alias}</p>
                            </div>

                            <div className='lg:col-span-2 flex flex-col justify-center'>
                                <div className='flex justify-between items-center'>
                                    <span>{result} &nbsp; &nbsp; by game</span>
                                    <span>{stat_value} total</span>
                                </div>
                                <div className='h-3 rounded w-full bg-zinc-400/50'>
                                    <div
                                        className='h-3 rounded bg-indigo-400'
                                        style={{ width: `${(result * 100) / widths[stat]}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )

    return (
        <Container {...containerProps}>
            <div className='grid gap-4 lg:grid-cols-2'>
                <MultipleStructure stat='double_kills' />
                <MultipleStructure stat='triple_kills' />
                <MultipleStructure stat='quadra_kills' />
                <MultipleStructure stat='penta_kills' />
            </div>
        </Container>
    )
}
