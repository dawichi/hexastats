<!--
  @component
  ## CachedPlayers component
  List players cached in database
-->
<script lang="ts">
    import { rawServer } from "$lib/config"


    export let summonerName: string
    export let cachedPlayers: string[]

    let filteredNames: string[] = []

    function filterList(alias: string): string[] {
        console.log(alias)
        // console.log(cachedPlayers.map(name => (name.toLowerCase().includes(alias.toLowerCase()) ? name : '')))

        return cachedPlayers.map(name => (name.toLowerCase().includes(alias.toLowerCase()) ? name : ''))
    }
</script>

<div class="flex flex-col">
    {#each [0, 1, 2, 3, 4] as idx}
        <div>
            <a href={`/summoners/${rawServer(filterList(summonerName)[idx].split(':')[0])}/${filterList(summonerName)[idx].split(':')[1]}`} class="hover:underline">
                {filterList(summonerName)[idx].split(':')[1]}
            </a>
        </div>
    {/each}
</div>
