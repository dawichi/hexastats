import { Injectable, Logger } from '@nestjs/common'
import { ChampStatsDto, FriendDto, GameDto, PositionStatsDto, RecordDto, StatsDto } from '../../common/types'
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
                    kda: kda(game.kda.kills, game.kda.deaths, game.kda.assists),
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
            indexByName[key].kda = avg(indexByName[key].kda, kda(game.kda.kills, game.kda.deaths, game.kda.assists), indexByName[key].games)
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
    getRecords(games: GameDto[]): RecordDto {
        const BaseRecordValue = { value: 0, matchId: '' }
        const out: RecordDto = {
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
            matchDuration: BaseRecordValue,
            doubleKills: BaseRecordValue,
            tripleKills: BaseRecordValue,
            quadraKills: BaseRecordValue,
            pentaKills: BaseRecordValue,
        }

        for (const game of games) {
            out.kills = game.kda.kills > out.kills.value ? { value: game.kda.kills, matchId: game.matchId } : out.kills
            out.assists = game.kda.assists > out.assists.value ? { value: game.kda.assists, matchId: game.matchId } : out.assists
            out.deaths = game.kda.deaths > out.deaths.value ? { value: game.kda.deaths, matchId: game.matchId } : out.deaths
            out.gold = game.gold > out.gold.value ? { value: game.gold, matchId: game.matchId } : out.gold
            out.vision = game.visionScore > out.vision.value ? { value: game.visionScore, matchId: game.matchId } : out.vision
            out.cs = game.cs > out.cs.value ? { value: game.cs, matchId: game.matchId } : out.cs
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
        for (const champB of statsB.statsByChamp) {
            const champA = statsA.statsByChamp.find(c => c.championName === champB.championName)

            if (!champA) {
                statsA.statsByChamp.push(champB)
            } else {
                champA.kda = Number(((champA.kda * champA.games + champB.kda * champB.games) / (champA.games + champB.games)).toFixed(2))
                // This needs to be done after the kda calculation, because it depends on it
                champA.games += champB.games
                champA.wins += champB.wins
            }
        }

        return statsA
    }
}
