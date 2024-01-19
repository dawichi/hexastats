<!--
  @component
  ## CachedPlayers component
  List players cached in database
-->
<script lang="ts">
    import { rawServer } from '$lib/config'
    import { ProfileImg } from '..'
    import { backendUrl } from '$lib/services/Summoner.service'
    import { cachedPlayersContext } from '$lib/context/general'

    // This is the text in the input
    export let textInput: string

    // This is the list of names that have already been searched, so we don't search them again
    const namesSearched: string[] = []

    async function getPlayersData(summonerName: string): Promise<void> {
        if (!summonerName) {
            return
        }

        const filteredPlayers = $cachedPlayersContext.filter(
            p =>
                String(p.riotIdName).toLowerCase().includes(summonerName.toLowerCase()) ||
                String(p.riotIdTag).toLowerCase().includes(summonerName.toLowerCase()),
        )
        if (filteredPlayers.length > 3) {
            filteredPlayers.length = 3
        }

        for (const player of filteredPlayers) {
            const riotId = `${player.riotIdName}-${player.riotIdTag}`
            if (namesSearched.includes(riotId)) {
                continue
            }

            namesSearched.push(riotId)
            try {
                const res = await fetch(`${backendUrl}summoners/${player.server}/${riotId}/level-image`)
                const data = await res.json()

                cachedPlayersContext.set(
                    $cachedPlayersContext.map(p => {
                        if (p.riotIdName + '-' + p.riotIdTag === riotId) {
                            p.level = data.level
                            p.image = data.image
                            p.riotIdName = data.riotIdName
                            p.riotIdTag = data.riotIdTag
                        }
                        return p
                    }),
                )
            } catch (error) {
                console.error('Error fetching data for ${riotId}', error)
            }
        }
    }

    let searching: boolean = false

    // reload the function each time summonerName changes
    $: getPlayersData(textInput)
</script>

{#if textInput && $cachedPlayersContext.filter(p => String(p.riotIdName).toLowerCase().includes(textInput.toLowerCase()) || String(p.riotIdTag)
                .toLowerCase()
                .includes(textInput.toLowerCase())).length}
    <section>
        <h2 class="whitespace-nowrap pb-3 text-lg">Searched players:</h2>
        <div class="flex flex-col gap-2 pl-4">
            {#each $cachedPlayersContext
                .filter(p => String(p.riotIdName).toLowerCase().includes(textInput.toLowerCase()) || String(p.riotIdTag)
                            .toLowerCase()
                            .includes(textInput.toLowerCase()))
                .slice(0, 3) as player}
                <a
                    on:click={() => (searching = true)}
                    href={`/summoners/${rawServer(player.server)}/${player.riotIdName}-${player.riotIdTag}/1`}
                    class="hover:underline"
                >
                    <div
                        class="flex items-center whitespace-nowrap rounded bg-white shadow transition-transform hover:scale-105 hover:shadow-indigo-400 dark:bg-zinc-800"
                    >
                        <span class={player.level ? 'visible' : 'invisible'}>
                            <ProfileImg image={player.image} level={player.level} />
                        </span>
                        <span class="w-12">{player.server}</span>
                        <span>{decodeURI(player.riotIdName + ' #' + player.riotIdTag)}</span>
                    </div>
                </a>
            {/each}
        </div>
    </section>
{/if}
