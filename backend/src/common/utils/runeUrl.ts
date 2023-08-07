const perks: Record<number, string> = {
    8100: '7200_domination',
    8000: '7201_precision',
    8200: '7202_sorcery',
    8300: '7203_whimsy',
    8400: '7204_resolve',
}

const runes: Record<number, string> = {
    8112: 'electrocute',
    8124: 'predator',
    8128: 'darkharvest',
    9923: 'hailofblades',
    8351: 'glacialaugment',
    8360: 'unsealedspellbook',
    8369: 'firststrike',
    8005: 'presstheattack',
    8008: 'lethaltempo', //'temp'
    8021: 'fleetfootwork',
    8010: 'conqueror',
    8437: 'graspoftheundying',
    8439: 'veteranaftershock',
    8465: 'guardian',
    8214: 'summonaery',
    8229: 'arcanecomet',
    8230: 'phaserush',
}

/**
 * @param perkId The id of the perk
 * @returns The url of the perk image
 */
export const perkUrl = (perkId: number): string => `https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/
global/default/v1/perk-images/styles/${perks[perkId]}.png`

/**
 * @param runeId Rune ID
 * @param perkId Perk ID
 * @returns The url of the rune image
 */
export function runeUrl(runeId: number, perkId: number): string {
    const exception = runeId === 8008 ? 'temp' : ''
    const runeGroup = perkId === 8300 ? 'inspiration' : perks[perkId] && perks[perkId].split('_')[1]

    return `https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${runeGroup}/${runes[runeId]}/${runes[runeId]}${exception}.png`

    //return `https://ddragon.canisback.com/img/perk-images/Styles/${runeGroup}/${runes[runeId]}/${runes[runeId]}${exception}.png`??
}
