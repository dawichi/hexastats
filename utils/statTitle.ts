export default function propTitle(prop: string) {
    const props = {
        games: 'Games Played',
        winrate: 'Winrate',
        kda: 'KDA',
        kills: 'Kills',
        deaths: 'Deaths',
        assists: 'Assists',
        cs: 'Farm total',
        csmin: 'CS / Min',
        gold: 'Gold',
        avg_damage_dealt: 'Avg Damage',
        avg_damage_taken: 'Avg Tank',


    }

    if (props[prop] !== undefined) {
        return props[prop]
    }
    return prop
}
