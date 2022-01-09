import React from 'react'
import axios from 'axios'
import { backend, players } from '../configs'
import { Player } from '../interfaces/player'
import { styles } from '../styles/styles.config'
import PlayerImg from '../components/PlayerImg'
import { parse_k_num } from '../utils'

// ┌────────────────┐
// │ MASTERIES PAGE:│
// └────────────────┘
// Visualize each player in a table
// Each row of the table is a champ with his stats
export default function masteries(props: { data: Player[] }) {
    return (
        <div className='animate__animated animate__fadeIn container m-auto py-8 lg:py-16'>
            <div className='grid gap-4 xl:grid-cols-2'>
                {props.data.map((player, idx_player) => {
                    let total_masteries = 0
                    player.masteries.map((mastery, idx) => (total_masteries += mastery.points))

                    return (
                        <div key={idx_player} className={`p-2 m-2 ${styles.card} ${styles.foreground} md:grid grid-cols-4`}>
                            <div className='flex items-center'>
                                <PlayerImg image={player.image} name={player.alias} level={player.level} />
                                <div className='flex flex-col'>
                                    <h2 className='text-xl'>{player.alias}</h2>
                                    <h4>{parse_k_num(total_masteries, 0)}</h4>
                                </div>
                            </div>
                            <div className='col-span-3 grid grid-cols-4 sm:grid-cols-7'>
                                {player.masteries.map((mastery, idx_mastery) => (
                                    <div key={idx_mastery} className='p-2 text-center'>
                                        <span>
                                            {mastery.points > 100000 ? '🔥' : ''}
                                            {parse_k_num(mastery.points, 0)}
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
        </div>
    )
}

// Fetch data from euw.op.gg with getStaticProps()'s NextJS function
export const getStaticProps = async () => {
    const data: Player[] = []
    for (let idx = 0; idx < players.length; idx++) {
        let player_response = await axios.get(backend + players[idx])
        data.push(player_response.data)
    }

    return {
        props: { data: data },
    }
}
