<!--
  @component
  ## Mastery Page
  Visualize the masteries of a player
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { playersContext } from '$lib/context/players'
    import { Container, EmptyPlayers } from '$lib/components'
    import MasteriesRow from './MasteriesRow.svelte'

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))
</script>

{#if _players.length}
    <Container title="Mastery" description="Your 12 champions with more points">
        <div class="grid gap-4">
            {#each _players as player}
                <MasteriesRow player={player} />
            {/each}
        </div>
    </Container>
{:else}
    <EmptyPlayers />
{/if}
