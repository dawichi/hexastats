import { ApiProperty } from '@nestjs/swagger'

class Objective {
    first: boolean
    kills: number
}

class Ban {
    championId: number
    pickTurn: number
}

class Team {
    teamId: number
    win: boolean
    bans: Ban[]
    objectives: {
        baron: Objective
        champion: Objective
        dragon: Objective
        inhibitor: Objective
        riftHerald: Objective
        tower: Objective
    }
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
        description: 'URL to the images of the items used. (7º is the ward)',
        example: 'https://ddragon.leagueoflegends.com/cdn/10.3.1/img/item/1054.png',
    })
    items: {
        0: string
        1: string
        2: string
        3: string
        4: string
        5: string
        6: string
    }

    @ApiProperty({
        description: 'URL to the images of the spells used',
        example: 'https://ddragon.leagueoflegends.com/cdn/10.8.1/img/spell/SummonerFlash.png',
    })
    spells: {
        0: string
        1: string
    }
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
