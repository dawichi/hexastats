import { useContext, useState } from 'react'
import { PlayersContext } from 'hooks'
import Image from 'next/image'
import { RiotService, SummonerService } from 'services'
import { classNames } from 'utils'
import { GameDto, SummonerDto } from 'interfaces'
import { styles } from 'styles/styles.config'

/**
 * ## ItemsGrid component
 * Display a list of items in 3x2 grid
 *
 * @param props.items - Items list to display
 */
const ItemsGrid = ({ items }: { items: { [key: number]: string } }) => (
    <div className='grid grid-cols-3 gap-2'>
        {Object.keys(items).map(itemId => {
            if (itemId !== '6') {
                return (
                    <span key={itemId}>
                        {items[itemId] ? (
                            <Image className='rounded' src={items[itemId]} alt='item' width={36} height={36} />
                        ) : (
                            <div
                                className='bg-gradient-to-br from-zinc-500 to-zinc-800 rounded'
                                style={{ width: '36px', height: '36px' }}
                            />
                        )}
                    </span>
                )
            }
        })}
    </div>
)

/**
 * ## SummonerGrid component
 * Display a list of summoners who played in that game
 *
 * @param props.game - Game to display
 */
const SummonersGrid = ({ game }: { game: GameDto }) => {
    const riotService = new RiotService()

    return (
        <div className='columns-2 p-1'>
            {game.participants.map((participant, idx) => (
                <span key={idx} className='flex items-center'>
                    <Image
                        className='rounded'
                        src={riotService.champImage(participant.champ.championName)}
                        alt='champion'
                        width={24}
                        height={24}
                    />
                    <span
                        className='ml-1 text-sm w-20 h-5 overflow-hidden'
                        style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {participant.summonerName}
                    </span>
                </span>
            ))}
        </div>
    )
}

/**
 * ## GamesList component
 * Display a list of games from a summoner
 *
 * @param props.player - Player to display the games list from
 */
export default function GamesList({ player }: { player: SummonerDto }) {
    const { players, setPlayers } = useContext(PlayersContext)

    const riotService = new RiotService()
    const summonerService = new SummonerService(players, setPlayers)

    const [loadingGames, setLoadingGames] = useState(false)

    const loadMorePlayers = async () => {
        console.log(`Loading more games for ${player.alias}`)
        setLoadingGames(true)
        await summonerService.addGames(player.server, player.alias, player.games.length)
        setLoadingGames(false)
    }

    return (
        <>
            {player.games.map((game, idx: number) => {
                const gameMinutes = (game.gameDuration / 60).toFixed(0)
                const gameSeconds = game.gameDuration % 60
                const { teamPosition, win, items, champ, kda, spells } = game.participants[game.participantNumber]
                const { championName, champLevel } = champ
                const { kills, deaths, assists } = kda
                const calc_kda = deaths ? ((kills + assists) / deaths).toFixed(1) : kills + assists

                return (
                    <div
                        key={idx}
                        className={classNames(
                            `${styles.shadow} ${styles.background} ${styles.scale} ${win ? 'border-green-500' : 'border-red-500'}`,
                            'cursor-pointer border-8 border-y-0 border-r-0 rounded-lg mx-4 my-2 grid grid-cols-3',
                        )}
                    >
                        <div className='relative text-white'>
                            <div
                                className='absolute t-0 l-0 w-full h-full'
                                style={{
                                    backgroundImage: `url(${riotService.champSplash(championName)})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'top',
                                }}
                            ></div>
                            <div
                                className='absolute t-0 l-0 w-full h-full'
                                style={{ backgroundImage: 'linear-gradient(to top right, #000000bd , #ffffff00)' }}
                            ></div>
                            <div className='absolute top-2 left-3'>
                                <Image src={riotService.teamPositionIcon(teamPosition)} alt='champ image' width={40} height={40} />
                            </div>
                            <span className='absolute top-3 left-14 text-xl text-center'>{champLevel}</span>
                            <span className='absolute bottom-1 left-2'>{game.gameMode}</span>
                            <span className='absolute bottom-1 right-2'>
                                {gameMinutes}:{gameSeconds}
                            </span>
                        </div>
                        <div className='relative flex flex-col items-center text-center'>
                            <div className='absolute top-1 bottom-1 left-3'>
                                <div className='flex flex-col h-full justify-around'>
                                    <Image className='rounded' src={spells[1]} alt='spell 2' width={32} height={32} />
                                    <Image className='rounded' src={spells[0]} alt='spell 1' width={32} height={32} />
                                    <Image className='rounded' src={items[6]} alt='guard' width={32} height={32} />
                                </div>
                            </div>
                            <p>
                                <span>{kills} / {deaths} / {assists}</span>
                                <span className='text-sm ml-6'>{calc_kda} kda</span>
                                
                            </p>
                            <div className='mt-4 ml-4'>
                                <ItemsGrid items={items} />
                            </div>
                        </div>
                        <div>
                            <SummonersGrid game={game} />
                        </div>
                    </div>
                )
            })}

            <div className='flex justify-center'>
                <span
                    onClick={loadMorePlayers}
                    className={`${styles.card} ${styles.scale} bg-indigo-600 text-white cursor-pointer mx-4 my-2 p-3 px-6`}
                >
                    {loadingGames ? (
                        <div className='flex justify-center items-center'>
                            <i className='bi bi-arrow-clockwise animate-spin block '></i>
                            <span className='ml-3'>Loading...</span>
                        </div>
                    ):(
                        'Load more'
                    )}
                </span>
            </div>
        </>
    )
}
