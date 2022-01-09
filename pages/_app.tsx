import React, { useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ListPlayers, Navbar } from '../components'
import { styles } from '../styles/styles.config'
import { PlayersContext } from '../hooks/PlayersContext'
import 'tailwindcss/tailwind.css'
import '../styles/global.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
    // Context of the app
    const [players, setPlayers] = useState()

    return (
        <>
            <Head>
                <title>Hexastats</title>
                <link rel='icon' href='/favicon.ico' />
                <meta name='description' content='Hexastats - our custom graphs' />
                {/* Bootstrap Icons */}
                <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css' />
                {/* Animate CSS */}
                <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' />
            </Head>

            <header style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <Navbar />
            </header>

            <main className={`pb-20 dark:text-white min-h-screen ${styles.background}`}>
                <PlayersContext.Provider value={{ players, setPlayers }}>
                    <ListPlayers />
                    <Component {...pageProps} />
                </PlayersContext.Provider>
            </main>

            <footer className='bg-zinc-800 text-white p-3'>
                <div className='container m-auto'>
                    <a
                        href='https://github.com/dawichi'
                        target='_blank'
                        className='text-white hover:text-indigo-400'
                        rel='noreferrer'
                    >
                        다 위 치
                    </a>
                    <br/>
                    <br/>
					<p>
						<span>&copy; {new Date().getFullYear().toString()}{' '}</span>
						<a
                            className='text-indigo-400 font-bold tracking-wider'
                            href='https://github.com/dawichi/hexastats'
                            target='_blank'
                            rel='noreferrer'
                        >
                            Hexastats
                        </a>{' '}
						isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
					</p>
                </div>
            </footer>
        </>
    )
}
