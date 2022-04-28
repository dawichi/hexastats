/**
 * ## Server region validator
 * Depending of the server, the games must be requested to a different region
 * @param {string} server Server name (e.g. 'euw1')
 * @returns {string} region name (e.g. 'EUROPE')
 */
export const serverRegion = (server: string): string => {
    const servers = {
        oc1: 'AMERICAS',
        la1: 'AMERICAS',
        la2: 'AMERICAS',
        br1: 'AMERICAS',
        na1: 'AMERICAS',
        jp1: 'ASIA',
        kr: 'ASIA',
        euw1: 'EUROPE',
        eun1: 'EUROPE',
        tr1: 'EUROPE',
        ru: 'EUROPE',
    }

    return servers[server] ?? 'EUROPE'
}
