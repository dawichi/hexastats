import { z } from 'zod'

const BaseProps = z.object({
    queueType: z.enum(['RANKED_SOLO_5x5', 'RANKED_FLEX_SR', 'CHERRY']),
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

/**
 * These props are not present in Cherry games
 */
const ExtraProps = z.object({
    leagueId: z.string().optional(),
    tier: z.string().optional(),
    rank: z.string().optional(),
})

export const RiotRankSchema = z.intersection(BaseProps, ExtraProps)

export type RiotRankType = z.infer<typeof RiotRankSchema>
