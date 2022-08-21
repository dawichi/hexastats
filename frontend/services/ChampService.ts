import { RiotService } from './RiotService'
import FriendsDto from 'components/Summoner/Friends.dto'
import { ChampDto, GameDto } from 'interfaces'

/**
 * ## Service to manage the champ stats
 * From the games data, it allows to build the stats for each champ.
 */
export class ChampService {
    private readonly riotService = new RiotService()

    /**
     * ## Calculates the kda
     * (kills + assists) / deaths
     *
     * @param kills The number of kills
     * @param deaths The number of deaths
     * @param assists The number of assists
     * @returns The kda value
     */
    private kda = (kills: number, deaths: number, assists: number) =>
        parseInt((deaths ? (kills + assists) / deaths : kills + assists).toFixed(2))

    /**
     * ## Calculates the value per minute
     * (60 * val) / time
     *
     * @param value The value to calculate
     * @param time The time in seconds
     * @returns
     */
    private perMin = (value: number, time: number) => parseFloat(((60 * value) / time).toFixed(1))

    /**
     * ## Parse data from one single champ based on a game
     *
     * @param game The game to calculate the stats from
     * @returns The stats for the champ of that game
     */
    private parseChamp = (game: GameDto): ChampDto => {
        const player = game.participants[game.participantNumber]
        const { kills, deaths, assists } = player.kda

        return {
            name: player.champ.championName,
            image: this.riotService.champImage(player.champ.championName),
            games: 1,
            winrate: player.win ? 1 : 0,
            assists,
            deaths,
            kills,
            kda: this.kda(kills, deaths, assists),
            cs: player.farm.cs,
            csmin: this.perMin(player.farm.cs, game.gameDuration),
            gold: player.farm.gold,
            maxKills: kills,
            maxDeaths: deaths,
            avgDamageDealt: player.champ.damageDealt,
            avgDamageTaken: player.champ.damageTaken,
            visionScore: player.visionScore,
            doubleKills: player.multiKill.doubles,
            tripleKills: player.multiKill.triples,
            quadraKills: player.multiKill.quadras,
            pentaKills: player.multiKill.pentas,
        }
    }

    /**
     * ## Accumulates the game information from a champion
     * To calculate the average information about a champion, we need to accumulate
     * the data from all the games played with it. So with this function, it modifies the values
     * depending of it its an incremental value (like number of games played) or an average (like the winrate)
     *
     * @param {ChampDto} acc Accumulated data object
     * @param {ChampDto} cur Current data object
     * @returns {ChampDto} Modified accumulated data object
     */
    private accChamp(acc: ChampDto, cur: ChampDto): ChampDto {
        const avg = (a: number, b: number, n: number) => parseFloat(((a * n + b) / (n + 1)).toFixed(2))

        const props_max = ['maxKills', 'maxDeaths']
        const props_increment = ['doubleKills', 'tripleKills', 'quadraKills', 'pentaKills', 'winrate']
        const props_average = [
            'kills',
            'deaths',
            'assists',
            'kda',
            'cs',
            'csmin',
            'gold',
            'avgDamageTaken',
            'avgDamageDealt',
            'visionScore',
        ]

        // Max props: return the bigger value between the accumulated value and the new value
        for (const prop of props_max) {
            acc[prop] = cur[prop] > acc[prop] ? cur[prop] : acc[prop]
        }

        // Incremental props: just add the new value to the accumulated value
        for (const prop of props_increment) {
            acc[prop] += cur[prop]
        }

        // Average props: calculate the average of the accumulated value and the new value
        for (const prop of props_average) {
            acc[prop] = avg(acc[prop], cur[prop], acc.games)
        }

        // Don't accumulate games before to don't break averages for loop
        acc.games += 1

        return acc
    }

    /**
     * ## Builds the champs stats based on the games
     *
     * @param games The games to build the stats from
     * @returns The champs stats
     */
    champsBuilder = (games: GameDto[]): ChampDto[] => {
        const acc: {
            [champName: string]: ChampDto
        } = {}
        // First, index the games by champ name, accumulating the stats
        for (const game of games) {
            const champName = game.participants[game.participantNumber].champ.championName
            acc[champName] = acc[champName] ? this.accChamp(acc[champName], this.parseChamp(game)) : this.parseChamp(game)
        }

        // Convert accummulated wins to actual winrate
        for (const champName in acc) {
            if (acc.hasOwnProperty(champName)) {
                acc[champName].winrate = parseInt(((acc[champName].winrate / acc[champName].games) * 100).toFixed(0))
            }
        }

        // Then, convert the object to an array
        const champs = Object.keys(acc)
            .map(key => acc[key])
            .sort((a, b) => b.games - a.games)
        
        // Trim the array to the top 7 champs
        if (champs.length > 7) {
            champs.length = 7
        }

        return champs
    }


    /**
     * ## Checks the friends winrate
     * Check if a player have been repeeated in your games and if so,
     * considers it a friend and checks its winrate before adding it to the list.
     *
     * @param games The games to build the stats from
     * @returns The list stats
     */
    friendsCheck = (games: GameDto[]): FriendsDto => {
        const friends: FriendsDto = {}
        
        // First, index all the players you have played with
        for (const game of games) {
            const [initialTeamMate, lastTeamMate] = game.participantNumber > 4 ? [5,9] : [0,4]
            // iterate over your teammates only
            for (let i = initialTeamMate; i < lastTeamMate; i++) {
                const player = game.participants[i];
                if (!friends[player.summonerName]) {
                    friends[player.summonerName] = {
                        wins: player.win ? 1 : 0,
                        games: 1,
                    }
                } else {
                    friends[player.summonerName].wins += player.win ? 1 : 0
                    friends[player.summonerName].games += 1
                }
            }

        }

        // Remove all players you only played with once
        for (const friend in friends) {
            if (friends[friend].games === 1) {
                delete friends[friend]
            }
        }

        // Remove your own name from the list
        delete friends[games[0].participants[games[0].participantNumber].summonerName]


        return friends
    }
}
