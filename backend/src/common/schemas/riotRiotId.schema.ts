import { z } from 'zod'

export const RiotRiotIdSchema = z.object({
    puuid: z.string(),
    gameName: z.string(),
    tagLine: z.string(),
})

export type RiotRiotIdType = z.infer<typeof RiotRiotIdSchema>
