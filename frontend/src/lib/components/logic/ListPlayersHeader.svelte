<!--
  @component
  ## List Players Header component
  Lists a compressed list of players in context
-->
<script lang="ts">
    import { page } from '$app/stores'
    import { styles } from '$lib/config'
    import { playersContext } from '$lib/context/players'
    import type { SummonerDto } from '$lib/types'
    import { Image } from '..'

    // Context
    let _players: SummonerDto[] = []
    playersContext.subscribe(players => (_players = players))

    const handleDeletePlayer = (player_to_delete: number) => {
        const start = _players.slice(0, player_to_delete)
        const end = _players.slice(player_to_delete + 1, _players.length)
        playersContext.update(x => start.concat(end))
    }
</script>

{#if $page.url.pathname !== '/' && $page.url.pathname !== '/summoners'}
    <div class="flex flex-wrap items-center border border-x-0 border-t-0 py-2">
        <div class="mr-3 flex flex-col items-center justify-center">
            <span class="px-2">Add more</span>
            <a href="/">
                <button
                    title="Add more players"
                    class={`${styles.foreground} ${styles.card} hover:text-white hover:bg-indigo-600 hover:dark:bg-indigo-600 m-1 py-2 px-3 cursor-pointer`}
                >
                    <i class="bi bi-person-plus-fill" />
                </button>
            </a>
        </div>
        {#each _players as player, idx}
            <div class={`${styles.foreground} rounded shadow-sm m-1 p-2 relative border border-zinc-300 dark:border-zinc-600`}>
                <div class="flex items-end justify-center">
                    <div class="relative h-12 w-12 overflow-hidden rounded">
                        <img src={player.image} alt="profile pic" />
                    </div>
                    <span class="ml-2">{player.alias}</span>

                    <button on:click={() => handleDeletePlayer(idx)} class="absolute top-0 right-0 rounded-sm p-1 px-2 hover:bg-red-500">
                        <i class="bi bi-person-x-fill" />
                    </button>
                </div>
            </div>
        {/each}
    </div>
{/if}
