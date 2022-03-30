import { riot } from 'configs'
import React, { useEffect, useState } from 'react'

const Test = () => {
    const [playerData, setPlayerData] = useState<any>({})
    const [masteries, setMasteries] = useState()

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
            {playerData && (
                <div>
                    <img src={riot.utils.profileIconUrl(playerData.profileIconId)} />
                </div>
            )}
        </div>
    )
}

export default Test