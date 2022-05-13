import { Player } from 'interfaces/player'
import RankStructure from './RankStructure'

export default function SummonerPage({ player }: { player: Player }) {
    const a = 5

    return (
        <div className='relative' style={{
            backgroundImage: `url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${player.masteries[0].name}_0.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <section className='bg-orange-50/80 dark:bg-zinc-900/80 flex opacity-100'>
                <header className='m-5'>
                    <RankStructure player={player} />
                    <RankStructure player={player} />
                    <RankStructure player={player} />
                    <RankStructure player={player} />
                    <RankStructure player={player} />
                </header>
            </section>
        </div>
    )
}

