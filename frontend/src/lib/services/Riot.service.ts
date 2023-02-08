/**
 * ## Service to manage the riot assets
 * Riot's assets have different URLs depending on the type.
 * So this service provides a centralized way to get the correct URL for each asset.
 */
export class RiotService {
    private readonly baseUrl: string = 'http://ddragon.leagueoflegends.com/cdn/'

    /**
     * ## URL to the champ image
     * @param champName The name of the champ
     */
    static champImage(champName: string): string {
        // exception only for fiddlesticks
        if (champName === 'FiddleSticks') champName = 'Fiddlesticks'
        return `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${champName}.png`
    }

    /**
     * ## URL to the champ splash art
     * @param champName The name of the champ
     */
    static champSplash(champName: string): string {
        return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champName}_0.jpg`
    }

    /**
     * ## URL to the position image
     * @param position The position of the champ
     */
    static teamPositionIcon(position: string): string {
        const positions: Record<string, string> = {
            TOP: 'position_top.png',
            MIDDLE: 'position_mid.png',
            JUNGLE: 'position_jungle.png',
            BOTTOM: 'position_bottom.png',
            UTILITY: 'position_support.png',
        }

        return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/${positions[position] ?? positions.MIDDLE}`
    }
}
