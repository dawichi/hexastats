import { useContext, useState } from 'react'
import { statTitle, getStats, parse_k_num } from 'utils'
import { Container, EmptyPlayers, PlayerImg, RankStructure, CompareChart } from 'components'
import { styles } from 'styles/styles.config'
import { PlayersContext } from 'hooks/PlayersContext'
import { Player } from 'interfaces/player'

// ┌────────────────┐
// │ Compare PAGE:  │
// └────────────────┘
// Allows to select 2 players and compares its stats
export default function Compare() {
    const { players } = useContext(PlayersContext)

    const containerProps = {
        title: 'Compare',
        description: 'Select two players to compare stats',
    }

    // Players selected for compare
    const [left, setLeft] = useState(0)
    const [right, setRight] = useState(0)

    if (!players || players.length === 0) {
        return (
            <Container {...containerProps}>
                <EmptyPlayers />
            </Container>
        )
    }

    // When a player card is selected
    const handleSelect = (idx: number) => {
        if (idx + 1 === left) {
            setLeft(0)
        } else if (idx + 1 === right) {
            setRight(0)
        } else {
            if (!left) setLeft(idx + 1)
            else if (!right) setRight(idx + 1)
            else if (idx + 1 != left && idx + 1 != right) setRight(idx + 1)
        }
    }

    // Styles
    const tintPlayerSelected = (idx: number) => {
        if (idx + 1 === left) return 'bg-blue-400'
        else if (idx + 1 === right) return 'bg-red-400' // right
        return 'bg-zinc-100 dark:bg-zinc-800' // unselected
    }

    // Sort players by ELO
    players.forEach(player => (player.rank.rank_p = player.rank.rank_p ? player.rank.rank_p : 100))
    players.sort((a, b) => a.rank.rank_p - b.rank.rank_p)

    const stats = {
        0: [
            'winrate',
            'kda',
            'kills',
            'deaths',
            'assists',
            'cs',
            'csmin',
            'gold',
            'max_kills',
            'max_deaths',
            'avg_damage_dealt',
            'avg_damage_taken',
        ],
        1: ['games', 'double_kills', 'triple_kills', 'quadra_kills', 'penta_kills'],
    }

    const calcWidth = (x: number, y: number, direction: boolean) => (direction ? (100 * y) / (y + x) : (100 * x) / (x + y))

    const ListProgressBar = ({ statGroup }: { statGroup: number }) => {
        let total = 0
        return (
            <>
                <h2 className={`text-center text-lg ml-32 ${statGroup ? 'mt-10' : 'mt-5'}`}>{statGroup ? 'Other stats' : 'VS'}</h2>
                {stats[statGroup].map((stat: string, idx: number) => {
                    const l_value = getStats(players[left - 1])[stat]
                    const r_value = getStats(players[right - 1])[stat]
                    const activated = getStats(players[left - 1])[stat] || getStats(players[right - 1])[stat]
                    const inverse = stat == 'deaths'
                    if (activated && !statGroup) total += calcWidth(l_value, r_value, inverse)
                    return (
                        <div key={idx}>
                            <div className='flex justify-end items-end m-1 text-white text-center'>
                                <span className='mx-2 text-black dark:text-white'>{statTitle(stat)}</span>

                                <div className='w-48 sm:w-96'>
                                    <div className='relative h-px text-sm'>
                                        <div className='absolute left-2 top-0'>{parse_k_num(l_value, 2, true)}</div>

                                        <div className='absolute sm:translate-x-20 top-0 invisible sm:visible'>
                                            {!activated ? '0.00 %' : '' + calcWidth(l_value, r_value, inverse).toFixed(2) + '%'}
                                        </div>

                                        <div className='-translate-y-2 text-2xl'>|</div>

                                        <div className='-translate-y-8 sm:translate-x-20 top-0 invisible sm:visible'>
                                            {!activated ? '0.00 %' : '' + (100 - calcWidth(l_value, r_value, inverse)).toFixed(2) + '% '}
                                        </div>

                                        <div className='absolute right-2 top-0'>{parse_k_num(r_value, 2, true)}</div>
                                    </div>

                                    {activated ? (
                                        <div className='bg-red-400 dark:bg-red-400/75 rounded h-5'>
                                            <div
                                                className='bg-blue-500 dark:bg-blue-500/75 rounded-tl rounded-bl h-5'
                                                style={{ width: `${calcWidth(l_value, r_value, inverse)}%` }}
                                            ></div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {statGroup === 0 && (
                    <>
                        <hr />
                        <div className='flex justify-end items-end m-1'>
                            <span className='mx-2'>Total </span>
                            <div className='w-48 sm:w-96'>
                                <div className='relative h-px text-center text-white text-sm'>
                                    <div className='absolute sm:translate-x-20 top-0'>{(total / stats[0].length).toFixed(2)} %</div>
                                    <div className='-translate-y-2 text-2xl'>|</div>
                                    <div className='-translate-y-8 sm:translate-x-20 top-0'>
                                        {(100 - total / stats[0].length).toFixed(2) + '%'}
                                    </div>
                                </div>
                                <div className='bg-red-400 dark:bg-red-400/75 rounded h-5'>
                                    <div
                                        className='bg-blue-500 dark:bg-blue-500/75 rounded-tl rounded-bl h-5'
                                        style={{
                                            width: `${calcWidth(total / stats[0].length, 100 - total / stats[0].length, false)}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </>
        )
    }

    return (
        <Container {...containerProps}>
            <div className='flex justify-center items-center'>
                <div className='mt4 text-white grid grid-cols-3 md:grid-cols-6 gap-y-2'>
                    {sections.map((section, index) => (
                        <span key={index} className={`mx-1 px-3 py-1 rounded ${section.bannerColor}`}>
                            {section.title}
                        </span>
                    ))}
                </div>
            </div>

            <div className='container mx-auto p-4'>
                <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                    {players.map((player: Player, idx) => (
                        <div
                            key={idx}
                            className={`p-2 cursor-pointer ${styles.card} ${tintPlayerSelected(idx)}`}
                            onClick={() => handleSelect(idx)}
                        >
                            <div className='flex items-center justify-around'>
                                <PlayerImg image={player.image} alias={player.alias} level={player.level} />
                                <div className='flex flex-col'>
                                    <h2 className='text-xl'>
                                        {idx + 1}. {player.alias}
                                    </h2>
                                </div>
                            </div>
                            <div className='mt-2 flex justify-between'>
                                <span>{player.rank.rank_n.toLocaleString('es-ES')}º</span>
                                <span>{player.rank.rank_p.toFixed(1)} %</span>
                            </div>
                            <div className={`rounded-xl h-2 ${tint_sections(player.rank.rank_p, false)}`}>
                                <div
                                    className={`rounded-xl h-2 bg-gradient-to-r ${tint_sections(player.rank.rank_p, true)}`}
                                    style={{ width: 100 - player.rank.rank_p + '%' }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <h2 className='text-center text-2xl m-4'>Player VS Player</h2>
            <hr className='w-4/5 mx-auto' />

            <div className='container mx-auto p-4 grid gap-4 md:grid-cols-2'>
                {/* If at least 1 player selected ==> show 'clear' button */}
                {(left != 0 || right != 0) && (
                    <div className='md:col-span-2'>
                        <button
                            className='bg-red-500 rounded text-white shadow py-2 px-3 mx-auto'
                            onClick={() => {
                                setLeft(0)
                                setRight(0)
                            }}
                        >
                            <i className='bi bi-x-lg'></i> Clear selection
                        </button>
                    </div>
                )}
                <div className='bg-blue-400/25 rounded shadow'>{left ? <RankStructure player={players[left - 1]} /> : ''}</div>
                <div className='bg-red-400/25 rounded shadow'>{right ? <RankStructure player={players[right - 1]} /> : ''}</div>
            </div>

            {/* If no players selected in any side ==> alert message explaining */}
            {left === 0 && right === 0 && (
                <div className='w-96 mx-auto'>
                    <div className='bg-sky-100 bg-sky-400/50 border-l-4 border-sky-500 text-sky-800 dark:text-white p-4'>
                        <p className='font-bold'>No players selected</p>
                        <p>Select 2 players above to start comparing stats!</p>
                    </div>
                </div>
            )}

            {/* If 2 players selected ==> compare them! */}
            {left != 0 && right != 0 && (
                <div className='container grid gap-4 xl:grid-cols-2 mx-auto text-xs md:text-base'>
                    <div className='flex flex-col mx-auto'>
                        <ListProgressBar statGroup={0} />
                        <ListProgressBar statGroup={1} />
                    </div>
                    <CompareChart playerA={players[left - 1]} playerB={players[right - 1]} />
                </div>
            )}
        </Container>
    )
}

const sections = [
    {
        title: 'Top 10🔥 %',
        percent: 10,
        bannerColor: 'bg-indigo-500 dark:bg-indigo-600/75',
        frontColor: 'from-indigo-800 to-indigo-500',
        backColor: 'bg-indigo-300/50 dark:bg-indigo-700/25',
    },
    {
        title: 'Top 20 %',
        percent: 20,
        bannerColor: 'bg-blue-500 dark:bg-blue-600/75',
        frontColor: 'from-blue-800 to-blue-500',
        backColor: 'bg-blue-300/50 dark:bg-blue-700/25',
    },
    {
        title: 'Top 35 %',
        percent: 35,
        bannerColor: 'bg-green-500 dark:bg-green-600/75',
        frontColor: 'from-green-800 to-green-500',
        backColor: 'bg-green-300/50 dark:bg-green-700/25',
    },
    {
        title: 'Top 50 %',
        percent: 50,
        bannerColor: 'bg-yellow-500 dark:bg-yellow-600/75',
        frontColor: 'from-yellow-800 to-yellow-500',
        backColor: 'bg-yellow-300/50 dark:bg-yellow-700/25',
    },
    {
        title: 'Below 50 %',
        percent: 65,
        bannerColor: 'bg-gray-500 dark:bg-gray-600/75',
        frontColor: 'from-gray-800 to-gray-500',
        backColor: 'bg-gray-300/50 dark:bg-gray-700/25',
    },
    {
        title: 'Below 35 %',
        percent: 100,
        bannerColor: 'bg-red-500 dark:bg-red-600/75',
        frontColor: 'from-red-800 to-red-500',
        backColor: 'bg-red-300/50 dark:bg-red-700/25',
    },
]

const tint_sections = (percent: number, front: boolean) => {
    const result = sections.find(section => percent <= section.percent)
    return front ? result.frontColor : result.backColor
}
