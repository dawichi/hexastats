import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load(): Promise<{ names: string[] }> {
    try {
        const response = await fetch('http://localhost:5000/database/print')
        const data = await response.json()

        const keys: string[] = data.keys.map((key: string) => {
            const [server, name] = key.split(':')
            return `${server}:${decodeURI(name)}`
        })
        return {
            names: [...new Set(keys)],
        }
    } catch (e: unknown) {
        throw error(500, 'Server is not up, try in a few minutes.')
    }
}
