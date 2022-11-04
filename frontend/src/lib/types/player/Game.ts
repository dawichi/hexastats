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

interface Participant {
    summonerName: string
    win: boolean
    timePlayed: number
    teamPosition: string
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

    items: {
        0: string
        1: string
        2: string
        3: string
        4: string
        5: string
        6: string
    }

    spells: {
        0: string
        1: string
    }
}

/**
 * ## Game information
 * Contains all the information about a game
 */
export interface Game {
    matchId: string
    participantNumber: number
    gameDuration: number
    gameMode: string
    teams: Team[]
    participants: Participant[]
}

