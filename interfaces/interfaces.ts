export interface Player {
	name: string,
	alias: string,
	image: string,
	rank_n: number,
	rank_p: number,
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
	csmedian: number
}

export interface DataForChart {
	label: string,
	value: number
}

export interface RankResults {
	name: string,
	image: string,
	trophies: number[]
}