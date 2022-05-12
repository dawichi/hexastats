import { AddedPlayers, AddPlayer } from 'components'
import Image from 'next/image'
import ImgProgramming from 'public/images/programming.svg'

// ┌────────────────┐
// │ INDEX PAGE:    │
// └────────────────┘
// Welcome page, add new players to the context
export default function Index() {
    return (
        <div className='animate__animated animate__fadeIn min-h-screen container m-auto px-4 py-8 lg:py-16'>
            <div className='text-center'>
                <h1 className='text-4xl mt-10 mb-5'>Welcome to hexastats</h1>

                <hr className='md:w-1/2 mx-auto' />

                <div className='my-6'>
                    <p>A data visualization webapp for League of Legends !</p>
                    <p>Search players from multiple servers and start comparing them !</p>
                </div>
            </div>

            <AddPlayer />

            <AddedPlayers />

            <div className='relative mt-10 h-64 md:h-96 w-64 md:w-96 mx-auto opacity-80 px-10'>
                <Image src={ImgProgramming} layout='fill' alt='Programming' priority />
            </div>
        </div>
    )
}
