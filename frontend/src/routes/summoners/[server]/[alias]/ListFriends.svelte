<!--
  @component
  ## List Friends component
  List all friends from a player
-->
<script lang="ts">
    import type { FriendDto, SummonerDto } from '$lib/types'
    import { rawServer } from '$lib/config'

    export let player: SummonerDto

    let maxGames: number = 0

    /**
     * ## Checks the friends winrate
     * Check if a player have been repeeated in your games and if so,
     * considers it a friend and checks its winrate before adding it to the list.
     *
     * @param games The games to build the stats from
     * @returns The list stats
     */
    function buildFriends(player: SummonerDto): FriendDto[] {
        const indexByName: Record<
            string,
            {
                games: number
                wins: number
            }
        > = {}

        // Iterate all games
        for (const game of player.games) {
            // Iterate over your teammates only
            const [initialTeamMate, lastTeamMate] = game.participantNumber > 4 ? [5, 9] : [0, 4]
            for (let i = initialTeamMate; i < lastTeamMate; i++) {
                const player = game.participants[i]

                if (!indexByName[player.summonerName]) {
                    indexByName[player.summonerName] = {
                        wins: player.win ? 1 : 0,
                        games: 1,
                    }
                } else {
                    indexByName[player.summonerName].wins += player.win ? 1 : 0
                    indexByName[player.summonerName].games += 1
                }
            }
        }

        // Remove all players you only played with once
        for (const friend in indexByName) {
            if (indexByName[friend].games === 1) {
                delete indexByName[friend]
            }
        }

        // Remove your own name from the list
        delete indexByName[player.games[0].participants[player.games[0].participantNumber].summonerName]

        const result = Object.keys(indexByName)
            .map(key => ({
                name: key,
                games: indexByName[key].games,
                wins: indexByName[key].wins,
            }))
            .sort((a, b) => b.games - a.games)

        maxGames = Math.max(...result.map(friend => friend.games))
        return result
    }
</script>

{#if buildFriends(player).length}
    <div class="p-4">
        <section class="mb-4 grid grid-cols-5 gap-2">
            <h4 class="col-span-2">Summoner</h4>
            <h4>Record</h4>
            <h4 class="col-span-2">Wins / Losses</h4>
        </section>

        {#each buildFriends(player) as friend}
            <section class="grid grid-cols-5 items-center gap-2 text-sm md:text-base">
                <div class="col-span-2">
                    <a
                        href={`/summoners/${rawServer(player.server)}/${friend.name}`}
                        class="col-span-2 overflow-hidden text-ellipsis whitespace-nowrap hover:underline "
                    >
                        {friend.name}
                    </a>
                </div>

                <span>
                    {friend.wins} / {friend.games}
                </span>

                <div class="col-span-2 h-2 overflow-hidden rounded bg-zinc-600">
                    <div class="flex" style="width: {(friend.games / maxGames) * 100}%">
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
