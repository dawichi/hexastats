export interface Player {
	name: string,
	alias: string,
	image: string,
	rank_n: string,
	rank_p: number,
	champs: Champ[]
}

export interface Champ {
	name: string,
	image: string,
	games: number,
	winrate: number,
	kda: number,
	kills: number,
	deaths: number,
	assists: number,
	cs: number,
	csmin: number
}

export interface DataForChart {
	label: string,
	value: number
}

export interface PlayerStats {
	key: string,
	value: number
}

export interface RankResults {
	name: string,
	image: string,
	trophies: number[]
}