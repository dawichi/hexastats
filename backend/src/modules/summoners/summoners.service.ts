import { Injectable, Logger } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { GameDto, MasteryDto, PlayerDto } from '../../types'
import { InfoResponse } from '../../common/types/InfoResponse.dto'
import { RiotService } from '../../modules/riot/riot.service'
import { serverRegion } from '../../common/utils'

@ApiTags('summoners')
@Injectable()
export class SummonersService {
    private readonly logger = new Logger(this.constructor.name)

    constructor(private readonly riotService: RiotService) {}

    /**
     * /summoners/:server/:summonerName
     */
    async getSummoner(server: string, summonerName: string): Promise<PlayerDto> {
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
    async getLevelImage(server: string, summonerName: string): Promise<InfoResponse> {
        const data = await this.riotService.getBasicInfo(server, summonerName)

        this.logger.log(`Returning ${data.name} lv ${data.summonerLevel}`)
        return {
            name: data.name,
            level: data.summonerLevel,
            image: `https://ddragon.leagueoflegends.com/cdn/${this.riotService.version}/img/profileicon/${data.profileIconId}.png`,
        }
    }

    /**
     * /summoners/:server/:summonerName/masteries
     */
    async getMasteries(server: string, summonerName: string): Promise<MasteryDto[]> {
        return this.riotService.getMasteries(summonerName, server, 12)
    }

    /**
     * /summoners/:server/:summonerName/games
     */
    async getGames(server: string, summonerName: string): Promise<GameDto[]> {
        const { puuid } = await this.riotService.getBasicInfo(server, summonerName)

        server = serverRegion(server)

        // Get the list of game IDs
        const games_list = await this.riotService.getGameIds(puuid, server, 10, 0)

        // Get the game data
        return this.riotService.getGamesDetail(puuid, server, games_list)
    }
}
