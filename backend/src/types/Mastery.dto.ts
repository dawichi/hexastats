import { ApiProperty } from '@nestjs/swagger'

export class Mastery {
    @ApiProperty({
        description: 'Name of the champ',
        example: 'Aatrox',
    })
    name: string

    @ApiProperty({
        description: 'URL to the image of the champ',
        example: 'https://ddragon.leagueoflegends.com/cdn/10.8.1/img/champion/Aatrox.png',
    })
    image: string

    @ApiProperty({
        description: 'Mastery level (0-7)',
        example: 7,
    })
    level: number

    @ApiProperty({
        description: 'Points with the champ',
        example: 120_000,
    })
    points: number

    @ApiProperty({
        description: 'Chest granted',
        example: 0,
    })
    chestGranted: boolean
}
