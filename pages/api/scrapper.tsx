import cheerio from 'cheerio'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: any, res: any) => {
	if (req.method === 'POST') {
		const username = req.body.TWuser

		try {
			const response = await fetch(`https://twitter.com/${username}`)
			const htmlString = await response.text()
			const $ = cheerio.load(htmlString)
			const searchContext = `a[href='/${username}/followers']`
			const followerCountString = $(searchContext)
				.text()
			
			console.log(followerCountString)

			res.statusCode = 200
			return res.json({
				user: username,
				followerCount: Number(followerCountString),
			})
		} catch (e) {
			res.statusCode = 404
			console.log(e)
			return res.json({
				user: username,
				error: `${username} not found. Tip: Double check the spelling.`,
				followerCount: -1,
			})
		}
	}
}
