import { z } from 'zod'

export const ServerSchema = z.enum(['euw1', 'na1', 'eun1', 'kr', 'jp1', 'br1', 'la1', 'la2', 'oc1', 'tr1', 'ru'])

export type ServerType = z.infer<typeof ServerSchema>
