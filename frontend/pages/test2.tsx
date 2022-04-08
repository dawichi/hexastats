import { environment, riot } from 'configs'
import React, { useEffect, useState } from 'react'
import { PlayerImg, RankStructure } from 'components'

const Test = () => {
    const [playerData, setPlayerData] = useState<any>()

    useEffect(() => {
        // GET data from player
        fetch(environment.backendUrl + 'dawichii')
            .then(res => res.json())
            .then(data => setPlayerData(data.data))
    }, [])

    console.log(playerData)
    
    return (
        <div className='container mx-auto'>
            {playerData && <PlayerImg image={playerData.image} alias={playerData.name} level={playerData.summonerLevel}/>}
            {playerData && <RankStructure player={playerData}/>}
        </div>
    )
}

export default Test
