import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Footer, ListPlayers, Navbar } from 'components'
import { PlayersContext } from 'hooks/PlayersContext'
import { styles } from 'styles/styles.config'
import 'tailwindcss/tailwind.css'
import 'styles/global.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
    // Context of the app
    const [players, setPlayers] = useState([])

    useEffect(() => {
        // Check if there are players stored in memory
        const players_stored = localStorage.getItem('players')

        if (players_stored) {
            setPlayers(JSON.parse(players_stored))
        } else {
            // By default, set context to []
            setPlayers([])
        }
    }, [])

    return (
        <>
            <Head>
                <title>Hexastats</title>
                <link rel='icon' href='/favicon.ico' />
                <meta name='description' content='Hexastats - our custom graphs' />
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

            <Footer />
        </>
    )
}
