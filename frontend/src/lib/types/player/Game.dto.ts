interface Objective {
    first: boolean
    kills: number
}

interface Team {
    teamId: number
    win: boolean
    bans: [
        {
            championId: number
            pickTurn: number
        }
    ]
    objectives: {
        baron: Objective
        champion: Objective
        dragon: Objective
        inhibitor: Objective
        riftHerald: Objective
        tower: Objective
    }
}

export interface ParticipantDto {
    summonerName: string
    win: boolean
    timePlayed: number
    teamPosition: 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY'
    visionScore: number

    champ: {
        champLevel: number
        championName: string
        largestMultiKill: number
        damageDealt: number
        damageTaken: number
    }

    kda: {
        assists: number
        deaths: number
        kills: number
    }

    multiKill: {
        doubles: number
        triples: number
        quadras: number
        pentas: number
    }

    farm: {
        gold: number
        cs: number
    }

    ward: string
    items: Array<string>
    spells: Array<string>
}

/**
 * ## Game information
 * Contains all the information about a game
 */
export interface GameDto {
    matchId: string
    participantNumber: number
    gameDuration: number
    gameMode: string
    teams: Team[]
    participants: ParticipantDto[]
}

