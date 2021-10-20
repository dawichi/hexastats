import Axios from "axios"
import getIndexOfString from "../utils/getIndexOfString"

const Index = (props: { data: any[] }) => {

	const colorspan = (kda: number) => {
		if (kda < 1.5) return 'bg-red-200'
		if (kda > 2.8) return 'bg-green-200'
		return ''
	}

	return (
		<>
			{
				props.data.map((player, index_player) => {
					const champs_indexes =	getIndexOfString('<div class="ChampionBox Ranked">', player.data, true)
					return (
						<>
							<div key={index_player} className="mx-5">
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
										const substr_name = player.data.slice(x+60, x+99)
										const substr_img = player.data.slice(x+100, x+420)
										const substr_kda = player.data.slice(x+520, x+1050)
										// Index helpers
										const idx_img = getIndexOfString('<img src="', substr_img, false)[0]+10
										const idx_img_end = getIndexOfString('.png', substr_img, false)[0]+4
										const idx_kda = getIndexOfString('<span class="KDA">', substr_kda, false)[0]+18
										const idx_kda_kills = getIndexOfString('<div class="KDAEach">', substr_kda, false)[0]+45
										const idx_kda_kills_end = getIndexOfString('<', substr_kda.slice(idx_kda_kills, idx_kda_kills+5), false)[0]
										const idx_kda_deaths = getIndexOfString('<span class="Death">', substr_kda, false)[0]+20
										const idx_kda_deaths_end = getIndexOfString('<', substr_kda.slice(idx_kda_deaths, idx_kda_deaths+5), false)[0]
										const idx_kda_assists = getIndexOfString('<span class="Assist">', substr_kda, false)[0]+21
										const idx_kda_assists_end = getIndexOfString('<', substr_kda.slice(idx_kda_assists, idx_kda_assists+5), false)[0]
										
										if (index_champ > 5) return

										return (
											<div key={index_champ} className="col-6 col-md-4 col-xl-2">
												<div className="flex m-2">
													<div>
														<img className="w-100" src={'https:' + substr_img.slice(idx_img, idx_img_end)} />
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
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
							<hr/>
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

	return {
		props: { data: [
			{name: 'Alex', data: alex.data},
			{name: 'Bruno', data: bruno.data},
			{name: 'Cristian', data: cristian.data},
			{name: 'David', data: david.data},
			{name: 'Marcos', data: marcos.data},
			{name: 'Rodri', data: rodri.data},
			{name: 'Samu', data: samu.data},
		] },
	}
}
