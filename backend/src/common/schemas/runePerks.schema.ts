import { z } from 'zod'

/**
 * Rune Group - the category of runes selected in each branch
 */
export const RuneGroup = z.union([
    z.literal(8000), // domination
    z.literal(8100), // precision
    z.literal(8200), // sorcery
    z.literal(8300), // whimsy
    z.literal(8400), // resolve
])

/**
 * Rune Perk - the runes available to select
 */
export const RunePerk = z.union([
    z.literal(0),
    z.literal(8005),
    z.literal(8008),
    z.literal(8009),
    z.literal(8010),
    z.literal(8014),
    z.literal(8017),
    z.literal(8021),
    z.literal(8105),
    z.literal(8106),
    z.literal(8112),
    z.literal(8124),
    z.literal(8128),
    z.literal(8126),
    z.literal(8135),
    z.literal(8138),
    z.literal(8139),
    z.literal(8143),
    z.literal(8210),
    z.literal(8214),
    z.literal(8226),
    z.literal(8229),
    z.literal(8230),
    z.literal(8233),
    z.literal(8237),
    z.literal(8242),
    z.literal(8299),
    z.literal(8304),
    z.literal(8345),
    z.literal(8347),
    z.literal(8351),
    z.literal(8360),
    z.literal(8369),
    z.literal(8429),
    z.literal(8437),
    z.literal(8439),
    z.literal(8444),
    z.literal(8446),
    z.literal(8451),
    z.literal(8453),
    z.literal(8463),
    z.literal(8465),
    z.literal(8473),
    z.literal(9101),
    z.literal(9103),
    z.literal(9104),
    z.literal(9105),
    z.literal(9111),
    z.literal(9923),
])

/**
 * The rune selected
 */
export const RuneSelection = z.object({
    perk: RunePerk,
    var1: z.number(),
    var2: z.number(),
    var3: z.number(),
})
