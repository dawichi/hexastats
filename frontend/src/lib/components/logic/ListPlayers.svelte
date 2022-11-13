<!--
  @component
  ## ListPlayers component
  List players from the context
-->
<script lang="ts">
    import { styles } from '$lib/config'
    import { playersContext } from '$lib/context/players'
    import type { SummonerDto } from '$lib/types'
    import RankStructure from '../common/RankStructure.svelte'
    import { generalContext } from '$lib/context/general'

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))

    let _loading = false
    generalContext.subscribe(general => (_loading = general.loadingPlayer))

    const handleDeletePlayer = (player_to_delete: number) => {
        const start = _players.slice(0, player_to_delete)
        const end = _players.slice(player_to_delete + 1, _players.length)
        playersContext.update(x => start.concat(end))
    }
</script>

{#if _players.length || _loading}
    <div class="container mx-auto">
        <h3 class="my-3 text-xl">Players added:</h3>
        <hr />
        <p class="mt-2 mb-4">
            <strong>Great !</strong> &nbsp; Now that you have added some players, feel free to explore all the hexastats pages ^^
        </p>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {#each _players as player, idx}
                <div class="{styles.foreground} {styles.card} relative p-4">
                    <RankStructure {player} />

                    <button on:click={() => handleDeletePlayer(idx)} class="absolute top-0 right-0 rounded-sm p-1 px-2 hover:bg-red-500">
                        <i class="bi bi-person-x-fill" />
                    </button>
                </div>
            {/each}
            {#if _loading}
                <div class="{styles.foreground} {styles.card} relative p-4">
                    <RankStructure player={null} />
                </div>
            {/if}
        </div>
    </div>
{/if}
