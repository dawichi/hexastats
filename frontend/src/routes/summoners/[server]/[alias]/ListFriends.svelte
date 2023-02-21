<!--
  @component
  ## List Friends component
  List all friends from a player
-->
<script lang="ts">
    import type { SummonerDto } from '$lib/types'
    import { ChampService } from '$lib/services/Champ.service'
    import { rawServer } from '$lib/config'

    export let player: SummonerDto
</script>

{#if ChampService.friendsCheck(player.games).length}
    <div class="p-4">
        <section class="mb-4 grid grid-cols-3 gap-2">
            <h4>Summoner</h4>
            <h4>Record</h4>
            <h4>Winrate</h4>
        </section>

        {#each ChampService.friendsCheck(player.games) as friend}
            <section class="grid grid-cols-3 items-center gap-2 text-sm md:text-base">
                <a href={`/summoners/${rawServer(player.server)}/${friend.name}`} class="overflow-hidden text-ellipsis whitespace-nowrap hover:underline ">{friend.name}</a>
                <span>
                    {friend.wins} / {friend.games}
                </span>
                <div class="h-2 rounded bg-zinc-600">
                    <div class="h-2 rounded bg-green-400" style="width: {(friend.wins / friend.games) * 100}%" />
                </div>
            </section>
        {/each}
    </div>
{:else}
    <div class="p-5 text-center">
        <span class="text-2xl">
            <i class="bi bi-emoji-frown" />
        </span>

        <p>There is games with friends loaded.</p>
    </div>
{/if}
