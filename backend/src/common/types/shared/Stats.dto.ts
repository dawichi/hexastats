import { ApiProperty } from '@nestjs/swagger'

export class Friend {
    @ApiProperty({
        description: 'Name of the player',
        example: 'Dawichii',
    })
    name: string

    @ApiProperty({
        description: 'Total of games played with that player',
        example: '4',
    })
    games: number

    @ApiProperty({
        description: 'Wins with that player',
        example: '2',
    })
    wins: number
}

export class ChampStats {
    @ApiProperty({
        description: 'Name of the champ',
        example: 'Aatrox',
    })
    championName: string

    @ApiProperty({
        description: 'Total of games played with that champ',
        example: '5',
    })
    games: number

    @ApiProperty({
        description: 'Wins with that champ',
        example: '',
    })
    wins: number

    @ApiProperty({
        description: 'Average KDA ',
        example: '2',
    })
    kda: number
}

export class PositionStats {
    @ApiProperty({
        description: 'Name of the position',
        example: "'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY'",
    })
    position: string

    @ApiProperty({
        description: 'Total of games played by position',
        example: '5',
    })
    games: number

    @ApiProperty({
        description: 'Wins by position',
        example: '8',
    })
    wins: number

    @ApiProperty({
        description: 'Winrate by position',
        example: '',
    })
    winRate: number
}

export class Stats {
    @ApiProperty({
        description: 'Number of games',
        example: '10',
    })
    numOfGames: number

    @ApiProperty({
        description: 'Friends Data',
        example: '',
        type: [Friend],
    })
    friends: Friend[]

    @ApiProperty({
        description: 'Champions Data',
        example: '',
        type: [ChampStats],
    })
    statsByChamp: ChampStats[]

    @ApiProperty({
        description: 'Position Data',
        example: '',
        type: [PositionStats],
    })
    statsByPosition: PositionStats[]
}
