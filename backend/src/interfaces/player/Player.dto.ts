import { ApiProperty } from '@nestjs/swagger'
import { ChampDto } from './Champ.dto'
import { MasteryDto } from './Mastery.dto'
import { RankStructured } from './Rank.dto'

export class PlayerDto {
    @ApiProperty({
        description: 'Summoner name',
        example: 'David',
    })
    alias: string

    @ApiProperty({
        description: 'URL to the image of the summoner',
        example: 'https://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/4411.png',
    })
    image: string

    @ApiProperty({
        description: 'Level of the summoner',
        example: '120',
    })
    level: number

    @ApiProperty({
        description: 'Rank information',
    })
    rank: RankStructured

    @ApiProperty({
        description: 'Champions most played',
        type: [ChampDto],
    })
    champs: ChampDto[]

    @ApiProperty({
        description: 'Champs with most mastery points',
        type: [MasteryDto],
    })
    masteries: MasteryDto[]
}
