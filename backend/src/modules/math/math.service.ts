/* eslint-disable @typescript-eslint/no-unused-vars */
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
        if (games.length === 0) {
            return []
        }

        const indexByName: Record<
            string,
            {
                games: number
                wins: number
            }
        > = {}

        // Iterate all games
        for (const game of games) {
            for (const participant of game.participants) {
                const record = indexByName[participant.summonerName]

                if (!record) {
                    indexByName[participant.summonerName] = {
                        wins: game.win ? 1 : 0,
                        games: 1,
                    }
                } else {
                    record.wins += game.win ? 1 : 0
                    record.games += 1
                }
            }
        }

        // Remove your own name from the list
        delete indexByName[games[0]!.participants[games[0]!.participantNumber]!.summonerName]

        return Object.entries(indexByName)
            .map(([key, data]) => ({
                name: key,
                games: data.games,
                wins: data.wins,
            }))
            .sort((a, b) => b.games - a.games)
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
            const champ = indexByName[key]

            // 1. Champ not indexed yet -> create it
            if (!champ) {
                indexByName[key] = {
                    championName: key,
                    games: 1,
                    wins: game.win ? 1 : 0,
                    kda: kda(game.kills, game.deaths, game.assists),
                    goldMin: perMin(game.gold),
                    csMin: perMin(game.cs),
                    visionMin: perMin(game.visionScore),
                    killParticipation: Number(game.killParticipation.toFixed(2)),
                    damageDealt: game.damageDealt,
                    damageTaken: game.damageTaken,
                }
                continue
            }

            // 2. Champ already indexed -> update it
            champ.kda = avg(champ.kda, kda(game.kills, game.deaths, game.assists), champ.games)
            champ.wins += game.win ? 1 : 0
            champ.goldMin = avg(champ.goldMin, perMin(game.gold), champ.games)
            champ.csMin = avg(champ.csMin, perMin(game.cs), champ.games)
            champ.visionMin = avg(champ.visionMin, perMin(game.visionScore), champ.games)
            champ.killParticipation = avg(champ.killParticipation, game.killParticipation, champ.games)
            champ.damageDealt = avg(champ.damageDealt, game.damageDealt, champ.games)
            champ.damageTaken = avg(champ.damageTaken, game.damageTaken, champ.games)

            // This needs to be done after the kda calculation, because it depends on it
            champ.games += 1
        }

        // Then, convert the index to an array
        return Object.entries(indexByName)
            .map(([key, stats]) => stats)
            .sort((a, b) => b.games - a.games)
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

            const champ = indexByPosition[key]

            if (champ) {
                champ.games++
                champ.wins += game.win ? 1 : 0
            }
        }

        return Object.entries(indexByPosition).map(([key, stats]) => stats)
    }

    /**
     * ## Builds the record stats based on the games
     * From the games data, it allows to build the stats.
     *
     * @param games The games to build the stats from
     * @param revertRecords The games Record (highest or lowest)
     * @returns The record stats
     */
    getRecords(games: GameDto[], revertRecords = false): RecordsDto {
        const BaseRecordValue = {
            value: revertRecords ? Infinity : 0,
            matchId: '',
            championName: '',
            gameMode: '',
            gameCreation: 0,
            gameDuration: 0,
        }

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

        const check = (left: number, right: number) => (revertRecords ? left <= right : left > right)

        if (revertRecords) {
            //Filter remakes from lowest records
            games = games.filter(game => !game.isEarlySurrender)
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
                if (Object.keys(game).includes(key) && check(Number(game[key as keyof GameDto]), out[key].value)) {
                    out[key] = mockValue(Number(game[key as keyof GameDto]))
                }
            }

            // Now the exception props that need to be handled manually
            const game_kda = kda(game.kills, game.deaths, game.assists)

            out.kda = check(game_kda, out.kda.value) ? mockValue(game_kda) : out.kda
            out.goldPerMin = check(perMin(game.gold), out.goldPerMin.value) ? mockValue(perMin(game.gold)) : out.goldPerMin
            out.csPerMin = check(perMin(game.cs), out.csPerMin.value) ? mockValue(perMin(game.cs)) : out.csPerMin
            out.visionPerMin = check(perMin(game.visionScore), out.visionPerMin.value)
                ? mockValue(perMin(game.visionScore))
                : out.visionPerMin
            out.gameDuration = check(game.gameDuration, out.gameDuration.value) ? mockValue(game.gameDuration) : out.gameDuration
            out.vision = check(game.visionScore, out.vision.value) ? mockValue(game.visionScore) : out.vision
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
            const indexed = statsA.statsByPosition[idx]

            if (indexed) {
                indexed.games += position_B.games
                indexed.wins += position_B.wins
            }
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
                champA.killParticipation = mergeValues(champA.killParticipation, champB.killParticipation, champA.games, champB.games)
                champA.damageDealt = mergeValues(champA.damageDealt, champB.damageDealt, champA.games, champB.games)
                champA.damageTaken = mergeValues(champA.damageTaken, champB.damageTaken, champA.games, champB.games)

                // This needs to be done after the kda calculation, because it depends on it
                champA.games += champB.games
                champA.wins += champB.wins
            }
        }

        // RECORDS
        for (const key of Object.keys(statsA.records) as Array<keyof RecordsDto>) {
            statsA.records[key] = statsA.records[key].value >= statsB.records[key].value ? statsA.records[key] : statsB.records[key]
            statsA.lowRecords[key] =
                statsA.lowRecords[key].value <= statsB.lowRecords[key].value ? statsA.lowRecords[key] : statsB.lowRecords[key]
        }

        return statsA
    }
}
