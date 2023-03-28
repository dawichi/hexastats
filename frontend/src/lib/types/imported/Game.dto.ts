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
    participantNumber: number
    gameCreation: number
    gameDuration: number
    gameMode: string
    win: boolean
    teamPosition: string
    visionScore: number
    champLevel: number
    championName: string
    kda: Kda
    cs: number
    gold: number
    ward: string
    items: Array<string>
    spells: Array<string>
    perks: Array<string>
    participants: ParticipantTitle[]
}
