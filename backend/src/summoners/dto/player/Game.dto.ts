export class Game {
    participantNumber: number
    gameDuration: number
    gameMode: string
    teams: Team[]
    participants: Participant[]
}

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
    win: boolean
    timePlayed: number
    teamPosition: string

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
        0: number
        1: number
        2: number
        3: number
        4: number
        5: number
        6: number
    }

    spells: {
        0: number
        1: number
    }
}
