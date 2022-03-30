import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.name) {
        return res.status(403).json({ msg: 'Missing player name' })
    }
    const endpoint = process.env.BASE_URL + 'v4/summoners/by-name/' + req.query.name

    try {
        const resp = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'X-Riot-Token': process.env.API_KEY,
            },
        })

        const data = await resp.json()

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(data)
    } catch (err) {
        console.error(err)
    }
}
