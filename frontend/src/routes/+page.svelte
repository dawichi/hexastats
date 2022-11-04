<script lang="ts">
    import RankStructure from "$lib/components/common/RankStructure.svelte"
    import type { SummonerDto } from "$lib/types"

    const player: SummonerDto = {
        alias: "Sylver",
        image: "https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/28.png",
        level: 30,
        rank: {
            solo: {
                rank: "I",
                lp: 0,
                win: 0,
                lose: 0,
                winrate: 0,
                image: "iron.png"
            },
            flex: {
                rank: "I",
                lp: 0,
                win: 0,
                lose: 0,
                winrate: 0,
                image: "iron.png"
            }
        },
        games: [],
        masteries: [],
        server: 'wueq'
    }
</script>

<div>
    <RankStructure {player} />
</div>