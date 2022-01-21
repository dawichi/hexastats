import { Rank } from 'interfaces/player'

const Rank = ({ title, rankdata }: { title: string; rankdata: Rank }) => (
    <div className='text-center text-sm'>
        <h3>{title}</h3>
        <h4>
            {rankdata.rank} ({rankdata.lp})
        </h4>
		{/* TODO: convert to next/image  */}
        <img className='m-auto w-14 rounded' src={rankdata.image} alt={'Rank image'} />
        <p>
            <span className='rounded px-1 text-white bg-green-600'>{rankdata.win}</span>
            <span>{' - '}</span>
            <span className='rounded px-1 text-white bg-red-600'>{rankdata.lose}</span>
        </p>
        <p>{rankdata.winrate}%</p>
    </div>
)

export default Rank
