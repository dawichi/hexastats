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
		max_kills: 'Max Kills',
		max_deaths: 'Max Deaths',
        avg_damage_dealt: 'Avg Damage',
        avg_damage_taken: 'Avg Tank',
		double_kills: 'Double Kills',
        triple_kills: 'Triple Kills',
        quadra_kills: 'Quadra Kills',
        penta_kills: '🔥 Pentakills 🔥'
    }

    if (props[prop] !== undefined) {
        return props[prop]
    }
    return prop
}
