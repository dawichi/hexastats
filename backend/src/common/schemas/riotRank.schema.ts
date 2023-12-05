import { z } from 'zod'

export const RiotRankSchema = z.object({
    leagueId: z.string(),
    queueType: z.string(),
    tier: z.string(),
    rank: z.string(),
    summonerId: z.string(),
    summonerName: z.string(),
    leaguePoints: z.number(),
    wins: z.number(),
    losses: z.number(),
    veteran: z.boolean(),
    inactive: z.boolean(),
    freshBlood: z.boolean(),
    hotStreak: z.boolean(),
})

export type RiotRankType = z.infer<typeof RiotRankSchema>
