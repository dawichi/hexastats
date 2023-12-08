import type { Augment } from './Augment.dto'
import type { Perks } from './Perks.dto'

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
    participants: ParticipantTitle[]
}

export interface GameNormal extends Game {
    spells: Array<number>
    perks: Perks
}

export interface GameArena extends Game {
    augments: Array<Augment>
    placement: number
    subteamPlacement: number
}

