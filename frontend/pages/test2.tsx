import { riot } from 'configs'
import React, { useEffect, useState } from 'react'
import { PlayerImg } from 'components'

const Test = () => {
    const [playerData, setPlayerData] = useState<any>()
    const [league, setLeague] = useState<any>()

    useEffect(() => {
        // GET data from player
        fetch('/api/summoner/BloddSword')
            .then(res => res.json())
            .then(data => setPlayerData(data))
    }, [])

    useEffect(() => {
        // GET champion masteries
        if (playerData) {
            fetch('/api/league/' + playerData.id)
                .then(res => res.json())
                .then(data => setLeague(data))
        }
    }, [playerData])

    console.table(playerData)
    console.log(league)

    return (
        <div className='container mx-auto'>
            {playerData && <PlayerImg image={riot.utils.profileIconUrl(playerData.profileIconId)} alias={playerData.name} level={playerData.summonerLevel}/>}
            {league && (
                <div>
                    <h1>
                        {league[0]?.tier ?? 'Unranked'} {league[0]?.rank ?? ''}
                    </h1>
                </div>
            )}
        </div>
    )
}

export default Test
