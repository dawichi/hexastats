import Axios from "axios"
import getIndexOfString from "../utils/getIndexOfString"

const BASE_URL = 'https://euw.op.gg/summoner/userName=BloddSword'

const Index = (props: { data: any; }) => {
	const opgg_string = (props.data)
	const champs =	getIndexOfString('<div class="ChampionBox Ranked">', props.data, true)
	champs.map(x => {
		const substr = opgg_string.slice(x+60, x+99)
		console.log(substr.slice(0, getIndexOfString('"', substr, false)[0]))
	})

	return (
		<div>
			<h1>Home</h1>
			<div id="startpoint">
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
