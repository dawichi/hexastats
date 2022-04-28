import { ApiProperty } from '@nestjs/swagger'

export class RankDto {
    @ApiProperty({
        description: 'Classification of the player in this queue',
        example: 'GOLD II',
    })
    rank: string

    @ApiProperty({
        description: 'Image URL to the league icon',
        example: 'https://opgg-static.akamaized.net/images/medals/gold_3.png?image=q_auto&image=q_auto,f_webp,w_auto&v=1651122764127',
    })
    image: string

    @ApiProperty({
        description: 'LP of the player in this league',
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

export class RankStructured {
    @ApiProperty({
        description: 'Classification in solo queue',
    })
    solo: RankDto

    @ApiProperty({
        description: 'Classification in flex queue',
    })
    flex: RankDto
}
