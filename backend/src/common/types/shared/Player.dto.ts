import { ApiProperty } from '@nestjs/swagger'
import { RankStructure } from './Rank.dto'

export class Player {
    @ApiProperty({
        description: 'Summoner name',
        example: 'Jose',
    })
    alias: string

    @ApiProperty({
        description: 'Server of the player',
        example: 'euw1',
    })
    server: string

    @ApiProperty({
        description: 'URL to the image',
        example: 'https://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/4232.png',
    })
    image: string

    @ApiProperty({
        description: 'Level value',
        example: '420',
    })
    level: number

    @ApiProperty({
        description: 'Riot ID summoner name',
        example: 'Jose',
    })
    riotIdName: string

    @ApiProperty({
        description: 'Riot Summoner #Tag',
        example: 'EUW',
    })
    riotIdTag: string
}

export class RankData extends Player {
    @ApiProperty({
        description: 'Rank information',
    })
    rank: RankStructure
}
