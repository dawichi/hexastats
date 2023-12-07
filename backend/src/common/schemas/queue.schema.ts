import { z } from 'zod'

export const QueueSchema = z.enum(['ranked', 'normal', 'all'])

export type QueueType = z.infer<typeof QueueSchema>
