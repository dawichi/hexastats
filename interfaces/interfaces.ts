export interface Player {
	name: string,
	alias: string,
	image: string,
	champs: Champs[]
}

export interface Champs {
	name: string,
	image: string,
	games: number,
	winrate: number,
	kda: number,
	kills: number,
	deaths: number,
	asissts: number,
	cs: number,
	csmedian: number,
}

export interface DataForChart {
	label: string,
	value: number
}