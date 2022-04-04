import { useContext, useEffect, useState } from 'react'
import { Mastery } from 'interfaces/player'
import { styles } from 'styles/styles.config'
import { parse_k_num } from 'utils'
import { Container, EmptyPlayers, PlayerImg } from 'components'
import { PlayersContext } from 'hooks/PlayersContext'
import Image from 'next/image'
import { environment } from 'configs'

// ┌────────────────┐
// │ MASTERIES PAGE:│
// └────────────────┘
// Visualize each player in a table
// Each row of the table is a champ with his stats
export default function Masteries() {

    const [players, setPlayers] = useState([])
    const names = ['Dawichii', 'Brr1', 'BloddSword', 'alexwwe']
    const data_names = []

    useEffect(() => {
        const fetchData = async (name: string, idx:number) => {
            const response = await fetch(environment.backendUrl + '/' + name)
            const data = await response.json()
            data_names[idx] = data.data
            // setPlayers(players.concat(data.data))
        }
        names.forEach((name,idx) => {
            fetchData(name,idx)
        })
        console.log(data_names)
        console.log(players)
    }, [])
    
    const containerProps = {
        title: 'Mastery',
        description: 'Your 7 champions with most points',
    }

    if (!players || players.length === 0) {
        return (
            <Container {...containerProps}>
                <EmptyPlayers />
                <button onClick={()=>{
                    setPlayers(data_names)
                }}>Hola</button>
            </Container>
        )
    }

    return (
        <Container {...containerProps}>
            <div className='grid gap-4 2xl:grid-cols-2'>
                {players.map((player, idx_player) => {
                    let total_masteries = 0
                    player.masteries.map((mastery: Mastery) => (total_masteries += mastery.points))

                    return (
                        <div key={idx_player} className={`p-2 m-2 ${styles.card} ${styles.foreground} md:grid grid-cols-4`}>
                            <div className='flex items-center'>
                                <PlayerImg image={player.image} alias={player.alias} level={player.level} />
                                <div className='flex flex-col'>
                                    <h2 className='text-xl'>{player.alias}</h2>
                                    {total_masteries ? <h4>{parse_k_num(total_masteries, 0, false)}</h4> : <span>No data</span>}
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
                                            <div className='absolute t-0 r-0'>
                                                <div className='relative w-16 h-28 rounded'>
                                                    <Image
                                                        src={'/images/mastery_' + mastery.level + '.png'}
                                                        layout='fill'
                                                        alt={mastery.name}
                                                    />
                                                </div>
                                            </div>
                                            <div className='absolute t-0 r-0'>
                                                <div className='relative w-16 h-16 rounded'>
                                                    <Image src={mastery.image} layout='fill' alt={mastery.name} />
                                                </div>
                                            </div>
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