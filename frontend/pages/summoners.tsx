import { useContext, useState } from 'react'
import { PlayersContext } from 'hooks/PlayersContext'
import Image from 'next/image'
import { Container, EmptyPlayers, SummonerPage } from 'components'
import { styles } from 'styles/styles.config'

// ┌────────────────┐
// │ Summoner PAGE: │
// └────────────────┘
// Visualize each player in a table
// Each row of the table is a champ with his stats
export default function Summoners() {
    const { players } = useContext(PlayersContext)

    // State to control the tabs
    const [playerSelected, setPlayerSelected] = useState<number>(0)

    const containerProps = {
        title: 'Summoners',
        description: 'Your summoner page, check your information',
    }

    if (!players || players.length === 0) {
        return (
            <Container {...containerProps}>
                <EmptyPlayers />
            </Container>
        )
    }

    return (
        <Container {...containerProps} disableHeader>
            <div className='py-2 flex flex-wrap items-center'>
                {players.map((player, idx_player) => (
                    <div
                        key={idx_player}
                        title={player.alias}
                        onClick={() => setPlayerSelected(idx_player)}
                        className={`rounded cursor-pointer shadow-sm m-1 p-2 relative border border-zinc-300 dark:border-zinc-600 ${
                            idx_player === playerSelected ? styles.active : styles.foreground
                        }`}
                    >
                        <div className='flex justify-center items-end'>
                            <div className='w-12 h-12 rounded overflow-hidden relative'>
                                <Image layout='fill' src={player.image} alt={player.alias} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {playerSelected < players.length && <SummonerPage player={players[playerSelected]} />}
        </Container>
    )
}
