export const servers = ['euw', 'lan', 'las', 'na', 'kr', 'eune', 'tr', 'oce', 'ru', 'jp', 'br']

/**
 * ## Validate the server
 * Riot CDNs are not equal as server names, it needs to be validated
 * @param server The server to get the region from
 * @returns The region of the server. Default is euw1
 */
export const validateServer = (server: string): string => {
    const servers = {
        euw: 'euw1',
        lan: 'la1',
        las: 'la2',
        na: 'na1',
        kr: 'kr',
        eune: 'eune1',
        tr: 'tr1',
        oce: 'oc1',
        ru: 'ru',
        jp: 'jp1',
        br: 'br1',
    }

    return servers[server] ?? 'euw1'
}
