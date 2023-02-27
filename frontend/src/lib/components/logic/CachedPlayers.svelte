<!--
  @component
  ## CachedPlayers component
  List players cached in database
-->
<script lang="ts">
    import { rawServer } from '$lib/config'

    export let summonerName: string
    export let cachedPlayers: Array<{
        server: string
        name: string
    }>

    const getServer = (summonerName: string) => cachedPlayers.find(cachedPlayer => cachedPlayer.name === summonerName)?.server ?? ''
    const filterList = (alias: string): string[] => {
        return cachedPlayers.map(cachedPlayer => (cachedPlayer.name.toLowerCase().includes(alias.toLowerCase()) ? cachedPlayer.name : '')).filter(Boolean)
    }
</script>

{#if summonerName !== '' && filterList(summonerName).length > 0}
    <section>
        <h2 class="whitespace-nowrap text-lg">Searched players:</h2>
        <div class="flex flex-col pl-4">
            {#each [0, 1, 2, 3, 4] as idx}
                {#if filterList(summonerName)[idx]}
                    <a href={`/summoners/${rawServer(getServer(filterList(summonerName)[idx]))}/${filterList(summonerName)[idx]}`} class="hover:underline">
                        <div class="flex whitespace-nowrap">
                            <span class="w-12">{getServer(filterList(summonerName)[idx])}</span>
                            <span>{filterList(summonerName)[idx]}</span>
                        </div>
                    </a>
                {/if}
            {/each}
        </div>
    </section>
{/if}
