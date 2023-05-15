interface ParticipantTitle {
    summonerName: string
    championName: string
}

export interface Kda {
    assists: number
    deaths: number
    kills: number
}

export interface Game {
    matchId: string
    gameCreation: number
    gameDuration: number
    win: boolean
    gameMode: string
    participantNumber: number
    teamPosition: string
    visionScore: number
    champLevel: number
    championName: string
    kda: Kda
    gold: number
    cs: number
    ward: number
    items: Array<number>
    spells: Array<number>
    perks: Array<string>
    participants: ParticipantTitle[]
}

