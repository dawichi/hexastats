/* eslint-disable @next/next/no-sync-scripts */
import type { AppProps } from 'next/app'
import Head from 'next/head'
import 'tailwindcss/tailwind.css'
import '../styles/global.scss'


export default function MyApp({ Component, pageProps }: AppProps) {

	return (
		<>
			<Head>
				<title>Hexastats</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content='Hexastats - our custom graphs' />
				{/* Animate CSS */}
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
			</Head>

			<Component {...pageProps} />

			<footer className="bg-gray-800 text-white p-3 mt-20">
				<div className="container m-auto">
 					<span>&copy;Hexastats no se hace responsable de ninguna depresión causada por este golpe de realidad.</span>
				</div>
			</footer>
		</>
	)
}