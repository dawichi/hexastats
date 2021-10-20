/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Table } from 'react-bootstrap'

const Home = ({data}) => {

	const tint = (num: number, type: string) => {
		const tints = {
			games:   (x: number) => x > 50 ? 'font-bold p-1' : '',
			winrate: (x: number) => x > 55 ? 'bg-green-200' : '',
			kda:     (x: number) => x > 2.5 ? 'bg-purple-200 p-1' : '',
			kills:   (x: number) => x > 10 ? 'bg-red-200 p-1' : '',
			deaths:  (x: number) => x < 5 ? 'bg-gray-200 p-1' : '',
			asissts: (x: number) => x > 10 ? 'bg-pink-200 p-1' : '',
			cs:      (x: number) => x > 250 ? 'bg-yellow-200 p-1' : '',
		}
		return tints[type]?.(num) ?? ''
	}

	return (
		<div className="container py-5">
			<div className="row">
				{data.map((player, index_player) => {
					console.log(player)
					return (
						<div key={index_player} className="col-lg-6 col-xl-4">
							<h2 className="text-2xl">{player.name} ({player.alias})</h2>
							<Table striped bordered hover responsive>
								<thead>
									<tr>
										<th><span>Champ</span></th>
										<th><span className="bg-green-300 py-1 px-2">Games</span></th>
										<th><span className="bg-purple-300 py-1 px-2">KDA</span></th>
										<th><span className="bg-red-300 py-1 px-2">K</span></th>
										<th><span className="bg-gray-400 py-1 px-2">D</span></th>
										<th><span className="bg-pink-300 py-1 px-2">A</span></th>
										<th><span className="bg-yellow-300 py-1 px-2">CS</span></th>
									</tr>
								</thead>
								<tbody>
									{player.champs.map((champ, index_champ) => {
										return (
											<tr key={index_champ}>
												<td><img src={champ.image} alt="champ image" style={{maxWidth: '60px'}} /></td>
												<td>
													<span className={tint(champ.games, 'games')}>{champ.games}</span>{' '}
													(<span className={tint(champ.winrate, 'winrate')}>{champ.winrate}%</span>)
												</td>
												<td><span className={tint(champ.kda, 'kda')}>{champ.kda}</span></td>
												<td><span className={tint(champ.kills, 'kills')}>{champ.kills}</span></td>
												<td><span className={tint(champ.deaths, 'deaths')}>{champ.deaths}</span></td>
												<td><span className={tint(champ.asissts, 'asissts')}>{champ.asissts}</span></td>
												<td><span className={tint(champ.cs, 'cs')}>{champ.cs}</span></td>
											</tr>
										)
									})}
								</tbody>
							</Table>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Home
