import { riot } from 'configs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.playerId) {
        return res.status(403).json({ msg: 'Missing player ID' })
    }

    const url = riot.endpoints.championMastery + req.query.playerId

    try {
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Riot-Token': riot.apiKey,
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
