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
}

export interface PositionStats {
    position: string
    games: number
    wins: number
}

export interface Stats {
    numOfGames: number
    friends: Friend[]
    statsByChamp: ChampStats[]
    statsByPosition: PositionStats[]
}
