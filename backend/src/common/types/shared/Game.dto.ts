import { ApiProperty } from '@nestjs/swagger'

class ParticipantTitle {
    @ApiProperty({
        description: 'Name of the player',
        example: 'Hide on bush',
    })
    summonerName: string

    @ApiProperty({
        description: 'Name of the champion used',
        example: 'Aatrox',
    })
    championName: string
}

export class Game {
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
        description: 'win or lose',
        example: 'true',
    })
    win: boolean

    @ApiProperty({
        description: 'Mode of the game (e.g. CLASSIC, ARAM, ...)',
        example: 'ARAM',
    })
    gameMode: string

    @ApiProperty({
        description: 'Index of the summoner in the participants list',
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        example: 0,
    })
    participantNumber: number

    @ApiProperty({
        description: 'Team position',
        example: 'TOP',
    })
    teamPosition: string

    @ApiProperty({
        description: 'Vision score in the game',
        example: 12,
    })
    visionScore: number

    @ApiProperty({
        description: 'Champ level',
        example: 16,
    })
    champLevel: number

    @ApiProperty({
        description: 'Champ Name',
        example: 'Aatrox',
    })
    championName: string

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
        description: 'Double kills in the game',
        example: 2,
    })
    doubleKills: number

    @ApiProperty({
        description: 'Triple kills in the game',
        example: 3,
    })
    tripleKills: number

    @ApiProperty({
        description: 'Quadra kills in the game',
        example: 4,
    })
    quadraKills: number

    @ApiProperty({
        description: 'Penta kills in the game',
        example: 5,
    })
    pentaKills: number

    @ApiProperty({
        description: 'gold earned',
        example: 420,
    })
    gold: number

    @ApiProperty({
        description: 'CS value',
        example: 138,
    })
    cs: number

    @ApiProperty({
        description: 'ID of the trinket used',
        example: 3340,
    })
    ward: number

    @ApiProperty({
        description: 'IDs of the items used',
        example: [3157, 6655, 4645, 3020, 3165, 3089],
    })
    items: Array<number>

    @ApiProperty({
        description: 'IDs of the spells used',
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

    @ApiProperty({
        description: 'List of 10 participants in the game with its stats',
        type: [ParticipantTitle],
    })
    participants: ParticipantTitle[]
}
