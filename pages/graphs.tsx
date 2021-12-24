/* eslint-disable @next/next/no-img-element */
import React from 'react'
import axios from 'axios'
import { backend, players } from '../config'
import { ChartCard, ProgressByPlayer } from '../components'
import { getStatValues, trophyIcon, statTitle } from '../utils'
import { Chart, Player, RankResults } from '../interfaces/interfaces'
import { styles } from '../styles/styles.config'

// ┌────────────────┐
// │  GRAPHS PAGE:  │
// └────────────────┘
// Process the data with 'process()' function to get the specific
// stats of each category and pass the filtered information to the <PieChart/> components
export default function Graphs(props: { data: any[] }) {
    // Trophies counter for each player
    const rank_results: RankResults[] = []
    props.data.map((player: Player) => {
        rank_results.push({
            name: player.name,
            image: player.image,
            trophies: [],
        })
    })

    const charts: Chart[] = []
    // TODO: get props available dynamically
    const prop_keys = ['games', 'winrate', 'kda', 'kills', 'deaths', 'assists', 'cs', 'csmin']

    prop_keys.forEach(prop => {
        const sort_desc = prop === 'deaths'
        const calc_median = prop !== 'games'
        const [data_stat, data_stat_int] = getStatValues(props.data, rank_results, prop, calc_median, sort_desc)

        charts.push({
            key: prop,
            title: statTitle(prop),
            data: data_stat,
            data_int: data_stat_int,
        })
    })

    // Sorts player's trophies by value (so it shows 1º, 2º and 3º cups in correct order)
    rank_results.map(card =>
        card.trophies.sort(function (a, b) {
            return a - b
        }),
    )

    return (
        <div className='animate__animated animate__fadeIn'>
            <div className='container-fluid'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'>
                    {rank_results.map((card, indx_card) => (
                        <div key={indx_card}>
                            <div className={`p-1 m-2 mt-5 ${styles.card} ${styles.foreground}`}>
                                <div className='flex'>
                                    <img className='m-2 w-14 h-14 rounded' src={card.image} alt={card.name} />
                                    <div className='flex flex-col'>
                                        <span className='pb-1 text-xl'>{card.name}</span>
                                        <div className='mr-1'>
                                            {card.trophies.map((x, idx) => (
                                                <span key={idx}>{trophyIcon(x)}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PIECHART SECTION */}
            <div className='container mx-auto'>
                <h2 className='text-4xl text-center mt-10 mb-5'>Graphs by stat</h2>
                <hr />
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
                    {charts.map((x, index) => (
                        <ChartCard key={index} id={index + 1} title={x.title} data={x.data} data_int={x.data_int} />
                    ))}
                </div>
            </div>
            <br />

            {/* PROGRESSBARS SECTION */}
            <div className='container mx-auto'>
                <h2 className='text-4xl text-center mt-10 mb-5'>Stats of each player</h2>
                <hr />
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
                    <ProgressByPlayer data={props.data} charts={charts} prop_keys={prop_keys} />
                </div>
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
