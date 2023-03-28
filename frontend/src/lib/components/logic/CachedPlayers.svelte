<!--
  @component
  ## CachedPlayers component
  List players cached in database
-->
<script lang="ts">
    import type { CachedNameDto } from '$lib/types'
    import { rawServer } from '$lib/config'
    import { ProfileImg } from '..'
    import { backendUrl } from '$lib/services/Summoner.service'
    import { filteredCachedPlayersContext } from '$lib/context/cachedPlayers'

    export let summonerName: string

    // Context
    let _cachedPlayers: Array<CachedNameDto> = []
    filteredCachedPlayersContext.subscribe(data => (_cachedPlayers = data))

    const namesSearched: string[] = []

    function getPlayersData(summonerName: string): void {
        if (!summonerName) {
            return
        }
        
        const filteredPlayers = _cachedPlayers.filter(p => p.alias.toLowerCase().includes(summonerName.toLowerCase()))
        if (filteredPlayers.length > 3) {
            filteredPlayers.length = 3
        }
        
        for (const player of filteredPlayers) {
            if (player.level || namesSearched.includes(player.alias)) {
                continue
            }

            namesSearched.push(player.alias)
            fetch(`${backendUrl}summoners/${player.server}/${player.alias}/level-image`)
                .then(res => res.json())
                .then(data => {
                    filteredCachedPlayersContext.update(players => {
                        const idx = players.findIndex(p => p.alias === player.alias)
                        players[idx].level = data.level
                        players[idx].image = data.image
                        return players
                    })
                })
        }
    }
    
    $: getPlayersData(summonerName)
</script>

{#if summonerName && _cachedPlayers.filter(p => p.alias.toLowerCase().includes(summonerName.toLowerCase())).length}
    <section>
        <h2 class="whitespace-nowrap pb-3 text-lg">Searched players:</h2>
        <div class="flex flex-col gap-2 pl-4">
            {#each _cachedPlayers.filter(p => p.alias.toLowerCase().includes(summonerName.toLowerCase())).slice(0, 3) as player}
                    <a href={`/summoners/${rawServer(player.server)}/${player.alias}`} class="hover:underline">
                        <div class="flex items-center whitespace-nowrap rounded bg-white shadow transition-transform hover:scale-105 hover:shadow-indigo-400 dark:bg-zinc-800">
                            <span class="{player.level ? 'visible' : 'invisible'}">
                                <ProfileImg
                                    image={player.image}
                                    level={player.level}
                                />
                            </span>
                            <span class="w-12">{player.server}</span>
                            <span>{player.alias}</span>
                        </div>
                    </a>
            {/each}
        </div>
    </section>
{/if}
