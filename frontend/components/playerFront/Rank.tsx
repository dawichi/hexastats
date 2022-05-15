import { Rank } from 'interfaces/Player'
import Image from 'next/image'

const Rank = ({ title, rankdata }: { title: string; rankdata: Rank }) => (
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

export default Rank
