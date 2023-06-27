import { Injectable, Logger } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ChampStatsDto, FriendDto, GameDto, MasteryDto, PlayerDto, PositionStatsDto, RankDataDto, StatsDto } from '../../common/types'
import { RiotService } from '../../modules/riot/riot.service'
import { DatabaseService } from '../database/database.service'
import { MathService } from '../math/math.service'

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
     * /summoners/:server/:summonerName
     */
    async getSummoner(server: string, summonerName: string): Promise<RankDataDto> {
        const data = await this.riotService.getBasicInfo(server, summonerName)
        const { solo, flex } = await this.riotService.getRankData(data.id, server)

        return {
            alias: data.name,
            server,
            image: `https://ddragon.leagueoflegends.com/cdn/${this.riotService.version}/img/profileicon/${data.profileIconId}.png`,
            level: data.summonerLevel,
            rank: {
                solo,
                flex,
            },
        }
    }

    /**
     * /summoners/:server/:summonerName/level-image
     */
    async getLevelImage(server: string, summonerName: string): Promise<PlayerDto> {
        const data = await this.riotService.getBasicInfo(server, summonerName)

        return {
            alias: data.name,
            server,
            image: `https://ddragon.leagueoflegends.com/cdn/${this.riotService.version}/img/profileicon/${data.profileIconId}.png`,
            level: data.summonerLevel,
        }
    }

    /**
     * /summoners/:server/:summonerName/masteries
     */
    async getMasteries(server: string, summonerName: string, limit: number): Promise<MasteryDto[]> {
        return this.riotService.getMasteries(summonerName, server, limit)
    }

    /**
     * /summoners/:server/:summonerName/games
     */
    async getGames(server: string, summonerName: string, limit: number, offset: number): Promise<GameDto[]> {
        const { puuid } = await this.riotService.getBasicInfo(server, summonerName)

        // Get the list of game IDs
        const games_list = await this.riotService.getGameIds(puuid, server, limit, offset)

        // Get the game data
        return this.riotService.getGamesDetail(puuid, server, games_list)
    }

    /**
     * /summoners/:server/:summonerName/stats
     */
    async getStats(server: string, summonerName: string): Promise<StatsDto> {
        const gamesFromDB = await this.databaseService.getStats(server, summonerName)

        if (gamesFromDB) {
            const { puuid } = await this.riotService.getBasicInfo(server, summonerName)
            const { is_last, last_game_id } = await this.riotService.isLastGame(server, puuid, gamesFromDB.gamesUsed[0])

            if (is_last) {
                this.LOGGER.log(`${last_game_id} is last game -> returning cached data`)
                return gamesFromDB
            }
            this.LOGGER.log(`${last_game_id} is NOT last game -> updating cached data with new games`)
        }

        const games = await this.getGames(server, summonerName, 10, 0)
        const friends: FriendDto[] = this.mathService.getFriends(games)
        const statsByChamp: ChampStatsDto[] = this.mathService.getStatsByChamp(games)
        const statsByPosition: PositionStatsDto[] = this.mathService.getStatsByPosition(games)

        const output: StatsDto = {
            gamesUsed: games.map(game => game.matchId),
            friends,
            statsByChamp,
            statsByPosition,
        }

        await this.databaseService.set(`${server}:${summonerName}:stats`, output)

        return output
    }

    /**
     * /summoners/:server/:summonerName/stats/add
     */
    async addStats(server: string, summonerName: string): Promise<StatsDto> {
        const currentStats = await this.getStats(server, summonerName)

        const games = await this.getGames(server, summonerName, 10, currentStats.gamesUsed.length)
        const friends: FriendDto[] = this.mathService.getFriends(games)
        const statsByChamp: ChampStatsDto[] = this.mathService.getStatsByChamp(games)
        const statsByPosition: PositionStatsDto[] = this.mathService.getStatsByPosition(games)

        const newStats: StatsDto = {
            gamesUsed: games.map(game => game.matchId),
            friends,
            statsByChamp,
            statsByPosition,
        }

        const mergedStats: StatsDto = this.mathService.mergeStats(currentStats, newStats)

        await this.databaseService.set(`${server}:${summonerName}:stats`, mergedStats)

        return mergedStats
    }
}
