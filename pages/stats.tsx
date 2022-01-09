/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react'
import { Popover } from '@headlessui/react'
import { Container, EmptyPlayers, RankStructure } from '../components'
import { PlayersContext } from '../hooks/PlayersContext'
import { Player } from '../interfaces/player'
import { styles } from '../styles/styles.config'

// ┌────────────────┐
// │ STATS PAGE:    │
// └────────────────┘
// Visualize each player in a table
// Each row of the table is a champ with his stats
export default function Home() {
    const { players } = useContext(PlayersContext)

    if (players.length === 0) {
        return <EmptyPlayers />
    }

    return (
        <Container title={'Stats'} description={'Basic stats of your 7 most played champs in rankeds'}>
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
                {/* For each player, print a table and its table-head */}
                {players.map((player: Player, index_player: number) => (
                    <div key={index_player} className={`flex flex-col ${styles.foreground} ${styles.card}`}>
                        <div className='p-4'>
                            <RankStructure player={player} />
                        </div>

                        <table className={`table-auto m-3 text-center border dark:border-zinc-500`}>
                            <thead>
                                <tr>
                                    <th className='py-1 px-2 bg-zinc-300 dark:bg-zinc-800'>Champ</th>
                                    <th className={styles.stat.games}>Games</th>
                                    <th className={styles.stat.kda}>KDA</th>
                                    <th className={styles.stat.kills}>K</th>
                                    <th className={styles.stat.deaths}>D</th>
                                    <th className={styles.stat.assists}>A</th>
                                    <th className={styles.stat.cs}>CSM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* For each champ inside a player, print a row with the data */}
                                {player.champs.map((champ, index_champ) => (
                                    <tr key={index_champ} className='border dark:border-zinc-500'>
                                        <td>
                                            <Popover className='relative'>
                                                <Popover.Button>
                                                    <img src={champ.image} alt='champ image' className='p-1 w-full' />
                                                </Popover.Button>
                                                <Popover.Panel className='absolute z-10 transform translate-x-1/4 -translate-y-1/2 left-1/2 w-64'>
                                                    <div className={`p-4 border border-zinc-400 shadow-xl rounded-lg ${styles.foreground}`}>
                                                        <img src={champ.image} alt='champ image' className='p-1' />
                                                        <table className='text-right'>
                                                            <tbody>
                                                                <TintRow title={'cs'} tint={styles.stat.cs} data={champ.cs} />
                                                                <TintRow title={'cs/min'} tint={styles.stat.cs} data={champ.csmin} />
                                                                <TintRow
                                                                    title={<i className='bi bi-currency-exchange'></i>}
                                                                    tint={'text-yellow-500'}
                                                                    data={champ.gold}
                                                                />
                                                                <TintRow
                                                                    title={'Max Kills'}
                                                                    tint={styles.stat.kills}
                                                                    data={champ.max_kills}
                                                                />
                                                                <TintRow
                                                                    title={'Max Deaths'}
                                                                    tint={styles.stat.deaths}
                                                                    data={champ.max_deaths}
                                                                />
                                                                <TintRow
                                                                    title={'Damage'}
                                                                    tint={styles.stat.kills}
                                                                    data={champ.avg_damage_dealt}
                                                                />
                                                                <TintRow
                                                                    title={<i className='bi bi-shield-shaded'></i>}
                                                                    tint={'text-green-500'}
                                                                    data={champ.avg_damage_taken}
                                                                />
                                                                <TintRow
                                                                    title={'x 2'}
                                                                    tint={styles.stat.assists}
                                                                    data={champ.double_kills}
                                                                />
                                                                <TintRow title={'x 3'} tint={styles.stat.games} data={champ.triple_kills} />
                                                                <TintRow
                                                                    title={'x 4'}
                                                                    tint={styles.stat.winrate}
                                                                    data={champ.quadra_kills}
                                                                />
                                                                <TintRow title={'x 5'} tint={styles.stat.kda} data={champ.penta_kills} />
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Popover.Panel>
                                            </Popover>
                                        </td>
                                        <td>
                                            <span className={tint(champ.games, 'games')}>{champ.games}</span> (
                                            <span className={tint(champ.winrate, 'winrate')}>{champ.winrate}%</span>)
                                        </td>
                                        <td>
                                            <span className={tint(champ.kda, 'kda')}>{champ.kda}</span>
                                        </td>
                                        <td>
                                            <span className={tint(champ.kills, 'kills')}>{champ.kills}</span>
                                        </td>
                                        <td>
                                            <span className={tint(champ.deaths, 'deaths')}>{champ.deaths}</span>
                                        </td>
                                        <td>
                                            <span className={tint(champ.assists, 'assists')}>{champ.assists}</span>
                                        </td>
                                        <td>
                                            <span className={tint(champ.csmin, 'csmin')}>{champ.csmin}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </Container>
    )
}

// ┌────────────────────────────────────────────────────────────
// │ Highlights each table cell based on the stat requirements
// └────────────────────────────────────────────────────────────
const tint = (num: number, type: string) => {
    const tints = {
        games: (x: number) => (x >= 50 ? 'bg-green-200 dark:bg-green-700' : ''),
        winrate: (x: number) => (x >= 55 ? 'bg-sky-200 dark:bg-sky-700' : ''),
        kda: (x: number) => (x >= 3 ? 'bg-purple-200 dark:bg-purple-700 p-1' : ''),
        kills: (x: number) => (x >= 10 ? 'bg-red-200 dark:bg-red-700 p-1' : ''),
        deaths: (x: number) => (x <= 5 ? 'bg-zinc-300 dark:bg-zinc-400 p-1' : ''),
        assists: (x: number) => (x >= 10 ? 'bg-pink-200 dark:bg-pink-700 p-1' : ''),
        csmin: (x: number) => (x >= 7 ? 'bg-yellow-200 dark:bg-yellow-700 p-1' : ''),
    }
    return tints[type]?.(num) ?? ''
}

// ┌──────────────────────────────────
// │ Returns a row of a table <tr>
// └──────────────────────────────────
const TintRow = ({ tint, title, data }: { tint: string; title: any; data: number }) => (
    <tr>
        <td className='p-1'>
            <span className={tint}>{title}</span>
        </td>
        <td>{data.toLocaleString('en-US')}</td>
    </tr>
)
