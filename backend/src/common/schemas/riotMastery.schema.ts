import { z } from 'zod'

export const RiotMasterySchema = z.object({
    championId: z.number(),
    championLevel: z.number(),
    championPoints: z.number(),
    lastPlayTime: z.number(),
    championPointsSinceLastLevel: z.number(),
    championPointsUntilNextLevel: z.number(),
    chestGranted: z.boolean().optional(),
    tokensEarned: z.number(),
    summonerId: z.string().optional(),
})

export type RiotMasteryType = z.infer<typeof RiotMasterySchema>
