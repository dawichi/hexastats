// import cheerio from 'cheerio'
// import { getIndexOfString, realName } from '../../utils/index'
export {}
// // eslint-disable-next-line import/no-anonymous-default-export
// export default async (req: any, res: any) => {
// 	if (req.method === 'POST') {
// 		const username = req.body.user

// 		const query_profile_img = 'img.ProfileImage'
// 		const query_rank = 'div.Rank'
// 		const query_champs = 'div.MostChampionContent > div.MostChampionContent'
		
// 		try {
// 			// 1. fetch the string data
// 			const opgg_string = await fetch(`https://euw.op.gg/summoner/userName=${username}`)
// 				.then(res => res.text())

// 			// 2. load it into cheerio
// 			const $ = cheerio.load(opgg_string)

// 			// 3. Make the querys
// 			const profile_image = $(query_profile_img).attr("src")
// 			const rank = $(query_rank).text().replace(/\t|\n|Ladder Rank /g, '')
// 			const rank_idx_start = getIndexOfString('(', rank, false)[0]
// 			const rank_idx_end = getIndexOfString('%', rank, false)[0]
// 			let champs
// 			$(query_champs).get().map((champ, index) => {
// 				if (index === 0) {
// 					champs = champ.children.map(x => champs += x.toString())
// 				}
// 				console.log(champ.children)
// 			})


// 			const data = {
// 				name: realName(username),
// 				alias: username.replace(/^\w/, (s: string) => s.toUpperCase()),
// 				summoner_pic: `https:${profile_image}`,
// 				rank_n: parseInt(rank.slice(0, rank_idx_start).replace(/,/g, '').trim()),
// 				rank_p: parseFloat(rank.slice(rank_idx_start+1, rank_idx_end)),
// 				champs: champs
// 			}
			
// 			res.statusCode = 200
// 			return res.json({
// 				error: '',
// 				data: data
// 			})
// 		} catch (e) {
// 			res.statusCode = 404
// 			console.log(e)
// 			return res.json({
// 				error: `${username} error: ${e.message}`,
// 				data: ''
// 			})
// 		}
// 	}
// }