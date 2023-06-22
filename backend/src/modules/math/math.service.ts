import { Injectable, Logger } from '@nestjs/common'
import { FriendDto, GameDto } from 'src/common/types'

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
}
