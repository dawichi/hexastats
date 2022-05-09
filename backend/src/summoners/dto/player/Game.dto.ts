export class Game {
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
    lane: string

    champ: {
        champLevel: number
        championName: string
        largestMultiKill: number
        totalDamageDealtToChampions: number
        totalDamageTaken: number
    }

    kda: {
        assists: number
        deaths: number
        kills: number
    }

    multiKill: {
        doubleKills: number
        tripleKills: number
        quadraKills: number
        pentaKills: number
    }

    farm: {
        goldEarned: number
        neutralMinionsKilled: number
        totalMinionsKilled: number
    }

    items: {
        item0: number
        item1: number
        item2: number
        item3: number
        item4: number
        item5: number
        item6: number
    }

    spells: {
        summoner1Id: number
        summoner2Id: number
    }
}
