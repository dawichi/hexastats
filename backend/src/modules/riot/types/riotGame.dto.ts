interface RiotParticipant {
    allInPings: number
    assistMePings: number
    assists: number
    baitPings: number
    baronKills: number
    basicPings: number
    bountyLevel: number
    champExperience: number
    champLevel: number
    championId: number
    championName: string
    championTransform: number
    commandPings: number
    consumablesPurchased: number
    damageDealtToBuildings: number
    damageDealtToObjectives: number
    damageDealtToTurrets: number
    damageSelfMitigated: number
    dangerPings: number
    deaths: number
    detectorWardsPlaced: number
    doubleKills: number
    dragonKills: number
    eligibleForProgression: boolean
    enemyMissingPings: number
    enemyVisionPings: number
    firstBloodAssist: boolean
    firstBloodKill: boolean
    firstTowerAssist: boolean
    firstTowerKill: boolean
    gameEndedInEarlySurrender: boolean
    gameEndedInSurrender: boolean
    getBackPings: number
    goldEarned: number
    goldSpent: number
    holdPings: number
    individualPosition: string
    inhibitorKills: number
    inhibitorTakedowns: number
    inhibitorsLost: number
    item0: number
    item1: number
    item2: number
    item3: number
    item4: number
    item5: number
    item6: number
    itemsPurchased: number
    killingSprees: number
    kills: number
    lane: string
    largestCriticalStrike: number
    largestKillingSpree: number
    largestMultiKill: number
    longestTimeSpentLiving: number
    magicDamageDealt: number
    magicDamageDealtToChampions: number
    magicDamageTaken: number
    needVisionPings: number
    neutralMinionsKilled: number
    nexusKills: number
    nexusLost: number
    nexusTakedowns: number
    objectivesStolen: number
    objectivesStolenAssists: number
    onMyWayPings: number
    participantId: number
    pentaKills: number
    physicalDamageDealt: number
    physicalDamageDealtToChampions: number
    physicalDamageTaken: number
    placement: number
    playerAugment1: number
    playerAugment2: number
    playerAugment3: number
    playerAugment4: number
    playerSubteamId: number
    profileIcon: number
    pushPings: number
    puuid: string
    quadraKills: number
    riotIdName: string
    riotIdTagline: string
    role: string
    sightWardsBoughtInGame: number
    spell1Casts: number
    spell2Casts: number
    spell3Casts: number
    spell4Casts: number
    subteamPlacement: number
    summoner1Casts: number
    summoner1Id: number
    summoner2Casts: number
    summoner2Id: number
    summonerId: string
    summonerLevel: number
    summonerName: string
    teamEarlySurrendered: boolean
    teamId: number
    teamPosition: string
    timeCCingOthers: number
    timePlayed: number
    totalAllyJungleMinionsKilled: number
    totalDamageDealt: number
    totalDamageDealtToChampions: number
    totalDamageShieldedOnTeammates: number
    totalDamageTaken: number
    totalEnemyJungleMinionsKilled: number
    totalHeal: number
    totalHealsOnTeammates: number
    totalMinionsKilled: number
    totalTimeCCDealt: number
    totalTimeSpentDead: number
    totalUnitsHealed: number
    tripleKills: number
    trueDamageDealt: number
    trueDamageDealtToChampions: number
    trueDamageTaken: number
    turretKills: number
    turretTakedowns: number
    turretsLost: number
    unrealKills: number
    visionClearedPings: number
    visionScore: number
    visionWardsBoughtInGame: number
    wardsKilled: number
    wardsPlaced: number
    win: boolean
    perks: {
        statPerks: {
            defense: number
            flex: number
            offense: number
        }
        styles: [
            {
                description: string
                selections: [
                    {
                        perk: number
                        var1: number
                        var2: number
                        var3: number
                    },
                ]
                style: number
            },
        ]
    }
}

interface RiotObjective {
    first: boolean
    kills: number
}

interface RiotTeam {
    bans: Array<{
        championId: number
        pickTurn: number
    }>
    objectives: {
        baron: RiotObjective
        champion: RiotObjective
        dragon: RiotObjective
        inhibitor: RiotObjective
        riftHerald: RiotObjective
        tower: RiotObjective
    }
    teamId: number
    win: boolean
}

export interface RiotGame {
    metadata: {
        dataVersion: string
        matchId: string
        participants: string[]
    }
    info: {
        gameCreation: number
        gameDuration: number
        gameEndTimestamp: number
        gameId: number
        gameMode: string
        gameName: string
        gameStartTimestamp: number
        gameType: string
        gameVersion: string
        mapId: number
        participants: RiotParticipant[]
        platformId: string
        queueId: number
        teams: RiotTeam[]
    }
}
