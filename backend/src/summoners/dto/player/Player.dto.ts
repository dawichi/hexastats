import { ApiProperty } from '@nestjs/swagger'
import { Game } from './Game.dto'
import { Mastery } from './Mastery.dto'
import { RankStructure } from './Rank.dto'

export class Player {
    @ApiProperty({
        description: 'Summoner name',
        example: 'David',
    })
    alias: string

    @ApiProperty({
        description: 'Server of the player',
        example: 'euw1',
    })
    server: string

    @ApiProperty({
        description: 'URL to the image',
        example: 'https://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/4411.png',
    })
    image: string

    @ApiProperty({
        description: 'Level value',
        example: '120',
    })
    level: number

    @ApiProperty({
        description: 'Rank information',
    })
    rank: RankStructure

    @ApiProperty({
        description: 'Last games array',
        type: [Game],
    })
    games: any[]

    @ApiProperty({
        description: 'Masteries array, sorted by most points',
        type: [Mastery],
    })
    masteries: Mastery[]
}
