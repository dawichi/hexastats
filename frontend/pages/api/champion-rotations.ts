import { riot } from 'configs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = riot.endpoints.championRotations

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
