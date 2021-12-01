const realName = (alias: string) => {
	const aliases = {
		alexwwe: 'Alex',
		brr1: 'Bruno',
		bloddsword: 'Cristian',
		dawichii: 'Dawichi',
		agazhord: 'Marcos',
		traketero: 'Rodri',
		dryadzero: 'Samu',
		'rhaast west': 'Diego',
		'delemKi 26': 'Abel',
		daytresgp: 'David',
		telejenkem: 'Jose',
	}
	
	if (aliases[alias] !== undefined)
		return aliases[alias]

	return alias
}

export default realName