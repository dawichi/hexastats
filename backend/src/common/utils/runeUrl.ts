const perks: { [id: number]: string } = {
    8100: '7200_Domination',
    8300: '7203_Whimsy',
    8000: '7201_Precision',
    8400: '7204_Resolve',
    8200: '7202_Sorcery',
}

const runes: Record<number, string> = {
    8112: 'Electrocute',
    8124: 'Predator',
    8128: 'DarkHarvest',
    9923: 'HailOfBlades',
    8351: 'GlacialAugment',
    8360: 'UnsealedSpellbook',
    8358: 'MasterKey',
    8005: 'PressTheAttack',
    8008: 'LethalTempo', //'Temp',
    8021: 'FleetFootwork',
    8010: 'Conqueror',
    8437: 'GraspOfTheUndying',
    8439: 'VeteranAftershock',
    8465: 'Guardian',
    8214: 'SummonAery',
    8229: 'ArcaneComet',
    8230: 'PhaseRush',
}

export const perkUrl = (perkId: number): string => `https://ddragon.canisback.com/img/perk-images/Styles/${perks[perkId]}.png`

export function runeUrl(runeId: number, perkId: number): string {
    const exception = runeId === 8008 ? 'Temp' : ''
    const runeGroup = perks[perkId].split('_')[1]

    return `https://ddragon.canisback.com/img/perk-images/Styles/${runeGroup}/${runes[runeId]}/${runes[runeId]}${exception}.png`
}
