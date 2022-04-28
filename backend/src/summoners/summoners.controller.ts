import { Controller, Get, Logger, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SummonersService } from './summoners.service'
import { ChampDto, MasteryDto, PlayerBasicDto, PlayerDto } from './dto'
import { ChampsLimitQuery, GamesLimitQuery, MasteriesLimitQuery, QueueTypeQuery, ServerParam, SummonerNameParam } from './decorators'

@ApiTags('summoners')
@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    private readonly logger = new Logger(SummonersController.name)

    /**
     * ## Get summoner information by summoner name
     * @param {string} server Server name (e.g. 'euw1')
     * @param {string} summonerName Summoner name in the game
     * @param {number} masteriesLimit Limit of masteries to be returned (default: 7)
     * @returns {Promise<PlayerBasicDto>} Player object with all the information
     */
    @Get('/:server/:summonerName')
    @ApiOperation({
        summary: 'Get player info without champs',
        description: 'Returns the basic info to be shown as fast as possible in frontend, ignoring the matches step',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: PlayerBasicDto,
    })
    @ServerParam()
    @SummonerNameParam()
    @MasteriesLimitQuery()
    async getBasicSummoner(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('masteriesLimit') masteriesLimit = 7,
    ): Promise<PlayerBasicDto> {
        this.logger.verbose(`Started a basic search for: ${summonerName}`)

        const version = await this.summonersService.getLatestVersion()
        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const { solo, flex } = await this.summonersService.getRankData(summonerData.id, server)
        const masteries = await this.summonersService.getMasteries(summonerData.id, server, masteriesLimit)

        this.logger.verbose('Done!')

        return {
            alias: summonerData.name,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summonerData.profileIconId}.png`,
            level: summonerData.summonerLevel,
            rank: {
                solo,
                flex,
            },
            masteries,
        }
    }

    /**
     * ## Get masteries of a summoner
     * @param {string} server Server name (e.g. 'euw1')
     * @param {string} summonerName Summoner name in the game
     * @param {number} masteriesLimit Limit of masteries to be returned (default: 7)
     * @returns {Promise<MasteryDto[]>} Player object with all the information
     */
    @Get('/:server/:summonerName/masteries')
    @ApiOperation({
        summary: 'Get masteries',
        description: 'Returns the number of masteries requested, sort by most points',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: [MasteryDto],
    })
    @ServerParam()
    @SummonerNameParam()
    @MasteriesLimitQuery()
    async getMasteries(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('masteriesLimit') masteriesLimit = 7,
    ): Promise<MasteryDto[]> {
        this.logger.verbose(`Started a masteries search for: ${summonerName}`)

        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const masteries = await this.summonersService.getMasteries(summonerData.id, server, masteriesLimit)

        this.logger.verbose('Done!')

        return masteries
    }

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
    @Get('/:server/:summonerName/all')
    @ApiOperation({
        summary: 'Get player info',
        description: 'Returns all the information at a time from a single endopint. Not recommended for production, as it delays +5s',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: PlayerDto,
    })
    @ServerParam()
    @SummonerNameParam()
    @MasteriesLimitQuery()
    @GamesLimitQuery()
    @ChampsLimitQuery()
    @QueueTypeQuery()
    async getAllSummonerData(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('champsLimit') champsLimit = 7,
        @Query('gamesChecked') gamesLimit = 20,
        @Query('masteriesLimit') masteriesLimit = 7,
        @Query('queueType') queueType = 'ranked',
    ): Promise<PlayerDto> {
        this.logger.verbose(`Started a complete search for: ${summonerName}`)

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

    /**
     * ## Get summoner information by summoner name
     * @param {string} server Server name (e.g. 'euw1')
     * @param {string} summonerName Summoner name in the game
     * @param {number} champsLimit Limit of champions to be returned (default: 7)
     * @param {number} gamesLimit Limit of games to be checked (default: 50)
     * @param {string} queueType Specify to check only a specific queue ('ranked' or 'normal')
     * @returns {Promise<ChampDto[]>} Player object with all the information
     */
    @Get('/:server/:summonerName/champs')
    @ApiOperation({
        summary: 'Get champs info',
        description: 'Returns the champs information from a summoner. Loads the last X games and returns the stats calculated',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: [ChampDto],
    })
    @ServerParam()
    @SummonerNameParam()
    @GamesLimitQuery()
    @ChampsLimitQuery()
    @QueueTypeQuery()
    async getChampsData(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('champsLimit') champsLimit = 7,
        @Query('gamesChecked') gamesLimit = 20,
        @Query('queueType') queueType = 'ranked',
    ): Promise<ChampDto[]> {
        this.logger.verbose(`Started a complete search for: ${summonerName}`)

        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const champs = await this.summonersService.getChampsData(summonerData.puuid, server, gamesLimit, queueType, champsLimit)

        this.logger.verbose('Done!')

        return champs
    }
}
