import { PlayerImg } from 'components'
import { RankDto, SummonerDto } from 'interfaces'
import Image from 'next/image'


/**
 * ## Displays the rank of a league from a player
 * The rank is displayed in a circle over the image of the player
 * @param param0 
 * @returns 
 */
const Rank = ({ title, rankdata }: { title: string; rankdata: RankDto }) => (
    <div className='text-center text-sm'>
        <h3>{title}</h3>
        <h4 className='text-xs'>
            {rankdata.rank} ({rankdata.lp})
        </h4>
        <div className='m-auto w-14 h-14 rounded relative'>
            <Image layout='fill' src={`/images/leagues/${rankdata.image}`} alt={'Rank image'} />
        </div>
        <p>
            <span className='rounded px-1 text-white bg-green-600'>{rankdata.win}</span>
            <span>{' - '}</span>
            <span className='rounded px-1 text-white bg-red-600'>{rankdata.lose}</span>
        </p>
        <p>{rankdata.winrate}%</p>
    </div>
)


/**
 * 
 * @param player the player to object to display
 * @returns 
 */
const RankStructure = ({ player }: { player: SummonerDto}) => (
    <div className='flex items-center justify-center gap-4'>
        <div className='flex flex-col items-center justify-center overflow-hidden'>
            <PlayerImg image={player.image} alias={player.alias} level={player.level} />
            <h2 className='text-xl mt-2'>{player.alias && player.alias}</h2>
        </div>
        {player.rank && player.rank.solo && <Rank title={'Solo/Duo'} rankdata={player.rank.solo} />}
        {player.rank && player.rank.flex && <Rank title={'Flex'} rankdata={player.rank.flex} />}
    </div>
)

export default RankStructure
