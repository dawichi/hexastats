import Axios from "axios"
import getIndexOfString from "../utils/getIndexOfString"

const BASE_URL = 'https://euw.op.gg/summoner/userName=alexwwe'

const Index = (props: { data: any; }) => {
	const opgg_string = (props.data)
	const champs =	getIndexOfString('<div class="ChampionBox Ranked">', props.data, true)

	const colorspan = (kda: number) => {
		if (kda < 1.5) return 'bg-red-200'
		if (kda > 2.5) return 'bg-green-200'
		return ''
	}
	
	return (
		<div className="m-5">
			<div className="row">
				{ champs.map((x, id) => {
					// SUB-STRINGS 
					const substr_name = opgg_string.slice(x+60, x+99)
					const substr_img = opgg_string.slice(x+100, x+420)
					const substr_kda = opgg_string.slice(x+520, x+1050)
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
					
					return (
						<div key={id} className="col-6">
							<div className="flex m-2">
								<img src={'https:' + substr_img.slice(idx_img, idx_img_end)} />
								<div className="ml-4 text-2xl">
									<span className="text-3xl">{substr_name.slice(0, getIndexOfString('"', substr_name, false)[0]).replace("&#039;", "'")}</span>
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
	)
}

export default Index

export const getStaticProps = async () => {
	const res = await Axios.get(BASE_URL)
	return {
		props: { data: res.data },
	}
}
