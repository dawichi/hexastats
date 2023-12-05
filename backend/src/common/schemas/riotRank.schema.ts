import { z } from 'zod'

export const RiotRankSchema = z.object({
    leagueId: z.string(),
    queueType: z.string(),
    tier: z.string(),
    rank: z.string(),
    summonerId: z.string(),
    summonerName: z.string(),
    leaguePoints: z.number(),
    winss: z.number(),
    losses: z.number(),
    veteran: z.boolean(),
    inactive: z.boolean(),
    freshBlood: z.boolean(),
    hotStreak: z.boolean(),
    miniSeries: z.object({
        progress: z.string(),
    }),
})

export type RiotRankType = z.infer<typeof RiotRankSchema>
