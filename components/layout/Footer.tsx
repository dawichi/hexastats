import Link from 'next/link'
import React from 'react'

const Footer = () => (
    <footer className='bg-zinc-800 text-white p-3'>
        <div className='container m-auto'>
            <div className='flex items-center mb-5'>
                <a href='https://github.com/dawichi' target='_blank' className='hover:text-indigo-400 text-xl' rel='noreferrer'>
                    다 위 치
                </a>
                <i className='bi bi-suit-diamond-fill mx-5 text-sm'></i>
                <Link href='/about'>
                    <button className='p-1 hover:text-indigo-400'>About us</button>
                </Link>
                <i className='bi bi-suit-diamond-fill mx-5 text-sm'></i>
                <Link href='/about'>
                    <button className='p-1 hover:text-indigo-400'>Contribute</button>
                </Link>
            </div>
            <p>
                <span>&copy; {new Date().getFullYear().toString()} </span>
                <a
                    className='text-indigo-400 font-bold tracking-wider'
                    href='https://github.com/dawichi/hexastats'
                    target='_blank'
                    rel='noreferrer'
                >
                    Hexastats
                </a>{' '}
                isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in
                producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot
                Games, Inc. League of Legends © Riot Games, Inc.
            </p>
        </div>
    </footer>
)

export default Footer
