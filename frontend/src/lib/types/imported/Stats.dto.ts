export interface Friend {
    name: string
    games: number
    wins: number
}

export interface ChampStats {
    championName: string
    games: number
    wins: number
    kda: number
    goldMin: number
    csMin: number
    visionMin: number
    killParticipation: number
    damageDealt: number
    damageTaken: number
}

export interface PositionStats {
    position: string
    games: number
    wins: number
}

export interface Stats {
    gamesUsed: string[]
    friends: Friend[]
    statsByChamp: ChampStats[]
    statsByPosition: PositionStats[]
}

