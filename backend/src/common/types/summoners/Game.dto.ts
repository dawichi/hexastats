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

export class Kda {
    @ApiProperty({
        description: 'Assists',
        example: 0,
    })
    assists: number

    @ApiProperty({
        description: 'Deaths',
        example: 2,
    })
    deaths: number

    @ApiProperty({
        description: 'Kills',
        example: 4,
    })
    kills: number
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
        description: 'KDA values',
    })
    kda: Kda

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
        description: 'URLs to the image of the ward',
        example: 'http://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/3340.png',
    })
    ward: string

    @ApiProperty({
        description: 'URLs to the images of the items used',
        example: [
            'http://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/3157.png',
            'http://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/6655.png',
            'http://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/4645.png',
            'http://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/3020.png',
            'http://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/3165.png',
            'http://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/3089.png',
        ],
    })
    items: Array<string>

    @ApiProperty({
        description: 'URL to the images of the spells used',
        example: [
            'http://ddragon.leagueoflegends.com/cdn/12.8.1/img/spell/SummonerFlash.png',
            'http://ddragon.leagueoflegends.com/cdn/12.8.1/img/spell/SummonerHaste.png',
        ],
    })
    spells: Array<string>

    @ApiProperty({
        description: 'URL to the images of the runes used',
        example: [
            'https://ddragon.canisback.com/img/perk-images/Styles/7200_Domination.png',
            'https://ddragon.canisback.com/img/perk-images/Styles/Domination/Electrocute/Electrocute.png',
        ],
    })
    perks: Array<string>

    @ApiProperty({
        description: 'List of 10 participants in the game with its stats',
        type: [ParticipantTitle],
    })
    participants: ParticipantTitle[]
}
