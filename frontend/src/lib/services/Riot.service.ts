/**
 * ## Service to manage the riot assets
 * Riot's assets have different URLs depending on the type.
 * So this service provides a centralized way to get the correct URL for each asset.
 */
export class RiotService {
    private static instance: RiotService
    public version: string

    constructor(version: string) {
        this.version = version
    }

    public static getInstance(version = '13.7.1'): RiotService {
        if (!RiotService.instance) {
            console.log('Creating RiotService instance')
            RiotService.instance = new RiotService(version)
        }
        return RiotService.instance
    }

    /**
     * ## URL to the item / ward image
     * @param itemId The id of the item
     * @returns The URL to the image
     */
    itemURL(itemId: number): string {
        return `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/item/${itemId}.png`
    }

    /**
     * ## Get the spell image URL
     *
     * @param spellId The id of the spell
     * @returns The url of the image
     */
    spellUrl(spellId: number): string {
        const spells: Record<number, string> = {
            21: 'Barrier',
            1: 'Boost',
            14: 'Dot',
            3: 'Exhaust',
            4: 'Flash',
            6: 'Haste',
            7: 'Heal',
            13: 'Mana',
            30: 'PoroRecall',
            31: 'PoroThrow',
            11: 'Smite',
            39: 'SnowURFSnowball_Mark',
            32: 'Snowball',
            12: 'Teleport',
            54: '_UltBookPlaceholder',
            55: '_UltBookSmitePlaceholder',
        }

        return `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/spell/Summoner${spells[spellId] ?? 'Flash'}.png`
    }

    /**
     * ## URL to the champ image
     * @param champName The name of the champ
     */
    champImage(champName: string): string {
        // exception only for fiddlesticks
        if (champName === 'FiddleSticks') champName = 'Fiddlesticks'
        return `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${champName}.png`
    }

    /**
     * ## URL to the champ splash art
     * @param champName The name of the champ
     */
    champSplash(champName: string): string {
        return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champName}_0.jpg`
    }

    /**
     * ## URL to the position image
     * @param position The position of the champ
     */
    teamPositionIcon(position: string): string {
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
