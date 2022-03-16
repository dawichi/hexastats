/**
 * @param rank the position in the podium
 * @returns the <span></span>, empty or with a trophy to show
 */
export default function trophyIcon(rank: number): JSX.Element {
    const icons = {
        1: (
            <span className='bg-yellow-400 p-1 rounded text-white mr-1 mb-1 inline-block'>
                <i className='bi bi-trophy'></i>
            </span>
        ),
        2: (
            <span className='bg-gray-700 p-1 rounded text-white mr-1 mb-1 inline-block'>
                <i className='bi bi-trophy'></i>
            </span>
        ),
        3: (
            <span className='bg-yellow-700 p-1 rounded text-white mr-1 mb-1 inline-block'>
                <i className='bi bi-trophy'></i>
            </span>
        ),
    }

    return icons[rank] ?? <span></span>
}
