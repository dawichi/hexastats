/* eslint-disable @next/next/no-sync-scripts */
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import 'tailwindcss/tailwind.css'
import '../styles/global.scss'


export default function MyApp({ Component, pageProps }: AppProps) {

	return (
		<>
			<Head>
				<title>Hexastats</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content='Hexastats - our custom graphs' />
				{/* Bootstrap & Icons */}
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossOrigin="anonymous"></link>
				<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossOrigin="anonymous"></script>
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
				{/* Animate CSS */}
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
			</Head>

			<header style={{position: 'sticky', top: 0}}>
				<Navbar />
			</header>

			<main>
				<Component {...pageProps} />
			</main>

			<footer className="bg-gray-800 text-white p-3 mt-20">
				<div className="container">
 					<span>&copy;Hexastats no se hace responsable de ninguna depresión causada por este golpe de realidad.</span>
				</div>
			</footer>
		</>
	)
}