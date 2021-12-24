import React from 'react'

// Rank structure
const Rank = ({ title, rank, image, lp, win, lose, winrate }) => (
    <div className='text-center text-sm'>
        <h3>{title}</h3>
        <h4>
            {rank} ({lp})
        </h4>
        <img className='m-auto w-14 rounded' src={image} alt={'Rank image'} />
        <p>
            <span className='rounded px-1 text-white bg-green-600'>{win}</span>
            <span>{' - '}</span>
            <span className='rounded px-1 text-white bg-red-600'>{lose}</span>
        </p>
        <p>{winrate}%</p>
    </div>
)

export default Rank
