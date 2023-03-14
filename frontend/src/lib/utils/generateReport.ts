import type { ReportDto, StatRow } from '$lib/context/reports'
import type { SummonerDto } from '$lib/types'

export function generateReport(player: SummonerDto): ReportDto {
    const base: StatRow = {
        games: 0,
        wins: 0,
        kda: {
            kills: 0,
            deaths: 0,
            assists: 0,
        },
        farm: {
            cs: 0,
            csmin: 0,
            gold: 0,
        },
        multiKill: {
            doubles: 0,
            triples: 0,
            quadras: 0,
            pentas: 0,
        },
        stats: {
            maxKills: 0,
            maxDeaths: 0,
            avgDamageDealt: 0,
            avgDamageTaken: 0,
            visionScore: 0,
        },
    }
    const stats_by_position: Record<string, StatRow> = {
        TOP: { ...base },
        JUNGLE: { ...base },
        MIDDLE: { ...base },
        BOTTOM: { ...base },
        UTILITY: { ...base },
    }

    const minsPlayed: Record<string, number> = {}

    for (const game of player.games) {
        const position = game.participants[game.participantNumber].teamPosition || 'MIDDLE'
        const acc = stats_by_position[position]
        const data = game.participants[game.participantNumber]
        minsPlayed[position] = minsPlayed[position] ? minsPlayed[position] + game.gameDuration / 60 : game.gameDuration / 60

        acc.games++
        acc.wins += data.win ? 1 : 0
        acc.kda = {
            kills: (acc.kda.kills += data.kda.kills),
            deaths: (acc.kda.deaths += data.kda.deaths),
            assists: (acc.kda.assists += data.kda.assists),
        }

        acc.farm = {
            cs: (acc.farm.cs += data.farm.cs),
            csmin: 0,
            gold: (acc.farm.gold += data.farm.gold),
        }
        acc.multiKill = {
            doubles: (acc.multiKill.doubles += data.multiKill.doubles),
            triples: (acc.multiKill.triples += data.multiKill.triples),
            quadras: (acc.multiKill.quadras += data.multiKill.quadras),
            pentas: (acc.multiKill.pentas += data.multiKill.pentas),
        }
        acc.stats = {
            maxKills: acc.stats.maxKills < data.kda.kills ? data.kda.kills : acc.stats.maxKills,
            maxDeaths: acc.stats.maxDeaths < data.kda.deaths ? data.kda.deaths : acc.stats.maxDeaths,
            avgDamageDealt: (acc.stats.avgDamageDealt += data.champ.damageDealt),
            avgDamageTaken: (acc.stats.avgDamageTaken += data.champ.damageTaken),
            visionScore: (acc.stats.visionScore += data.visionScore),
        }
    }

    for (const position of ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY']) {
        const acc = stats_by_position[position]

        acc.kda = {
            kills: Number((acc.kda.kills / acc.games).toFixed(1)),
            deaths: Number((acc.kda.deaths / acc.games).toFixed(1)),
            assists: Number((acc.kda.assists / acc.games).toFixed(1)),
        }
        acc.farm = {
            cs: Number((acc.farm.cs / acc.games).toFixed(1)),
            csmin: Number((acc.farm.cs / minsPlayed[position]).toFixed(1)),
            gold: Number((acc.farm.gold / acc.games).toFixed(1)),
        }
        acc.stats = {
            maxKills: acc.stats.maxKills,
            maxDeaths: acc.stats.maxDeaths,
            avgDamageDealt: Math.floor(acc.stats.avgDamageDealt / acc.games),
            avgDamageTaken: Math.floor(acc.stats.avgDamageTaken / acc.games),
            visionScore: Number((acc.stats.visionScore / acc.games).toFixed(1)),
        }
    }

    return {
        alias: player.alias,
        stats_by_champ: {},
        stats_by_position,
        server: player.server,
        image: player.image,
        level: player.level,
        rank: player.rank,
    }
}
