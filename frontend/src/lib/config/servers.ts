export const servers: string[] = ['euw', 'lan', 'las', 'na', 'kr', 'eune', 'tr', 'oce', 'ru', 'jp', 'br']
const serversDefinition: Record<string, string> = {
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

/**
 * ## Validate the server
 * Riot CDNs are not equal as server names, it needs to be validated
 * @param server The server to get the region from
 * @returns The region of the server. Default is euw1
 */
export const validateServer = (server: string): string => {
    return serversDefinition[server] ?? 'euw1'
}

export const rawServer = (server: string): string => {
    for (const key in serversDefinition) {
        if (serversDefinition[key] === server) return key
    }
    return 'euw'
}
