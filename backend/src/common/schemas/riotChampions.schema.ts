import { z } from 'zod'

export const RiotChampionsSchema = z.object({
    type: z.string(),
    format: z.string(),
    version: z.string(),
    data: z.record(
        z.object({
            version: z.string(),
            id: z.string(),
            key: z.string(),
            name: z.string(),
            title: z.string(),
            blurb: z.string(),
            info: z.object({
                attack: z.number(),
                defense: z.number(),
                magic: z.number(),
                difficulty: z.number(),
            }),
            image: z.object({
                full: z.string(),
                sprite: z.string(),
                group: z.string(),
                x: z.number(),
                y: z.number(),
                w: z.number(),
                h: z.number(),
            }),
            tags: z.array(z.string()),
            partype: z.string(),
            stats: z.object({
                hp: z.number(),
                hpperlevel: z.number(),
                mp: z.number(),
                mpperlevel: z.number(),
                movespeed: z.number(),
                armor: z.number(),
                armorperlevel: z.number(),
                spellblock: z.number(),
                spellblockperlevel: z.number(),
                attackrange: z.number(),
                hpregen: z.number(),
                hpregenperlevel: z.number(),
                mpregen: z.number(),
                mpregenperlevel: z.number(),
                crit: z.number(),
                critperlevel: z.number(),
                attackdamage: z.number(),
                attackdamageperlevel: z.number(),
                attackspeedperlevel: z.number(),
                attackspeed: z.number(),
            }),
        }),
    ),
})

export type RiotChampionsType = z.infer<typeof RiotChampionsSchema>
