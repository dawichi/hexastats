import { Injectable, Logger } from '@nestjs/common'
import { ChampStatsDto, FriendDto, GameDto, PositionStatsDto, RecordsDto, StatsDto } from '../../common/types'
import { kda } from '../../common/utils'

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

                if (!player) {
                    this.LOGGER.warn(`No player found for index ${i} in game ${game.matchId} -> must be a personal game`)
                    continue
                }

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
        const avg = (a: number, b: number, num_of_games: number) => parseFloat(((a * num_of_games + b) / (num_of_games + 1)).toFixed(2))

        // Iterate all games
        for (const game of games) {
            const key = game.championName
            const perMin = (x: number) => Number(((x * 60) / game.gameDuration).toFixed(1))

            // 1. Champ not indexed yet -> create it
            if (!indexByName[key]) {
                indexByName[key] = {
                    championName: key,
                    games: 1,
                    wins: game.win ? 1 : 0,
                    kda: kda(game.kills, game.deaths, game.assists),
                    goldMin: perMin(game.gold),
                    csMin: perMin(game.cs),
                    visionMin: perMin(game.visionScore),
                    killParticipation: 1,
                    damageDealt: 1,
                    damageTaken: 1,
                }
                continue
            }

            // 2. Champ already indexed -> update it
            indexByName[key].kda = avg(indexByName[key].kda, kda(game.kills, game.deaths, game.assists), indexByName[key].games)
            indexByName[key].wins += game.win ? 1 : 0
            indexByName[key].goldMin = avg(indexByName[key].goldMin, perMin(game.gold), indexByName[key].games)
            indexByName[key].csMin = avg(indexByName[key].csMin, perMin(game.cs), indexByName[key].games)
            indexByName[key].visionMin = avg(indexByName[key].visionMin, perMin(game.visionScore), indexByName[key].games)
            // indexByName[key].killParticipation
            // indexByName[key].damageDealt
            // indexByName[key].damageTaken

            // This needs to be done after the kda calculation, because it depends on it
            indexByName[key].games += 1
        }

        // Then, convert the index to an array
        const champs: ChampStatsDto[] = Object.keys(indexByName)
            .map(key => indexByName[key])
            .sort((a, b) => b.games - a.games)

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

    /**
     * ## Builds the record stats based on the games
     * From the games data, it allows to build the stats.
     *
     * @param games The games to build the stats from
     * @returns The record stats
     */
    getRecords(games: GameDto[]): RecordsDto {
        const BaseRecordValue = { value: 0, matchId: '', championName: '', gameMode: '', gameCreation: 0, gameDuration: 0 }
        const out: RecordsDto = {
            kda: BaseRecordValue,
            kills: BaseRecordValue,
            deaths: BaseRecordValue,
            assists: BaseRecordValue,
            gold: BaseRecordValue,
            goldPerMin: BaseRecordValue,
            cs: BaseRecordValue,
            csPerMin: BaseRecordValue,
            vision: BaseRecordValue,
            visionPerMin: BaseRecordValue,
            gameDuration: BaseRecordValue,
            doubleKills: BaseRecordValue,
            tripleKills: BaseRecordValue,
            quadraKills: BaseRecordValue,
            pentaKills: BaseRecordValue,
        }

        for (const game of games) {
            const perMin = (x: number) => Number(((x * 60) / game.gameDuration).toFixed(1))
            // Helper function to create the value object
            const mockValue = (value: number) => ({
                value,
                matchId: game.matchId,
                championName: game.championName,
                gameMode: game.gameMode,
                gameCreation: game.gameCreation,
                gameDuration: game.gameDuration,
            })

            // Iterate over the keys of the out object
            for (const key of Object.keys(out) as Array<keyof RecordsDto>) {
                // NOTE: Some RecordsDto's keys are not === like GameDto's keys
                // To avoid problems, we need to check if the key is a valid key for game too
                if (Object.keys(game).includes(key) && Number(game[key as keyof GameDto]) > out[key].value) {
                    out[key] = mockValue(Number(game[key as keyof GameDto]))
                }
            }

            // Now the exception props that need to be handled manually
            const game_kda = kda(game.kills, game.deaths, game.assists)

            out.kda = game_kda > out.kda.value ? mockValue(game_kda) : out.kda
            out.goldPerMin = perMin(game.gold) > out.goldPerMin.value ? mockValue(perMin(game.gold)) : out.goldPerMin
            out.csPerMin = perMin(game.cs) > out.csPerMin.value ? mockValue(perMin(game.cs)) : out.csPerMin
            out.visionPerMin = perMin(game.visionScore) > out.visionPerMin.value ? mockValue(perMin(game.visionScore)) : out.visionPerMin
            out.gameDuration = game.gameDuration > out.gameDuration.value ? mockValue(game.gameDuration) : out.gameDuration
        }

        return out
    }

    /**
     * ## Merges two statsDto objects
     * Each statsDto object was calculated depending on a different number of games
     * so we need to analyze its weight, not merge them directly.
     *
     * @param statsA The base stats object
     * @param statsB The stats object to merge into the base
     * @returns The stats merged and recalculated
     */
    mergeStats(statsA: StatsDto, statsB: StatsDto): StatsDto {
        // GAMES
        statsA.gamesUsed = [...statsA.gamesUsed, ...statsB.gamesUsed]

        // POSITIONS
        for (const [idx, position_B] of statsB.statsByPosition.entries()) {
            statsA.statsByPosition[idx].games += position_B.games
            statsA.statsByPosition[idx].wins += position_B.wins
        }

        // FRIENDS
        for (const friendB of statsB.friends) {
            const friendA = statsA.friends.find(f => f.name === friendB.name)

            if (!friendA) {
                statsA.friends.push(friendB)
            } else {
                friendA.games += friendB.games
                friendA.wins += friendB.wins
            }
        }

        // CHAMPS
        const mergeValues = (a: number, b: number, aN: number, bN: number) => Number(((a * aN + b * bN) / (aN + bN)).toFixed(2))

        for (const champB of statsB.statsByChamp) {
            const champA = statsA.statsByChamp.find(c => c.championName === champB.championName)

            if (!champA) {
                statsA.statsByChamp.push(champB)
            } else {
                champA.kda = Number(((champA.kda * champA.games + champB.kda * champB.games) / (champA.games + champB.games)).toFixed(2))
                champA.goldMin = mergeValues(champA.goldMin, champB.goldMin, champA.games, champB.games)
                champA.csMin = mergeValues(champA.csMin, champB.csMin, champA.games, champB.games)
                champA.visionMin = mergeValues(champA.visionMin, champB.visionMin, champA.games, champB.games)

                // This needs to be done after the kda calculation, because it depends on it
                champA.games += champB.games
                champA.wins += champB.wins
            }
        }

        // RECORDS
        for (const key of Object.keys(statsA.records) as Array<keyof RecordsDto>) {
            statsA.records[key] = statsA.records[key].value > statsB.records[key].value ? statsA.records[key] : statsB.records[key]
        }

        return statsA
    }
}
