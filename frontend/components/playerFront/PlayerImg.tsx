import Image from 'next/image'

const PlayerImg = ({ image, alias, level }: { image: string; alias: string; level: number }) => (
    <div className='relative flex flex-col items-center text-sm text-white m-3 w-14 h-14 rounded'>
        <Image className='rounded-lg' src={image} layout='fill' alt={alias} />
        <span className='px-1 absolute -bottom-2 bg-zinc-700 border border-yellow-500 rounded-full'>{level}</span>
    </div>
)

export default PlayerImg
