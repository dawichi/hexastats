import { Controller, Get, Param, Query } from '@nestjs/common'
import { Player } from 'src/interfaces'
import { SummonersService } from './summoners.service'

@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    @Get('/:server/:summonerName')
    async getSummonerByName(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('champsLimit') champsLimit = 7,
        @Query('gamesChecked') gamesCheked = 10,
        @Query('masteriesLimit') masteriesLimit = 7,
        @Query('queueType') queueType = '',
    ): Promise<Player> {
        const version = await this.summonersService.getLatestVersion()
        const summoner_data = await this.summonersService.getSummonerDataByName(summonerName, server)
        const { solo, flex } = await this.summonersService.getRankData(summoner_data.id, server)
        const masteries = await this.summonersService.getMasteries(summoner_data.id, server, masteriesLimit)
        const champs = await this.summonersService.getGames(summoner_data.puuid, server, gamesCheked, queueType, champsLimit)

        return {
            alias: summoner_data.name,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summoner_data.profileIconId}.png`,
            level: summoner_data.summonerLevel,
            rank: {
                solo,
                flex,
            },
            champs,
            masteries,
        }
    }
}
