/**
 * ## Server region validator
 * Depending of the server, the games must be requested to a different region
 * @param {string} server Server name (e.g. 'euw1')
 * @returns {string} region name (e.g. 'europe')
 */
export function serverRegion(server: string): string {
    const servers: { [key: string]: string } = {
        oc1: 'americas',
        la1: 'americas',
        la2: 'americas',
        br1: 'americas',
        na1: 'americas',
        jp1: 'asia',
        kr: 'asia',
        euw1: 'europe',
        eun1: 'europe',
        tr1: 'europe',
        ru: 'europe',
    }

    return servers[server] ?? 'europe'
}
