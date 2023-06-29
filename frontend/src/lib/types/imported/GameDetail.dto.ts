interface Objective {
    type: string
    first: boolean
    kills: number
}

interface Ban {
    championId: string
    pickTurn: number
}

interface Team {
    teamId: number
    win: boolean
    bans: Array<Ban>
    objectives: Array<Objective>
}

interface ChampData {
    champLevel: number
    championName: string
    largestMultiKill: number
    damageDealt: number
    damageTaken: number
}

interface MultiKill {
    doubles: number
    triples: number
    quadras: number
    pentas: number
}

interface Participant {
    summonerName: string
    visionScore: number
    champ: ChampData
    kills: number
    deaths: number
    assists: number
    multiKill: MultiKill
    gold: number
    cs: number
    ward: string
    items: Array<string>
    spells: Array<string>
    perks: Array<string>
}

export interface GameDetail {
    matchId: string
    gameCreation: number
    gameDuration: number
    participantNumber: number
    gameMode: string
    teams: Team[]
    participants: Participant[]
}

