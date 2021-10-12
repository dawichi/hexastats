import Axios from "axios"
import getIndexOfString from "../utils/getIndexOfString"

const BASE_URL = 'https://euw.op.gg/summoner/userName=Dawichii'

const Index = (props: { data: any; }) => {
	const opgg_string = (props.data)
	const start = opgg_string.indexOf('MostChampionContent ')
	const end = opgg_string.indexOf('class="tabItem overview-stats--soloranked"')
	console.log(opgg_string, start, end)
	console.log(opgg_string.slice(start, end))

	console.log(getIndexOfString("le", "I learned to play the Ukulele in Lebanon.", false))

	return (
		<div>
			<h1>Home</h1>
			<div id="startpoint"></div>
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
