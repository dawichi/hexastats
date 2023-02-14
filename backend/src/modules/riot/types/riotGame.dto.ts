interface RiotParticipantDto {
    assists: number
    baronKills: number
    bountyLevel: number
    champExperience: number
    champLevel: number
    championId: number
    championName: string
    damageDealtToBuildings: number
    damageDealtToObjectives: number
    damageDealtToTurrets: number
    damageSelfMitigated: number
    deaths: number
    doubleKills: number
    dragonKills: number
    firstBloodKill: boolean
    firstTowerAssist: boolean
    firstTowerKill: boolean
    gameEndedInEarlySurrender: boolean
    gameEndedInSurrender: boolean
    goldEarned: number
    goldSpent: number
    individualPosition: string
    inhibitorKills: number
    inhibitorTakedowns: number
    inhibitorTakedownsTotal: number
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
    neutralMinionsKilled: number
    nexusKills: number
    nexusLost: number
    nexusTakedowns: number
    nexusTakedownsTotal: number
    objectivesStolen: number
    objectivesStolenAssists: number
    participantId: number
    pentaKills: number
    physicalDamageDealt: number
    physicalDamageDealtToChampions: number
    physicalDamageTaken: number
    profileIcon: number
    puuid: string
    quadraKills: number
    role: string
    sightWardsBoughtInGame: number
    spell1Casts: number
    spell2Casts: number
    spell3Casts: number
    spell4Casts: number
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
    totalDamageDealt: number
    totalDamageDealtToChampions: number
    totalDamageShieldedOnTeammates: number
    totalDamageTaken: number
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
    turretTakedownsTotal: number
    turretsLost: number
    unrealKills: number
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

interface RiotObjectiveDto {
    first: boolean
    kills: number
}

interface RiotTeamDto {
    bans: {
        championId: number
        pickTurn: number
    }[]
    objectives: {
        baron: RiotObjectiveDto
        champion: RiotObjectiveDto
        dragon: RiotObjectiveDto
        inhibitor: RiotObjectiveDto
        riftHerald: RiotObjectiveDto
        tower: RiotObjectiveDto
    }
    teamId: number
}

export interface RiotGameDto {
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
        participants: RiotParticipantDto[]
        platformId: string
        queueId: number
        teams: RiotTeamDto[]
    }
}
