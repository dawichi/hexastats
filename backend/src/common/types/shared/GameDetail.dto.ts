import { ApiProperty } from '@nestjs/swagger'

class Objective {
    @ApiProperty({
        description: 'Type of Objective',
        enum: ['baron', 'champion', 'dragon', 'inhibitor', 'riftHerald', 'tower'],
    })
    type: string

    @ApiProperty({
        description: 'Was the first objective of this kind completed?',
        example: true,
    })
    first: boolean

    @ApiProperty({
        description: 'How many times',
        example: 3,
    })
    kills: number
}

class Ban {
    @ApiProperty({
        description: 'Champion banned',
        example: 'http://ddragon.leagueoflegends.com/cdn/13.13.1/img/champion/Varus.png',
    })
    championId: string | null

    @ApiProperty({
        description: 'Ban turn',
        example: 3,
    })
    pickTurn: number
}

class Team {
    @ApiProperty({
        description: 'Team ID',
        example: 123456,
    })
    teamId: number

    @ApiProperty({
        description: 'Won the game?',
        example: true,
    })
    win: boolean

    @ApiProperty({
        description: 'Bans of the team',
        type: [Ban],
    })
    bans: Array<Ban>

    @ApiProperty({
        description: 'Objectives completed by the team',
        type: [Objective],
    })
    objectives: Array<Objective>
}

class ChampData {
    @ApiProperty({
        description: 'Champion level',
        example: 12,
    })
    champLevel: number

    @ApiProperty({
        description: 'Champion Name',
        example: 'Aatrox',
    })
    championName: string

    @ApiProperty({
        description: 'Max kill combo',
        example: 3,
    })
    largestMultiKill: number

    @ApiProperty({
        description: 'Damage dealt to enemies',
        example: 20_000,
    })
    damageDealt: number

    @ApiProperty({
        description: 'Damage received',
        example: 20_000,
    })
    damageTaken: number
}

class MultiKill {
    @ApiProperty({
        description: 'Number of doubles',
        example: 2,
    })
    doubles: number

    @ApiProperty({
        description: 'Number of triples',
        example: 2,
    })
    triples: number

    @ApiProperty({
        description: 'Number of quadras',
        example: 2,
    })
    quadras: number

    @ApiProperty({
        description: 'Number of pentas',
        example: 2,
    })
    pentas: number
}

class Participant {
    @ApiProperty({
        description: 'Name of the player',
        example: 'Dawichii',
    })
    summonerName: string

    @ApiProperty({
        description: 'Team position',
        example: 'TOP',
    })
    teamPosition: string

    @ApiProperty({
        description: 'Won the game?',
        example: true,
    })
    win: boolean

    @ApiProperty({
        description: 'Vision score in the game',
        example: 12,
    })
    visionScore: number

    @ApiProperty({
        description: 'Champ related data (champName, damages, level, ...)',
    })
    champ: ChampData

    @ApiProperty({
        description: 'Kills',
        example: 4,
    })
    kills: number

    @ApiProperty({
        description: 'Deaths',
        example: 2,
    })
    deaths: number

    @ApiProperty({
        description: 'Assists',
        example: 0,
    })
    assists: number

    @ApiProperty({
        description: 'Multiple kills values',
    })
    multiKill: MultiKill

    @ApiProperty({
        description: 'gold earned',
        example: 420,
    })
    gold: number

    @ApiProperty({
        description: 'cs earned',
        example: 4200,
    })
    cs: number

    @ApiProperty({
        description: 'URLs to the image of the ward',
        example: 3340,
    })
    ward: number

    @ApiProperty({
        description: 'URLs to the images of the items used',
        example: [3157, 6655, 4645, 3020, 3165, 3089],
    })
    items: Array<number>

    @ApiProperty({
        description: 'URL to the images of the spells used',
        example: [8021, 8021],
    })
    spells: Array<number>

    @ApiProperty({
        description: 'URL to the images of the runes used',
        example: [
            'https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/7200_domination.png',
            'https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/domination/electrocute/electrocute.png',
        ],
    })
    perks: Array<string>
}

export class GameDetail {
    @ApiProperty({
        description: 'ID of the match',
        example: 'EUW_47234724',
    })
    matchId: string

    @ApiProperty({
        description: 'Date of the game in miliseconds',
        example: '3.0651651',
    })
    gameCreation: number

    @ApiProperty({
        description: 'Duration of the game in seconds',
        example: 1800,
    })
    gameDuration: number

    @ApiProperty({
        description: 'Index of the summoner in the participants list',
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        example: 0,
    })
    participantNumber: number

    @ApiProperty({
        description: 'Mode of the game (e.g. CLASSIC, ARAM, ...)',
        example: 'ARAM',
    })
    gameMode: string

    @ApiProperty({
        description: 'List with the 2 items of the game',
        type: [Team],
    })
    teams: Team[]

    @ApiProperty({
        description: 'List of 10 participants in the game with its stats',
        type: [Participant],
    })
    participants: Participant[]
}
