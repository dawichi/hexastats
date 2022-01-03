import React from 'react'

const PlayerImg = ({ image, name, level }: { image: string; name: string; level: number }) => (
    <div className='relative flex flex-col items-center text-sm text-white'>
        <img className='m-3 w-14 rounded' src={image} alt={name} />
        <span className='px-1 absolute bottom-0 bg-zinc-700 border border-yellow-500 rounded-full'>{level}</span>
    </div>
)

export default PlayerImg
