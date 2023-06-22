import { Injectable, Logger } from '@nestjs/common'
import { ChampStatsDto, FriendDto, GameDto, PositionStatsDto } from 'src/common/types'
import { kda } from 'src/common/utils'

@Injectable()
export class MathService {
    private readonly LOGGER = new Logger(this.constructor.name)

    /**
     * ## Checks the friends winrate
     * Check if a player have been repeeated in your games and if so,
     * considers it a friend and checks its winrate before adding it to the list.
     *
     * @param games The games to build the stats from
     * @returns The list stats
     */
    getFriends(games: GameDto[]): Array<FriendDto> {
        const indexByName: Record<
            string,
            {
                games: number
                wins: number
            }
        > = {}

        // Iterate all games
        for (const game of games) {
            // Iterate over your teammates only
            const [initialTeamMate, lastTeamMate] = game.participantNumber > 4 ? [5, 9] : [0, 4]

            for (let i = initialTeamMate; i < lastTeamMate; i++) {
                const player = game.participants[i]

                if (!indexByName[player.summonerName]) {
                    indexByName[player.summonerName] = {
                        wins: game.win ? 1 : 0,
                        games: 1,
                    }
                } else {
                    indexByName[player.summonerName].wins += game.win ? 1 : 0
                    indexByName[player.summonerName].games += 1
                }
            }
        }

        // Remove all players you only played with once/twice
        for (const friend in indexByName) {
            if (indexByName[friend].games < 3) {
                delete indexByName[friend]
            }
        }

        // Remove your own name from the list
        delete indexByName[games[0].participants[games[0].participantNumber].summonerName]

        const result = Object.keys(indexByName)
            .map(key => ({
                name: key,
                games: indexByName[key].games,
                wins: indexByName[key].wins,
            }))
            .sort((a, b) => b.games - a.games)

        return result
    }

    /**
     * ## Builds the champs stats based on the games
     * From the games data, it allows to build the stats for each champ.
     *
     * @param games The games to build the stats from
     * @returns The champs stats
     */
    getStatsByChamp(games: GameDto[]): Array<ChampStatsDto> {
        // Index to accumulate the stats
        const indexByName: Record<string, ChampStatsDto> = {}

        // Calculate the average of two properties based on the number of games
        const avg = (a: number, b: number, num_of_games: number) => parseFloat(((a * num_of_games + b) / (num_of_games + 1)).toFixed(1))

        // Iterate all games
        for (const game of games) {
            const key = game.championName

            // 1. Champ not indexed yet -> create it
            if (!indexByName[key]) {
                indexByName[key] = {
                    championName: key,
                    games: 1,
                    wins: game.win ? 1 : 0,
                    kda: kda(game.kda.kills, game.kda.deaths, game.kda.assists),
                }
                continue
            }

            // 2. Champ already indexed -> update it
            indexByName[key].games += 1
            indexByName[key].wins += game.win ? 1 : 0
            indexByName[key].kda = avg(indexByName[key].kda, kda(game.kda.kills, game.kda.deaths, game.kda.assists), indexByName[key].games)
        }

        // Then, convert the index to an array
        const champs: ChampStatsDto[] = Object.keys(indexByName)
            .map(key => indexByName[key])
            .sort((a, b) => b.games - a.games)

        // Trim the array to the top 7 champs
        if (champs.length > 7) {
            champs.length = 7
        }

        return champs
    }

    /**
     * ## Builds the position stats based on the games
     * From the games data, it allows to build the stats.
     *
     * @param games The games to build the stats from
     * @returns The position stats
     */
    getStatsByPosition(games: GameDto[]): PositionStatsDto[] {
        // Index to accumulate the stats
        const indexByPosition: Record<string, PositionStatsDto> = {
            TOP: { games: 0, wins: 0, position: 'TOP' },
            JUNGLE: { games: 0, wins: 0, position: 'JUNGLE' },
            MIDDLE: { games: 0, wins: 0, position: 'MIDDLE' },
            BOTTOM: { games: 0, wins: 0, position: 'BOTTOM' },
            UTILITY: { games: 0, wins: 0, position: 'UTILITY' },
        }

        for (const game of games) {
            // Don't use ?? as it comes as '' instead of null or undefined
            const key = game.teamPosition || 'MIDDLE'

            indexByPosition[key].games++
            indexByPosition[key].wins += game.win ? 1 : 0
        }
        return Object.keys(indexByPosition).map(key => indexByPosition[key])
    }
}
