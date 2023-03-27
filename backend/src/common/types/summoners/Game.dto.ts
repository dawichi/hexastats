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
        description: 'KDA values',
    })
    kda: Kda

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

const example: Game = {
    matchId: 'EUW1_6324747333',
    win: false,
    gameCreation: 1679400614423,
    participantNumber: 5,
    gameDuration: 1331,
    gameMode: 'ARAM',
    teamPosition: '',
    visionScore: 0,
    champLevel: 18,
    kda: {
        assists: 25,
        deaths: 8,
        kills: 9,
    },
    cs: 25,
    ward: 'http://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/2052.png',
    items: [
        'http://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/6655.png',
        'http://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/3102.png',
        'http://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/3089.png',
        'http://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/3020.png',
        'http://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/4630.png',
        'http://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/1026.png',
    ],
    spells: [
        'http://ddragon.leagueoflegends.com/cdn/12.8.1/img/spell/SummonerFlash.png',
        'http://ddragon.leagueoflegends.com/cdn/12.8.1/img/spell/SummonerSnowball.png',
    ],
    perks: [
        'https://ddragon.canisback.com/img/perk-images/Styles/7200_Domination.png',
        'https://ddragon.canisback.com/img/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png',
    ],
    participants: [
        {
            summonerName: 'Teddy Big Plays',
            championName: 'Ryze',
        },
        {
            summonerName: 'Ninno47',
            championName: 'Ezreal',
        },
        {
            summonerName: 'SAN PELLEGRlNO',
            championName: 'AurelionSol',
        },
        {
            summonerName: 'Emchupii',
            championName: 'Xayah',
        },
        {
            summonerName: 'agusboto',
            championName: 'Rumble',
        },
        {
            summonerName: 'Chibis',
            championName: 'Malzahar',
        },
        {
            summonerName: 'MrKentzy',
            championName: 'Chogath',
        },
        {
            summonerName: 'Kernirino',
            championName: 'Vi',
        },
        {
            summonerName: 'Dawichii',
            championName: 'Teemo',
        },
        {
            summonerName: 'alexwwe',
            championName: 'Evelynn',
        },
    ],
}
