import React from 'react'

// ┌────────────────┐
// │ INDEX PAGE:    │
// └────────────────┘
// Welcome page, basic landing with a image
export default function Index() {
    // TODO: Complete a little the landing page, no idea how or with what
    return (
        <div className='animate__animated animate__fadeIn min-h-screen container m-auto py-8 lg:py-16'>
            <h1 className='text-center text-4xl mt-10 mb-5'>Welcome to hexastats</h1>

            <div className='md:w-1/2 mx-auto'>
                <hr />
            </div>

            <div className='mt-10 md:w-1/2 mx-auto'>
                <img src='/programming.svg' className='w-full opacity-80 px-10' />
            </div>
        </div>
    )
}
