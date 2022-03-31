import { riot } from 'configs'
import React, { useEffect, useState } from 'react'
import { PlayerImg, RankStructure } from 'components'

const Test = () => {
    const [playerData, setPlayerData] = useState<any>()
    const [league, setLeague] = useState<any>([{},{}])

    useEffect(() => {
        // GET data from player
        fetch('/api/summoner/Brr1')
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

    const player = {
        image: riot.utils.profileIconUrl(playerData?.profileIconId),
        alias: playerData?.name,
        level: playerData?.summonerLevel,
        rank: {
            solo:{
                rank: league[0]?.tier + ' ' + league[0]?.rank,
                image: '/images/league-emblems/' + league[0]?.tier + '.png',
                lp: league[0]?.leaguePoints,
                win: league[0]?.wins,
                lose: league[0]?.losses,
                winrate: (league[0]?.wins/(league[0]?.wins+league[0]?.losses) * 100).toFixed(0),

            },
            flex:{
                rank: league[1]?.tier + ' ' + league[1]?.rank,
                image: '/images/league-emblems/' + league[1]?.tier + '.png',
                lp: league[1]?.leaguePoints,
                win: league[1]?.wins,
                lose: league[1]?.losses,
                winrate: (league[1]?.wins/(league[1]?.wins+league[1]?.losses) * 100).toFixed(0),
            }
        }
    }

    return (
        <div className='container mx-auto'>
            {playerData && <PlayerImg image={riot.utils.profileIconUrl(playerData.profileIconId)} alias={playerData.name} level={playerData.summonerLevel}/>}
            {league && <RankStructure player={player}/>}
        </div>
    )
}

export default Test
