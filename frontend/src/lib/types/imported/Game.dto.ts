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
    isEarlySurrender: boolean
    visionScore: number
    champLevel: number
    championName: string
    kills: number
    deaths: number
    assists: number
    doubleKills: number
    tripleKills: number
    quadraKills: number
    pentaKills: number
    gold: number
    cs: number
    ward: number
    killParticipation: number
    damageDealt: number
    damageTaken: number
    items: Array<number>
    spells: Array<number>
    perks: Array<string>
    participants: ParticipantTitle[]
}

