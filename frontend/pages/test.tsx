import { riot } from 'configs'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const Test = () => {
    const [playerData, setPlayerData] = useState<any>()
    const [masteries, setMasteries] = useState<any>()
    const [main, setMain] = useState<any>({})

    useEffect(() => {
        // GET data from player
        fetch('/api/summoner/BloddSword')
            .then(res => res.json())
            .then(data => setPlayerData(data))

    }, [])

    useEffect(() => {
        // GET champion masteries
        if (playerData) {
            fetch('/api/masteries/' + playerData.id)
                .then(res => res.json())
                .then(data => setMasteries(data))

        }
    }, [playerData])

    useEffect(() => {
        // GET champion name
        if (masteries) {
            fetch('/api/championName/' + masteries[0].championId)
                .then(res => res.json())
                .then(data => setMain({
                    id: masteries[0].championId,
                    name: data.name,
                }))
        }
    }, [masteries])

    console.table(playerData)
    console.log(masteries)
    console.table(main)

    return (
        <div className='container mx-auto'>
            {playerData && (
                <div>
                    <img className='w-24' src={riot.utils.profileIconUrl(playerData.profileIconId)} />
                    <ul className='flex flex-wrap mt-20'>
                        {main && (
                            <div>
                                <h2>Main champ: {main.championId}</h2>
                                <img src={riot.utils.championImageUrl(main.name)} />
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Test