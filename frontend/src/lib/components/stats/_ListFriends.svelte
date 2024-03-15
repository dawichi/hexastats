<!--
  @component
  ## List Friends component
  List all friends from a player
-->
<script lang="ts">
    import type { FriendDto, SummonerDto } from '$lib/types'
    import { rawServer } from '$lib/config'
    import { page } from '$app/stores'

    export let friends: Array<FriendDto>

    const [x, y, server, summoner, page_num] = $page.url.pathname.split('/')

    const maxGames = () => Math.max(...friends.map(friend => friend.games))

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
</script>

<div>
    <h2 class="pt-3 text-center text-2xl">Friends</h2>
    <hr class="m-2" />
    {#if friends.filter(friend => friend.games > 2).length}
        <div class="p-4">
            <section class="mb-4 grid grid-cols-5 gap-2">
                <h4 class="col-span-2">Summoner</h4>
                <h4>Record</h4>
                <h4 class="col-span-2">Wins / Losses</h4>
            </section>

            {#each friends.filter(friend => friend.games > 2).sort((a, b) => b.games - a.games) as friend}
                <section class="grid grid-cols-5 items-center gap-2 text-sm md:text-base">
                    <div class="col-span-2">
                        {#if friend.riotIdTagLine}
                            <a
                                href={`/summoners/${rawServer(server)}/${friend.riotIdGameName}-${friend.riotIdTagLine}/1`}
                                class="col-span-2 overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
                                on:click={scrollToTop}
                            >
                                {friend.riotIdGameName}
                            </a>
                        {:else}
                            <p class="col-span-2 overflow-hidden text-ellipsis whitespace-nowrap">
                                {friend.riotIdGameName}
                            </p>
                        {/if}
                    </div>

                    <span>
                        {friend.wins} / {friend.games}
                    </span>

                    <div class="col-span-2 h-2 overflow-hidden rounded bg-zinc-600">
                        <div class="flex" style="width: {(friend.games / maxGames()) * 100}%">
                            <!-- GREEN BAR: represents number of wins -->
                            <div class="h-2 bg-green-400" style="width: {(friend.wins / friend.games) * 100}%" />
                            <!-- RED BAR: represents number of defeats -->
                            <div class="h-2 rounded-r bg-red-400" style="width: {((friend.games - friend.wins) / friend.games) * 100}%" />
                        </div>
                    </div>
                </section>
            {/each}
        </div>
    {:else}
        <div class="p-5 text-center">
            <span class="text-2xl">
                <i class="bi bi-emoji-frown" />
            </span>

            <p>There are no games with friends loaded.</p>
        </div>
    {/if}
</div>
