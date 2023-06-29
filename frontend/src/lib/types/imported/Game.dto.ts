interface ParticipantTitle {
    summonerName: string
    championName: string
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
    kills: number
    deaths: number
    assists: number
    gold: number
    cs: number
    ward: number
    items: Array<number>
    spells: Array<number>
    perks: Array<string>
    participants: ParticipantTitle[]
}

