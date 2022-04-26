import { ApiProperty } from '@nestjs/swagger'

export class Rank {
    @ApiProperty()
    rank: string

    @ApiProperty()
    image: string

    @ApiProperty()
    lp: number

    @ApiProperty()
    win: number

    @ApiProperty()
    lose: number

    @ApiProperty()
    winrate: number
}

export class Champ {
    name: string

    @ApiProperty()
    image: string

    @ApiProperty()
    games: number

    @ApiProperty()
    winrate: number

    @ApiProperty()
    kda: number

    @ApiProperty()
    kills: number

    @ApiProperty()
    deaths: number

    @ApiProperty()
    assists: number

    @ApiProperty()
    cs: number

    @ApiProperty()
    csmin: number

    @ApiProperty()
    gold: number

    @ApiProperty()
    max_kills: number

    @ApiProperty()
    max_deaths: number

    @ApiProperty()
    avg_damage_dealt: number

    @ApiProperty()
    avg_damage_taken: number

    @ApiProperty()
    double_kills: number

    @ApiProperty()
    triple_kills: number

    @ApiProperty()
    quadra_kills: number

    @ApiProperty()
    penta_kills: number
}

export class Mastery {
    name: string

    @ApiProperty()
    image: string

    @ApiProperty()
    level: number

    @ApiProperty()
    points: number
}

export class Player {
    @ApiProperty({
        description: 'Summoner name',
        type: String,
        example: 'David',
    })
    alias: string

    @ApiProperty({
        description: 'URL to the image of the summoner',
        type: String,
        example: 'https://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/4411.png',
    })
    image: string

    @ApiProperty({
        description: 'Level of the summoner',
        type: Number,
        example: '120',
    })
    level: number

    @ApiProperty()
    rank: {
        solo: Rank
        flex: Rank
    }

    champs: Champ[]
    masteries: Mastery[]
}
