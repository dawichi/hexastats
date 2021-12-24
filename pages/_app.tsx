/* eslint-disable @next/next/no-sync-scripts */
import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Navbar } from '../components'
import { styles } from '../styles/styles.config'
import 'tailwindcss/tailwind.css'
import '../styles/global.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
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

            <main className={`pb-20 dark:text-white ${styles.background}`}>
                <Component {...pageProps} />
            </main>

            <footer className='bg-zinc-800 text-white p-3'>
                <div className='container m-auto flex justify-between'>
                    <span>
                        &copy;
                        <a
                            className='text-indigo-400 font-bold tracking-wider'
                            href='https://github.com/dawichi/hexastats'
                            target='_blank'
                            rel='noreferrer'
                        >
                            Hexastats
                        </a>{' '}
                        no se hace responsable de ninguna depresión causada por este golpe de realidad.
                    </span>
                    <a
                        href='https://github.com/dawichi'
                        target='_blank'
                        className='text-white text-2xl hover:text-purple-400'
                        rel='noreferrer'
                    >
                        다 위 치
                    </a>
                </div>
            </footer>
        </>
    )
}
