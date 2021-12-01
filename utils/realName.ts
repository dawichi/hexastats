const realName = (alias: string) => {
	const aliases = {
		'dawichii': 'David',
	}
	
	if (aliases[alias] !== undefined)
		return aliases[alias]

	return alias
}

export default realName