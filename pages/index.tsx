/* eslint-disable @next/next/no-img-element */
import Axios from "axios"
import { Context, useContext } from "react"
import Home from "../components/Home"
import getIndexOfString from "../utils/getIndexOfString"

const Index = (props: { data: any[] }) => {

	const colorspan = (kda: number) => {
		if (kda < 1.5) return 'bg-red-200'
		if (kda > 2.8) return 'bg-green-200'
		return ''
	}

	interface Player {
		name: string,
		alias: string,
		champs: Champs[]
	}

	interface Champs {
		name: string,
		image: string,
		games: number,
		winrate: number,
		kda: number,
		kills: number,
		deaths: number,
		asissts: number,
		cs: number,
	}

	const context: Player[] = []
	
	const pushPlayer =(name:string , alias:string , champs: any[]) => {
		context.push({
			name: name,
			alias: alias,
			champs: champs
		})
	}

	return (
		<>
			<Home data={context} />
			{
				props.data.map((player, index_player) => {
					const champs_indexes =	getIndexOfString('<div class="ChampionBox Ranked">', player.data, true)
					// Context
					const champs = []
					
					return (
						<>
							<div key={index_player} className="mx-5 hidden">
								<h2 className="text-3xl">{player.name}</h2>
								{/* <div className="relative inline-block text-left">
									<div>
										<button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
										Options{' '}<i className="bi bi-caret-down-fill"></i>
										</button>
									</div>
									<div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
										<div className="py-1" role="none">
										<a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-0">Account settings</a>
										<a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-1">Support</a>
										<a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-2">License</a>
										<form method="POST" action="#" role="none">
											<button type="submit" className="text-gray-700 block w-full text-left px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-3">
											Sign out
											</button>
										</form>
										</div>
									</div>
								</div> */}
								<div className="row">
									{ champs_indexes.map((x, index_champ) => {
										// SUB-STRINGS 
										const substr_name = player.data.slice(x+60, x+90)
										const substr_img = player.data.slice(x+100, x+300)
										const substr_cs = player.data.slice(x+450, x+700)
										const substr_kda = player.data.slice(x+520, x+1050)
										const substr_winrate = player.data.slice(x+1000, x+1200)

										// index helpers: [image]
										const idx_img = getIndexOfString('<img src="', substr_img, false)[0]+10
										const idx_img_end = getIndexOfString('.png', substr_img, false)[0]+4
										
										// index helpers: [CS]
										const idx_cs = getIndexOfString('CS', substr_cs, true)[2]
										const idx_cs_end = getIndexOfString('(', substr_cs.slice(idx_cs+3, idx_cs+20), false)[0]//+2

										// index helpers: [KDA]
										const idx_kda = getIndexOfString('<span class="KDA">', substr_kda, false)[0]+18
										const idx_kda_kills = getIndexOfString('<div class="KDAEach">', substr_kda, false)[0]+45
										const idx_kda_kills_end = getIndexOfString('<', substr_kda.slice(idx_kda_kills, idx_kda_kills+5), false)[0]
										const idx_kda_deaths = getIndexOfString('<span class="Death">', substr_kda, false)[0]+20
										const idx_kda_deaths_end = getIndexOfString('<', substr_kda.slice(idx_kda_deaths, idx_kda_deaths+5), false)[0]
										const idx_kda_assists = getIndexOfString('<span class="Assist">', substr_kda, false)[0]+21
										const idx_kda_assists_end = getIndexOfString('<', substr_kda.slice(idx_kda_assists, idx_kda_assists+5), false)[0]

										// index helpers: [winrate]
										const idx_winrate = getIndexOfString('%', substr_winrate, false)[0]-2

										champs.push({
											name: substr_name.slice(0, getIndexOfString('"', substr_name, false)[0]).replace("&#039;", "'"),
											image: 'https:' + substr_img.slice(idx_img, idx_img_end),
											games: substr_winrate.slice(idx_winrate+38, idx_winrate+40),
											winrate: substr_winrate.slice(idx_winrate, idx_winrate+2),
											kda: substr_kda.slice(idx_kda, idx_kda+4),
											kills: substr_kda.slice(idx_kda_kills, idx_kda_kills+idx_kda_kills_end),
											deaths: substr_kda.slice(idx_kda_deaths, idx_kda_deaths+idx_kda_deaths_end),
											asissts: substr_kda.slice(idx_kda_assists, idx_kda_assists+idx_kda_assists_end),
											cs: substr_cs.slice(idx_cs+3, idx_cs + idx_cs_end),
										})
										
										if (champs.length == 6) pushPlayer(player.name, player.alias, champs) 

										if (index_champ > 5) return null

										return (
											<div key={index_champ} className="col-6 col-md-4 col-xl-2">
												<div className="flex m-2">
													<div>
														<img className="w-100" src={'https:' + substr_img.slice(idx_img, idx_img_end)} alt="champ" />
														<span>{substr_name.slice(0, getIndexOfString('"', substr_name, false)[0]).replace("&#039;", "'")}</span>
													</div>
													<div className="ml-4 text-xl">
														<span>KDA:</span>
														<span
															className={'mx-2 px-2 rounded-xl shadow-sm border ' + colorspan(parseFloat(substr_kda.slice(idx_kda, idx_kda+4)))}
														>{substr_kda.slice(idx_kda, idx_kda+4)}</span>
														<br/>
														<span>{substr_kda.slice(idx_kda_kills, idx_kda_kills+idx_kda_kills_end)}</span>{' '}/{' '}
														<span>{substr_kda.slice(idx_kda_deaths, idx_kda_deaths+idx_kda_deaths_end)}</span>{' '}/{' '}
														<span>{substr_kda.slice(idx_kda_assists, idx_kda_assists+idx_kda_assists_end)}</span>
														<p>{substr_cs.slice(idx_cs+3, idx_cs + idx_cs_end)}</p>
														<p>{substr_winrate.slice(idx_winrate, idx_winrate+2)}%</p>
														<p>{substr_winrate.slice(idx_winrate+38, idx_winrate+40)}</p>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						</>
					)
				})
			}
		</>
	)
}

export default Index

export const getStaticProps = async () => {

	const BASE_URL = 'https://euw.op.gg/summoner/userName='

	const alex = await Axios.get(BASE_URL + 'alexwwe')
	const bruno = await Axios.get(BASE_URL + 'Brr1')
	const cristian = await Axios.get(BASE_URL + 'BloddSword')
	const david = await Axios.get(BASE_URL + 'Dawichii')
	const marcos = await Axios.get(BASE_URL + 'Agazhord')
	const rodri = await Axios.get(BASE_URL + 'Traketero')
	const samu = await Axios.get(BASE_URL + 'DryadZero')
	const diego = await Axios.get(BASE_URL + 'Rhaast West')

	return {
		props: { data: [
			{name: 'Alex', data: alex.data, alias: 'alexwwe'},
			{name: 'Bruno', data: bruno.data, alias: 'Brr1'},
			{name: 'Cristian', data: cristian.data, alias: 'BloddSword'},
			{name: 'David', data: david.data, alias: 'Dawichii'},
			{name: 'Marcos', data: marcos.data, alias: 'Agazhord'},
			{name: 'Rodri', data: rodri.data, alias: 'Traketero'},
			{name: 'Samu', data: samu.data, alias: 'DryadZero'},
			{name: 'Diego', data: diego.data, alias: 'Rhaast West'},
		] },
	}
}
