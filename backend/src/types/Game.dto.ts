import { ApiProperty } from '@nestjs/swagger'

class Objective {
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
        description: 'Champion ID of the banned champion',
        example: 420,
    })
    championId: number

    @ApiProperty({
        description: 'Ban turn',
        example: 3,
    })
    pickTurn: number
}

class Objectives {
    @ApiProperty({
        description: 'Baron kills',
        type: Objective,
    })
    baron: Objective

    @ApiProperty({
        description: 'Dragon kills',
        type: Objective,
    })
    dragon: Objective

    @ApiProperty({
        description: 'Tower kills',
        type: Objective,
    })
    tower: Objective
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
    bans: Ban[]

    @ApiProperty({
        description: 'Objectives completed by the team',
        type: Objectives,
    })
    objectives: Objectives
}

class Participant {
    @ApiProperty({
        description: 'Name of the champion used',
        example: 'Aatrox',
    })
    summonerName: string

    @ApiProperty({
        description: 'Win or lose',
        example: false,
    })
    win: boolean

    @ApiProperty({
        description: 'Time played in seconds',
        example: 1200,
    })
    timePlayed: number

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
        description: 'Champ related data (champName, damages, level, ...)',
        type: 'object',
        example: {
            champName: 'Aatrox',
            level: 12,
            largestMultiKill: 2,
            damageDealt: 12000,
            damageTaken: 12000,
        },
    })
    champ: {
        champLevel: number
        championName: string
        largestMultiKill: number
        damageDealt: number
        damageTaken: number
    }

    @ApiProperty({
        description: 'KDA values',
        type: 'object',
        example: {
            assists: 0,
            deaths: 2,
            kills: 4,
        },
    })
    kda: {
        assists: number
        deaths: number
        kills: number
    }

    @ApiProperty({
        description: 'Multiple kills values',
        type: 'object',
        example: {
            doubles: 2,
            triples: 2,
            quadra: 2,
            penta: 2,
        },
    })
    multiKill: {
        doubles: number
        triples: number
        quadras: number
        pentas: number
    }

    @ApiProperty({
        description: 'Gold and CS values',
        type: 'object',
        example: {
            gold: 12000,
            cs: 12000,
        },
    })
    farm: {
        gold: number
        cs: number
    }

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
}

export class Game {
    @ApiProperty({
        description: 'ID of the match',
        example: 'EUW_47234724',
    })
    matchId: string

    @ApiProperty({
        description: 'Index of the summoner in the participants list',
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        example: 0,
    })
    participantNumber: number

    @ApiProperty({
        description: 'Duration of the game in seconds',
        example: 1800,
    })
    gameDuration: number

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
