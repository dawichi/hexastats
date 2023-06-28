interface RecordValue {
    value: number
    matchId: string
}

export interface Record {
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

