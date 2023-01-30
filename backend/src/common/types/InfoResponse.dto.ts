import { ApiProperty } from '@nestjs/swagger'

export class InfoResponse {
    @ApiProperty({
        description: 'Summoner name',
        example: 'Dawichii',
    })
    name: string

    @ApiProperty({
        description: 'Summoner image',
        example: 'https://ddragon.leagueoflegends.com/cdn/11.6.1/img/profileicon/588.png',
    })
    image: string

    @ApiProperty({
        description: 'Summoner level',
        example: 30,
    })
    level: number
}
