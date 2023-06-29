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

interface RecordValue {
    value: number
    matchId: string
}

export interface Records {
    kda: RecordValue
    kills: RecordValue
    deaths: RecordValue
    assists: RecordValue
    gold: RecordValue
    goldPerMin: RecordValue
    cs: RecordValue
    csPerMin: RecordValue
    vision: RecordValue
    visionPerMin: RecordValue
    matchDuration: RecordValue
    doubleKills: RecordValue
    tripleKills: RecordValue
    quadraKills: RecordValue
    pentaKills: RecordValue
}

export interface Stats {
    gamesUsed: string[]
    friends: Friend[]
    statsByChamp: ChampStats[]
    statsByPosition: PositionStats[]
    records: Records
}

