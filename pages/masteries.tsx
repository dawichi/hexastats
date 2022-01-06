import React from 'react'
import axios from 'axios'
import { backend, players } from '../configs'
import { Player } from '../interfaces/player'
import { styles } from '../styles/styles.config'
import PlayerImg from '../components/PlayerImg'

// ┌────────────────┐
// │ MASTERUES PAGE:│
// └────────────────┘
// Visualize each player in a table
// Each row of the table is a champ with his stats
export default function masteries(props: { data: Player[] }) {
    return (
        <div className='animate__animated animate__fadeIn container m-auto py-8 lg:py-16'>
            {props.data.map((player, idx_player) => (
                <div key={idx_player} className={`p-2 m-2 ${styles.card} ${styles.foreground}`}>
                    <div className='flex items-center'>
                        <PlayerImg image={player.image} name={player.name} level={player.level} />
                        <div className='flex flex-col'>
                            <h2 className='text-xl'>{player.name}</h2>
                            <h3>({player.alias})</h3>
                        </div>
                        <div className='ml-5 grid gap-4 grid-cols-7'>
                            {player.masteries.map((mastery, idx_mastery) => (
                                <div key={idx_mastery} className='border p-3'>
                                    <img className='m-3 w-14 rounded' src={mastery.image} alt={mastery.name} />
                                    <div>
                                        {mastery.level}. {mastery.name}. <br />({mastery.points})
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            <div className='grid gap-4 grid-cols-4'></div>
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
