import { Injectable, Logger } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { GameArenaDto, GameDetailDto, GameNormalDto, MasteryDto, PlayerDto, RankDataDto, RiotIdDto, StatsDto } from '../../common/types'
import { RiotService } from '../../modules/riot/riot.service'
import { DatabaseService } from '../database/database.service'
import { MathService } from '../math/math.service'
import { QueueType } from '../../common/schemas'

@ApiTags('summoners')
@Injectable()
export class SummonersService {
    private readonly LOGGER = new Logger(this.constructor.name)

    constructor(
        private readonly riotService: RiotService,
        private readonly databaseService: DatabaseService,
        private readonly mathService: MathService,
    ) {}

    /**
     * /summoners/:server/:riotId
     */
    async getSummoner(server: string, riotId: RiotIdDto): Promise<RankDataDto> {
        const data = await this.riotService.getBasicInfo(server, riotId)
        const { solo, flex, arena } = await this.riotService.getRankData(data.id, server)

        return {
            alias: data.riotIdName,
            riotIdName: data.riotIdName,
            riotIdTag: data.riotIdTag,
            server,
            image: `https://ddragon.leagueoflegends.com/cdn/${this.riotService.version}/img/profileicon/${data.profileIconId}.png`,
            level: data.summonerLevel,
            rank: {
                solo,
                flex,
                arena,
            },
        }
    }

    /**
     * /summoners/:server/:riotId/level-image
     */
    async getLevelImage(server: string, riotId: RiotIdDto): Promise<PlayerDto> {
        const data = await this.riotService.getBasicInfo(server, riotId)

        return {
            alias: data.riotIdName,
            riotIdName: data.riotIdName,
            riotIdTag: data.riotIdTag,
            server,
            image: `https://ddragon.leagueoflegends.com/cdn/${this.riotService.version}/img/profileicon/${data.profileIconId}.png`,
            level: data.summonerLevel,
        }
    }

    /**
     * /summoners/:server/:riotId/masteries
     */
    async getMasteries(server: string, riotId: RiotIdDto, limit: number): Promise<MasteryDto[]> {
        return this.riotService.getMasteries(riotId, server, limit)
    }

    /**
     * /summoners/:server/:riotId/games
     */
    async getGames(
        server: string,
        riotId: RiotIdDto,
        limit: number,
        offset: number,
        queueType: QueueType,
    ): Promise<Array<GameNormalDto | GameArenaDto>> {
        const { puuid } = await this.riotService.getBasicInfo(server, riotId)

        // Get the list of game IDs
        const games_list = await this.riotService.getGameIds(puuid, server, limit, offset, queueType)

        // Get the game data
        return this.riotService.getGamesDetail(puuid, server, games_list)
    }

    /**
     * /summoners/:server/:riotId/games):matchId
     */
    async getGameDetail(server: string, riotId: RiotIdDto, matchId: string): Promise<GameDetailDto> {
        const { puuid } = await this.riotService.getBasicInfo(server, riotId)

        return this.riotService.getGameDetail(puuid, server, matchId)
    }

    /**
     * /summoners/:server/:riotId/stats
     */
    async getStats(server: string, riotId: RiotIdDto): Promise<StatsDto> {
        const gamesFromDB = await this.databaseService.getStats(server, riotId)

        if (gamesFromDB) {
            const { puuid } = await this.riotService.getBasicInfo(server, riotId)
            const { is_last, last_game_id } = await this.riotService.isLastGame(server, puuid, String(gamesFromDB.gamesUsed[0]))

            if (is_last) {
                this.LOGGER.log(`${last_game_id} is last game -> returning cached data`)
                return gamesFromDB
            }
            // Option 2
            const games_list = await this.riotService.getGameIds(puuid, server, 10, 0, 'all')
            const result = games_list.filter(match_id => !gamesFromDB.gamesUsed.includes(match_id))

            if (result.length <= 10) {
                const extraGames = await this.getGames(server, riotId, result.length, 0, 'all')

                const extraOutput: StatsDto = {
                    gamesUsed: extraGames.map(game => game.matchId),
                    friends: this.mathService.getFriends(extraGames),
                    statsByChamp: this.mathService.getStatsByChamp(extraGames),
                    statsByPosition: this.mathService.getStatsByPosition(extraGames),
                    records: this.mathService.getRecords(extraGames),
                    lowRecords: this.mathService.getRecords(extraGames, true),
                }

                const mergedStats = this.mathService.mergeStats(extraOutput, gamesFromDB)

                await this.databaseService.set(`${server}:${riotId.name}#${riotId.tag}:stats`, mergedStats)

                return mergedStats
            }
            this.LOGGER.log(`${last_game_id} is NOT last game -> updating cached data with new games`)
        }
        // Option 3
        const games = await this.getGames(server, riotId, 10, 0, 'all')

        const output: StatsDto = {
            gamesUsed: games.map(game => game.matchId),
            friends: this.mathService.getFriends(games),
            statsByChamp: this.mathService.getStatsByChamp(games),
            statsByPosition: this.mathService.getStatsByPosition(games),
            records: this.mathService.getRecords(games),
            lowRecords: this.mathService.getRecords(games, true),
        }

        await this.databaseService.set(`${server}:${riotId.name}#${riotId.tag}:stats`, output)

        return output
    }

    /**
     * /summoners/:server/:riotId/stats/add
     */
    async addStats(server: string, riotId: RiotIdDto): Promise<StatsDto> {
        const currentStats = await this.getStats(server, riotId)

        const games = await this.getGames(server, riotId, 10, currentStats.gamesUsed.length, 'all')

        const newStats: StatsDto = {
            gamesUsed: games.map(game => game.matchId),
            friends: this.mathService.getFriends(games),
            statsByChamp: this.mathService.getStatsByChamp(games),
            statsByPosition: this.mathService.getStatsByPosition(games),
            records: this.mathService.getRecords(games),
            lowRecords: this.mathService.getRecords(games, true),
        }

        const mergedStats: StatsDto = this.mathService.mergeStats(currentStats, newStats)

        await this.databaseService.set(`${server}:${riotId.name}#${riotId.tag}:stats`, mergedStats)

        return mergedStats
    }
}
