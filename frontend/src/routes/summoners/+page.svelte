<!--
  @component
  ## Summoners Page
  Visualize each player details
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { styles } from '$lib/config'
    import { playersContext } from '$lib/context/players'
    import { Container, EmptyPlayers } from '$lib/components'
    import Summoner from './Summoner.svelte'

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))

    let idxSelected: number = 0
</script>

{#if _players.length}
    <Container title="" description="" disableHeader>
        <div class="flex flex-wrap items-center py-2">
            {#each _players as player, idx}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    title={player.alias}
                    on:click={() => (idxSelected = _players.indexOf(player))}
                    class={`rounded cursor-pointer shadow-sm m-1 p-2 relative border border-zinc-300 dark:border-zinc-600 ${
                        idx === idxSelected ? styles.active : styles.foreground
                    }`}
                >
                    <div class="flex items-end justify-center">
                        <div class="relative h-12 w-12 overflow-hidden rounded">
                            <img src={player.image} alt={player.alias} />
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <Summoner player={_players[idxSelected]} />
    </Container>
{:else}
    <EmptyPlayers />
{/if}
