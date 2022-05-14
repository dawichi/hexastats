/**
 * ## Service to manage the requests about riot assets
 */
export class RiotService {
    private readonly baseUrl: string = 'http://ddragon.leagueoflegends.com/cdn/'

    /**
     * ## Returns the URL to the champ image
     * @param champName The name of the champ
     */
    champImage(champName: string) {
        return `https://opgg-static.akamaized.net/images/lol/champion/${champName}.png`
    }

}
