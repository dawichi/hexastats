import { ApiProperty } from '@nestjs/swagger'

export class Rank {
    @ApiProperty({
        description: 'Classification of the player in this queue',
        example: 'GOLD II',
    })
    rank: string

    @ApiProperty({
        description: 'Image URL to the league icon',
        example: 'gold.png',
    })
    image: string

    @ApiProperty({
        description: 'League Points of the player in this league',
        example: 86,
    })
    lp: number

    @ApiProperty({
        description: 'Wins of the player in this league',
        example: 20,
    })
    win: number

    @ApiProperty({
        description: 'Loses of the player in this league',
        example: 20,
    })
    lose: number

    @ApiProperty({
        description: 'Winrate of the player in this league',
        example: 50,
    })
    winrate: number
}

export class RankStructure {
    @ApiProperty({
        description: 'Classification in solo queue',
    })
    solo: Rank

    @ApiProperty({
        description: 'Classification in flex queue',
    })
    flex: Rank

    @ApiProperty({
        description: 'Classification in Arena/Cherry queue',
    })
    arena: Rank
}
