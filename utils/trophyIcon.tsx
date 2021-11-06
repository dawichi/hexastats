import React from 'react'

const trophyIcon = (rank: number) => {
	const icons = {
		1: <span className="bg-yellow-400 p-1 rounded text-white mr-1 mb-1 inline-block"><i className="bi bi-trophy"></i></span>,
		2: <span className="bg-gray-700 p-1 rounded text-white mr-1 mb-1 inline-block"><i className="bi bi-trophy"></i></span>,
		3: <span className="bg-yellow-700 p-1 rounded text-white mr-1 mb-1 inline-block"><i className="bi bi-trophy"></i></span>
	}
	return icons[rank]
}

export default trophyIcon