import { riot } from 'configs'
import React, { useEffect, useState } from 'react'
import { PlayerImg, RankStructure } from 'components'

const Test = () => {
    const [playerData, setPlayerData] = useState<any>()

    useEffect(() => {
        // GET data from player
        fetch('https:/backend-hexastats.vercel.app/Brr1')
            .then(res => res.json())
            .then(data => setPlayerData(data))
    }, [])

    console.log(playerData)
    
    return (
        <div className='container mx-auto'>
            {playerData && <PlayerImg image={playerData.data.image} alias={playerData.data.name} level={playerData.data.summonerLevel}/>}
            {playerData && <RankStructure player={playerData.data}/>}
        </div>
    )
}

export default Test
