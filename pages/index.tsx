import React from 'react'
import { AddedPlayers, AddPlayer } from '../components'

// ┌────────────────┐
// │ INDEX PAGE:    │
// └────────────────┘
// Welcome page, add new players to the context
export default function Index() {
    return (
        <div className='animate__animated animate__fadeIn min-h-screen container m-auto py-8 lg:py-16'>
            <div className='text-center'>
                <h1 className='text-4xl mt-10 mb-5'>Welcome to hexastats</h1>

                <hr className='md:w-1/2 mx-auto' />

                <div className='my-6'>
                    <p>A data visualization webapp for League of Legends !</p>
                    <p>Search players from multiple servers and start comparing them !</p>
                </div>

                <p>
                    First of all, <br />
                    add the players you would like to compare here <br />
                    (recommended 3 at least)
                </p>
            </div>

            <AddPlayer />

            <AddedPlayers />

            <div className='mt-10 md:w-1/2 mx-auto'>
                <img src='/images/programming.svg' className='w-full opacity-80 px-10' />
            </div>
        </div>
    )
}
