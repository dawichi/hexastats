import { ApiProperty } from '@nestjs/swagger'

export class Champ {
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
        description: 'Number of games played with this champ',
        example: 72,
    })
    games: number

    @ApiProperty({
        description: 'Winrate of the champ',
        example: 50,
    })
    winrate: number

    @ApiProperty({
        description: 'Average KDA with this champ',
        example: 2.66,
    })
    kda: number

    @ApiProperty({
        description: 'Average kills with this champ',
        example: 9.9,
    })
    kills: number

    @ApiProperty({
        description: 'Average deaths with this champ',
        example: 5.4,
    })
    deaths: number

    @ApiProperty({
        description: 'Average assists with this champ',
        example: 4.5,
    })
    assists: number

    @ApiProperty({
        description: 'Average total CS with this champ',
        example: 276.4,
    })
    cs: number

    @ApiProperty({
        description: 'Average CS per minute with this champ',
        example: 8.8,
    })
    csmin: number

    @ApiProperty({
        description: 'Average gold with this champ',
        example: 15926,
    })
    gold: number

    @ApiProperty({
        description: 'Record of kills in a game with this champ',
        example: 28,
    })
    maxKills: number

    @ApiProperty({
        description: 'Record of deaths in a game with this champ',
        example: 14,
    })
    maxDeaths: number

    @ApiProperty({
        description: 'Average damage dealt with this champ',
        example: 230_827,
    })
    avgDamageDealt: number

    @ApiProperty({
        description: 'Average damage taken with this champ',
        example: 32_820,
    })
    avgDamageTaken: number

    @ApiProperty({
        description: 'Total number of double kills with this champ',
        example: 82,
    })
    doubleKills: number

    @ApiProperty({
        description: 'Total number of triple kills with this champ',
        example: 14,
    })
    tripleKills: number

    @ApiProperty({
        description: 'Total number of quadra kills with this champ',
        example: 2,
    })
    quadraKills: number

    @ApiProperty({
        description: 'Total number of penta kills with this champ',
        example: 1,
    })
    pentaKills: number

    @ApiProperty({
        description: 'Average vision score with this champ',
        example: 1,
    })
    visionScore: number

    @ApiProperty({
        description: 'Average game duration with this champ (in seconds)',
        example: 2045,
    })
    timePlayed: number

    @ApiProperty({
        description: 'Average turret kills with this champ',
        example: 2.5,
    })
    turretKills: number
}
