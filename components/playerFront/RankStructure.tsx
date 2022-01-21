import { PlayerImg, Rank } from 'components'

const RankStructure = ({ player }) => (
    <div className='flex items-center justify-center gap-4'>
        <div className='flex flex-col items-center justify-center overflow-hidden'>
			{/* TODO: the img doen't seems to be rounded ;/ (bug/error) */}
            <PlayerImg image={player.image} alias={player.alias} level={player.level} />
            <h2 className='text-xl mt-2'>{player.alias && player.alias}</h2>
        </div>
        {player.rank && player.rank.solo && <Rank title={'Solo/Duo'} rankdata={player.rank.solo} />}
        {player.rank && player.rank.flex && <Rank title={'Flex'} rankdata={player.rank.flex} />}
    </div>
)

export default RankStructure
