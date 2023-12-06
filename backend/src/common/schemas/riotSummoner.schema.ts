import { z } from 'zod'

export const RiotSummonerSchema = z.object({
    id: z.string(),
    accountId: z.string(),
    puuid: z.string(),
    name: z.string(),
    profileIconId: z.number(),
    revisionDate: z.number(),
    summonerLevel: z.number(),
})

export type RiotSummonerType = z.infer<typeof RiotSummonerSchema>
