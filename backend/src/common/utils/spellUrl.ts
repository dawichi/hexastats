/**
 * ## Get the spell url by id
 *
 * @param spellId the id of the spell
 * @returns the url of the spell image
 */
export function spellUrl(spellId: number): string {
    const spells: { [key: number]: string } = {
        21: 'Barrier',
        1: 'Boost',
        14: 'Dot',
        3: 'Exhaust',
        4: 'Flash',
        6: 'Haste',
        7: 'Heal',
        13: 'Mana',
        30: 'PoroRecall',
        31: 'PoroThrow',
        11: 'Smite',
        39: 'SnowURFSnowball_Mark',
        32: 'Snowball',
        12: 'Teleport',
        54: '_UltBookPlaceholder',
        55: '_UltBookSmitePlaceholder',
    }

    if (!spells[spellId]) {
        throw new Error('Spell Key not valid :(')
    }
    return `http://ddragon.leagueoflegends.com/cdn/12.8.1/img/spell/Summoner${spells[spellId]}.png`
}
