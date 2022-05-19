import { Player } from 'interfaces/Player'
import { ChampService, RiotService } from 'services'
import { styles } from 'styles/styles.config'
import RankStructure from '../RankStructure'
import ChampsList from './ChampsList'
import GamesList from './GamesList'

export default function SummonerPage({ player }: { player: Player }) {
    const riotService = new RiotService()

    const champService = new ChampService()

    const champs = champService.champsBuilder(player.games)

    return (
        <div
            className='relative rounded-lg shadow'
            style={{
                backgroundImage: `url(${riotService.champSplash(player.masteries[0].name)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <section className='bg-orange-50/80 dark:bg-zinc-900/80 pb-12'>
                <header className='py-5'>
                    <RankStructure player={player} />
                </header>

                <div className='grid grid-cols-3'>
                    <div className={`${styles.background} border rounded border-red-600 m-2`}>
                        <h2 className='text-center text-xl my-3'>Champions</h2>
                        <hr/>
                        <ChampsList champs={champs} />
                    </div>
                    <div className='col-span-2'>
                        <GamesList player={player} />
                    </div>
                </div>
            </section>
        </div>
    )
}
