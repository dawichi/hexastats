import Axios from "axios"
import getIndexOfString from "../utils/getIndexOfString"

const BASE_URL = 'https://euw.op.gg/summoner/userName=alexwwe'

const Index = (props: { data: any; }) => {
	const opgg_string = (props.data)
	const champs =	getIndexOfString('<div class="ChampionBox Ranked">', props.data, true)

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
					
					return (
						<div key={id} className="col-4">
							<div className="flex m-2">
								<img src={'https:' + substr_img.slice(idx_img, idx_img_end)} />
								<div className="ml-4">
									<p className="text-4xl">{substr_name.slice(0, getIndexOfString('"', substr_name, false)[0]).replace("&#039;", "'")}</p>
									<p className="text-2xl">{substr_kda.slice(idx_kda, idx_kda+4)}</p>
									<p className="text-2xl">{substr_kda.slice(idx_kda_kills, idx_kda_kills+idx_kda_kills_end)}</p>
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
