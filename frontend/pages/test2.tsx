import { riot } from 'configs'
import React, { useEffect, useState } from 'react'
import { PlayerImg, RankStructure } from 'components'

const Test = () => {
    const [playerData, setPlayerData] = useState<any>()
    const [league, setLeague] = useState<any>([{},{}])

    useEffect(() => {
        // GET data from player
        fetch('/api/summoner/Alexwwe')
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

    const Rank = (idx: number) => ({
        rank: league[idx]?.tier ? `${league[idx]?.tier} ${league[idx]?.rank}` : 'Unranked',
        image: league[idx]?.tier ? `/images/league-emblems/${league[idx]?.tier}.png` : '/images/league-emblems/Unranked.png',
        lp: league[idx]?.leaguePoints ?? 0,
        win: league[idx]?.wins ?? 0,
        lose: league[idx]?.losses ?? 0,
        winrate: league[idx]?.wins && league[idx]?.losses ?
            (league[idx]?.wins/(league[idx]?.wins+league[idx]?.losses) * 100).toFixed(0) : 0,
    })
    const player = {
        image: riot.utils.profileIconUrl(playerData?.profileIconId),
        alias: playerData?.name,
        level: playerData?.summonerLevel,
        rank: {
            solo: Rank(0),
            flex: Rank(1),
        }
    }
    console.log(player)

    return (
        <div className='container mx-auto'>
            {playerData && <PlayerImg image={riot.utils.profileIconUrl(playerData.profileIconId)} alias={playerData.name} level={playerData.summonerLevel}/>}
            {league && <RankStructure player={player}/>}
        </div>
    )
}

export default Test
