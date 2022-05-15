import { Game } from 'interfaces/Game'
import { Player } from 'interfaces/Player'
import Image from 'next/image'
import { RiotService } from 'services'
import { styles } from 'styles/styles.config'
import RankStructure from './RankStructure'

const StatsGrid = ({ stats }) => (
    <div>
        holi
    </div>
)


export default function SummonerPage({ player }: { player: Player }) {
    const riotService = new RiotService()

    const ItemsGrid = ({ items }) => (
        <div className='grid grid-cols-3 gap-2'>
            {Object.keys(items).map(itemId => {
                if (itemId !== '6') {
                    return <span key={itemId}>
                        { items[itemId]
                            ? (
                                <Image className='rounded' src={items[itemId]} alt='item' width={40} height={40} />
                            ) : (
                                <div className='bg-gradient-to-br from-zinc-500 to-zinc-800 rounded' style={{width: '40px', height: '40px'}} />
                            )
                        }
                    </span>
                }
            })}
        </div>
    )

    const SummonersGrid = ({ game }: {game: Game}) => (
        <div className='grid grid-cols-2 p-2'>
            {game.participants.map((participant, idx) => (
                <span key={idx} className='flex items-center'>
                    <Image className='rounded' src={riotService.champImage(participant.champ.championName)} alt='champion' width={30} height={30} />
                    <span className='ml-1 text-sm w-20 h-5 overflow-hidden' style={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}>
                        {participant.summonerName}
                    </span>
                </span>
            ))}
        </div>
    )

    return (
        <div
            className='relative rounded-lg shadow'
            style={{
                backgroundImage: `url(${riotService.champSplash(player.masteries[0].name)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <section className='bg-orange-50/80 dark:bg-zinc-900/80 opacity-100'>
                <header className='pt-5'>
                    <RankStructure player={player} />
                </header>
                <div className='grid grid-cols-2 pb-12'>
                    {player.games.map((game, idx: number) => {
                        const gameMinutes = (game.gameDuration / 60).toFixed(0)
                        const gameSeconds = game.gameDuration % 60
                        const { teamPosition, win, items, champ, kda } = game.participants[game.participantNumber]
                        const { championName, champLevel } = champ
                        const { kills, deaths, assists } = kda
                        const calc_kda = deaths ? ((kills + assists) / deaths).toFixed(1) : kills + assists

                        return (
                            <div key={idx} className={`${styles.shadow} ${styles.background} border-8 border-y-0 border-r-0 rounded-lg mx-4 my-2 h-26 grid grid-cols-3 ${win ? 'border-green-500' : 'border-red-500'}`}>
                                <div className='relative text-white'>
                                    <div
                                        className='absolute t-0 l-0 w-full h-full'
                                        style={{
                                            backgroundImage: `url(${riotService.champSplash(championName)})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    ></div>
                                    <div
                                        className='absolute t-0 l-0 w-full h-full'
                                        style={{ backgroundImage: 'linear-gradient(to right, #000000bd , #ffffff00)' }}
                                    ></div>
                                    <div className='absolute top-2 left-3'>
                                        <Image src={riotService.teamPositionIcon(teamPosition)} alt='champ image' width={50} height={50} />
                                    </div>
                                    <span className='absolute top-4 left-16 text-xl text-center'>{champLevel}</span>
                                    <span className='absolute bottom-1 left-2'>{game.gameMode}</span>
                                    <span className='absolute bottom-1 right-2'>{gameMinutes}:{gameSeconds}</span>
                                </div>
                                <div className='relative flex flex-col items-center'>
                                    <div className='absolute top-1 bottom-1 left-1'>
                                        <div className='flex flex-col h-full justify-between'>
                                            <Image className='rounded' src={String(game.participants[game.participantNumber].spells[1])} alt='spell 2' width={38} height={38} />
                                            <Image className='rounded' src={String(game.participants[game.participantNumber].spells[0])} alt='spell 1' width={38} height={38} />
                                            <Image className='rounded' src={String(game.participants[game.participantNumber].items[6])} alt='guard' width={38} height={38} />
                                        </div>
                                    </div>
                                    <p className='text-xl text-center'>{kills} / {deaths} / {assists} - {calc_kda}</p>
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
                </div>
            </section>
        </div>
    )
}