/* eslint-disable @next/next/no-img-element */
import React from 'react'
import axios from 'axios'
import { Popover } from '@headlessui/react'
import { Champ, Player } from '../interfaces/interfaces'
import { styles } from '../styles/styles.config'
import { backend, players } from '../config'
import { getStats, Rank } from '../utils'

// ┌────────────────┐
// │ MULTIPLE PAGE: │
// └────────────────┘
// Home page, visualize each player in a table
// Each row of the table is a champ with his stats
export default function Multiple(props: { data: Player[] }) {

	const structure = (title: string, stat: string) => (
		<div className='p-2'>
			<h2 className='text-2xl text-center mt-10 mb-5'>{title}</h2>
			<hr />
			{props.data.map((player, idx) => {
				let games = 0
				let stat_value = 0
		
				player.champs.map((champ, idx) => {
					games += champ.games
					stat_value += champ[stat]
				})
		
				const result = parseFloat((stat_value / games).toFixed(2))

				const width = result * 100 / 2

				return (
					<div key={idx}>
						<div className='grid grid-cols-2 lg:grid-cols-3'>
							<div className='flex items-center justify-start'>
								<img className='m-2 w-14 rounded' src={player.image} alt={player.name} />
								<div>
									<p>{player.name}</p>
									<p>({player.alias})</p>
								</div>
							</div>
							{ result != 0 && 
								<div className='lg:col-span-2 flex flex-col justify-center items-start'>
									<span>{result}</span>
									<div className='h-3 rounded w-full bg-zinc-400/50'>
										<div className='h-3 rounded bg-red-200' style={{width: width + '%'}}></div>
									</div>
								</div>
							}
						</div>
					</div>
				)}
			)}
		</div>
	)

    return (
        <div className='animate__animated animate__fadeIn'>
			<div className='container mx-auto py-5'>
				<h1 className='text-center text-4xl mt-10'>Muiltiple kills</h1>
				<p className='text-center'>How many multiple kills you make each game?</p>
				<div className='grid gap-4 lg:grid-cols-2'>
					{structure('Doble kills', 'double_kills')}
					{structure('Triple kills', 'triple_kills')}
					{structure('Quadra kills', 'quadra_kills')}
					{structure('Penta kills', 'penta_kills')}
				</div>
			</div>
        </div>
    )
}

// Fetch data from euw.op.gg with getStaticProps()'s NextJS function
export const getStaticProps = async () => {
    const data: Player[] = []
    for (let idx = 0; idx < players.length; idx++) {
        let player_response = await axios.get(backend + players[idx])
        data.push(player_response.data)
    }

    return {
        props: { data: data },
    }
}
