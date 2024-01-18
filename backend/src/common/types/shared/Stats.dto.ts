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

    @ApiProperty({
        description: 'RiotId summoner Name',
        example: 'Jose',
    })
    riotIdGameName: string

    @ApiProperty({
        description: 'RiotId summoner #tag',
        example: '#EUW',
    })
    riotIdTagLine: string
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
        description: 'Average KDA',
        example: '2',
    })
    kda: number

    @ApiProperty({
        description: 'Average Gold',
        example: '2',
    })
    goldMin: number

    @ApiProperty({
        description: 'Average CS',
        example: '2',
    })
    csMin: number

    @ApiProperty({
        description: 'Average Vision',
        example: '2',
    })
    visionMin: number

    @ApiProperty({
        description: 'Average Kill Participation',
        example: '2',
    })
    killParticipation: number

    @ApiProperty({
        description: 'Average Damage Dealt',
        example: '2',
    })
    damageDealt: number

    @ApiProperty({
        description: 'Average Damage Taken',
        example: '2',
    })
    damageTaken: number
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
}

export class RecordValue {
    @ApiProperty({
        description: 'Max or min value of the stat',
        example: 4,
    })
    value: number

    @ApiProperty({
        description: 'Match ID of the record',
        example: 'EUW1_6491757432',
    })
    matchId: string

    @ApiProperty({
        description: 'Name of the champion to use in the image',
        example: 'Aatrox',
    })
    championName: string

    @ApiProperty({
        description: 'Game mode of the record',
        example: 'ARAM',
    })
    gameMode: string

    @ApiProperty({
        description: 'Date of the game in miliseconds',
        example: 123456,
    })
    gameCreation: number

    @ApiProperty({
        description: 'Duration of the game in miliseconds',
        example: 123456,
    })
    gameDuration: number
}

export class Records {
    kda: RecordValue
    kills: RecordValue
    deaths: RecordValue
    assists: RecordValue
    gold: RecordValue
    goldPerMin: RecordValue
    cs: RecordValue
    csPerMin: RecordValue
    vision: RecordValue
    visionPerMin: RecordValue
    gameDuration: RecordValue
    doubleKills: RecordValue
    tripleKills: RecordValue
    quadraKills: RecordValue
    pentaKills: RecordValue
}

export class Stats {
    @ApiProperty({
        description: 'Games used to calculate the stats',
        example: '["EUW1_6464675439", "EUW1_6464675439"]',
    })
    gamesUsed: string[]

    @ApiProperty({
        description: 'Friends Data',
        type: [Friend],
    })
    friends: Friend[]

    @ApiProperty({
        description: 'Champions Data',
        type: [ChampStats],
    })
    statsByChamp: ChampStats[]

    @ApiProperty({
        description: 'Position Data',
        type: [PositionStats],
    })
    statsByPosition: PositionStats[]

    @ApiProperty({
        description: 'Record Data',
        type: Records,
    })
    records: Records

    @ApiProperty({
        description: 'Lowest record Data',
        type: Records,
    })
    lowRecords: Records
}
