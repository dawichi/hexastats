import axios from 'axios'

const BASE_URL = 'view-source:https://euw.op.gg/summoner/userName=Dawichii'

const getData = async () => {
	try {
		const response = await axios.get(`${BASE_URL}`)
		console.log(`GET: ---------------`, response.data)
	} catch (errors) {
		console.error(errors)
	}
}
export default getData