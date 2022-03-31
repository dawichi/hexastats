import { riot } from 'configs'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Retrieves the summoner data for a given summoner name 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req)
    if (!req.query.name) {
        return res.status(403).json({ msg: 'Missing player name' })
    }

    const url = riot.endpoints.summoner + req.query.name

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
