import { riot } from 'configs'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Retrieves the champion name for a given champion id
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.championId) {
        return res.status(403).json({ msg: 'Missing champion ID' })
    }

    const url = riot.utils.cdn + 'data/es_ES/champion.json'

    try {
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Riot-Token': riot.apiKey,
            },
        })

        const data = await resp.json()
        Object.keys(data.data).forEach(key => {
            if (data.data[key].key === req.query.championId) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(data.data[key])
            }
        })
    } catch (err) {
        console.error(err)
    }
}
