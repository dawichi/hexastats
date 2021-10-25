export interface Player {
	name: string,
	alias: string,
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
}