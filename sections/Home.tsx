/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Champ, Player } from '../interfaces/interfaces'

// ┌────────────────┐
// │ HOME PAGE:     │
// └────────────────┘
// Home page, visualize each player in a table
// Each row of the table is a champ with his stats
const Home = ({data}) => {
	
	// Highlights each table cell based on the stat requirements
	const tint = (num: number, type: string) => {
		const tints = {
			games:   (x: number) => x >= 50 ? 'font-bold p-1' : '',
			winrate: (x: number) => x >= 55 ? 'bg-green-200' : '',
			kda:     (x: number) => x >= 3 ? 'bg-purple-200 p-1' : '',
			kills:   (x: number) => x >= 10 ? 'bg-red-200 p-1' : '',
			deaths:  (x: number) => x <= 5 ? 'bg-gray-300 p-1' : '',
			assists: (x: number) => x >= 10 ? 'bg-pink-200 p-1' : '',
			cs:      (x: number) => x >= 200 ? 'bg-yellow-200 p-1' : '',
		}
		return tints[type]?.(num) ?? ''
	}

	return (
		<div className="container m-auto py-8 lg:py-16">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
				{/* For each player, print a table and its table-head */}
				{data.map((player: Player, index_player) => {
					return (
						<div key={index_player} className="flex flex-col">
							<div className="flex items-center">
								<img className="m-3 w-14 rounded" src={player.image} alt={player.name} />
								<h2 className="text-2xl">{player.name} ({player.alias})</h2>
							</div>
							<table className="table-auto m-3 text-center border bg-gray-100">
								<thead>
									<tr>
										<th className="py-1 px-2 bg-gray-300"><span>Champ</span></th>
										<th className="py-1 px-2 bg-green-300"><span>Games</span></th>
										<th className="py-1 px-2 bg-purple-300"><span>KDA</span></th>
										<th className="py-1 px-2 bg-red-300"><span>K</span></th>
										<th className="py-1 px-2 bg-gray-400"><span>D</span></th>
										<th className="py-1 px-2 bg-pink-300"><span>A</span></th>
										<th className="py-1 px-2 bg-yellow-300"><span>CS</span></th>
									</tr>
								</thead>
								<tbody>
									{/* For each champ inside a player, print a row with the data */}
									{player.champs.map((champ: Champ, index_champ) => {
										return (
											<tr key={index_champ} className="border">
												<td><img src={champ.image} alt="champ image" style={{maxWidth: '60px', margin: 'auto'}} /></td>
												<td>
													<span className={tint(champ.games, 'games')}>{champ.games}</span>{' '}
													(<span className={tint(champ.winrate, 'winrate')}>{champ.winrate}%</span>)
												</td>
												<td><span className={tint(champ.kda, 'kda')}>{champ.kda}</span></td>
												<td><span className={tint(champ.kills, 'kills')}>{champ.kills}</span></td>
												<td><span className={tint(champ.deaths, 'deaths')}>{champ.deaths}</span></td>
												<td><span className={tint(champ.assists, 'assists')}>{champ.assists}</span></td>
												<td><span className={tint(champ.cs, 'cs')}>{champ.cs}</span></td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Home