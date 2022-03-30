import { riot } from 'configs'
import React, { useEffect, useState } from 'react'

const Test = () => {
    const [playerData, setPlayerData] = useState<any>({})
    const [masteries, setMasteries] = useState<any>({})

    useEffect(() => {
        // GET data from player
        fetch('/api/summoner?name=BloddSword')
            .then(res => res.json())
            .then(data => setPlayerData(data))

    }, [])
    useEffect(() => {
        // Use the player ID to get other stuff
        // GET champion masteries
        if (playerData) {
            fetch('/api/champion-mastery?playerId=' + playerData.id)
                .then(res => res.json())
                .then(data => setMasteries(data))
        }
    }, [playerData])

    console.log(playerData)
    console.log(masteries)

    return (
        <div>
            {playerData.id && (
                <div>
                    <img className='w-24' src={riot.utils.profileIconUrl(playerData.profileIconId)} />
                    <ul className='container mx-auto flex flex-wrap'>
                        {masteries.length && masteries.map((champ, idx) => (
                            <li key={idx} className='w-24'>
                                <img src={riot.utils.championImageUrl(champ.championId)} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Test