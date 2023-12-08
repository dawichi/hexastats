import { z } from 'zod'
import { RuneGroup, RunePerk } from '../schemas'

type RuneGroupType = z.infer<typeof RuneGroup>
type RunePerkType = z.infer<typeof RunePerk>

const runeGroups: Record<RuneGroupType, string | null> = {
    0: null, // empty state - arena game mode
    8100: '7200_domination',
    8000: '7201_precision',
    8200: '7202_sorcery',
    8300: '7203_whimsy',
    8400: '7204_resolve',
}

const runePerks: Record<RunePerkType, string | null> = {
    0: null, // empty state - arena game mode
    8005: 'presstheattack',
    8008: 'lethaltempo', //'temp'
    8010: 'conqueror',
    8009: null,
    8014: null,
    8017: null,
    8021: 'fleetfootwork',
    8105: null,
    8106: null,
    8112: 'electrocute',
    8124: 'predator',
    8128: 'darkharvest',
    8126: null,
    8135: null,
    8138: null,
    8139: null,
    8143: null,
    8210: null,
    8214: 'summonaery',
    8226: null,
    8229: 'arcanecomet',
    8230: 'phaserush',
    8233: null,
    8237: null,
    8242: null,
    8299: null,
    8304: null,
    8345: null,
    8347: null,
    8351: 'glacialaugment',
    8360: 'unsealedspellbook',
    8369: 'firststrike',
    8429: null,
    8437: 'graspoftheundying',
    8439: 'veteranaftershock',
    8444: null,
    8446: null,
    8451: null,
    8453: null,
    8463: null,
    8465: 'guardian',
    8473: null,
    9101: null,
    9103: null,
    9104: null,
    9105: null,
    9111: null,
    9923: 'hailofblades',
}

/**
 * @param runeGroupId The rune group ID
 * @returns The image URL for the Rune Group
 */
export const runeGroupUrl = (runeGroupId: RuneGroupType): string | null =>
    !runeGroups[runeGroupId]
        ? null
        : `https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${runeGroups[runeGroupId]}.png`

/**
 * @param runeId The rune group ID
 * @param perkId The rune perk ID
 * @returns The image URL for the Rune Perk
 */
export function runePerkUrl(runeGroupId: RuneGroupType, runePerkId: RunePerkType): string | null {
    // The Rune Group needs this parse
    const group = runeGroups[runeGroupId]
    const perk = runePerks[runePerkId]

    // Arena mode -> no runes -> no image
    if (!group || !perk) {
        return null
    }

    const runeGroup = runeGroupId === 8300 ? 'inspiration' : group.split('_')[1]

    // There is a special case for Lethal Tempo
    const exception = runePerkId === 8008 ? 'temp' : ''

    return `https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${runeGroup}/${perk}/${perk}${exception}.png`

    //return `https://ddragon.canisback.com/img/perk-images/Styles/${runeGroup}/${perk}/${perk}${exception}.png`??
}
