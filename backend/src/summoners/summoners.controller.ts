import { Controller, Get, Logger, Param, Query } from '@nestjs/common'
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SummonersService } from './summoners.service'
import { PlayerDto } from './dto'

@ApiTags('summoners')
@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    private readonly logger = new Logger(SummonersController.name)

    /**
     * ## Get summoner information by summoner name
     * @param {string} server Server name (e.g. 'euw1')
     * @param {string} summonerName Summoner name in the game
     * @param {number} champsLimit Limit of champions to be returned (default: 7)
     * @param {number} gamesLimit Limit of games to be checked (default: 50)
     * @param {number} masteriesLimit Limit of masteries to be returned (default: 7)
     * @param {string} queueType Specify to check only a specific queue ('ranked' or 'normal')
     * @returns {Promise<PlayerDto>} Player object with all the information
     */
    @Get('/:server/:summonerName')
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: PlayerDto,
    })
    @ApiQuery({
        name: 'server',
        enum: ['euw1', 'na1', 'eun1', 'kr', 'jp1', 'br1', 'la1', 'la2', 'oc1', 'tr1', 'ru'],
    })
    async getSummonerByName(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('champsLimit') champsLimit = 7,
        @Query('gamesChecked') gamesLimit = 20,
        @Query('masteriesLimit') masteriesLimit = 7,
        @Query('queueType') queueType = 'ranked',
    ): Promise<PlayerDto> {
        this.logger.verbose(`Started a search for: ${summonerName}`)

        const version = await this.summonersService.getLatestVersion()
        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const { solo, flex } = await this.summonersService.getRankData(summonerData.id, server)
        const masteries = await this.summonersService.getMasteries(summonerData.id, server, masteriesLimit)
        const champs = await this.summonersService.getChampsData(summonerData.puuid, server, gamesLimit, queueType, champsLimit)

        this.logger.verbose('Done!')

        return {
            alias: summonerData.name,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summonerData.profileIconId}.png`,
            level: summonerData.summonerLevel,
            rank: {
                solo,
                flex,
            },
            champs,
            masteries,
        }
    }
}
