<!--
  @component
  ## SearchPlayer component
-->
<script lang="ts">
    import { goto } from '$app/navigation'
    import { servers } from '$lib/config/servers'
    import { SummonerService } from '$lib/services/Summoner.service'
    import { CachedPlayers } from '..'

    // Search params
    let username = ''
    let serverIdx = 0
    let showServerList = false

    // Search helpers
    let error = false
    let loading = false

    const summonerService = SummonerService.getInstance()

    // Search logic once the button is pressed
    async function handleSearch(): Promise<void> {
        if (loading) return
        loading = true
        error = false

        const playerData = await summonerService.existPlayer(servers[serverIdx], username)
        if (playerData) {
            return goto(`/summoners/${servers[serverIdx]}/${playerData.alias}`)
        }

        error = true
        loading = false
    }

    // Search button by pressing enter
    const handleKeyPress = (event: KeyboardEvent): void => {
        if (event.key === 'Enter') handleSearch()
    }
</script>

<div>
    <div class="m-auto grid grid-cols-2 gap-4 p-5 sm:w-96">
        <div class="relative cursor-pointer select-none rounded shadow">
            <button
                class="relative m-auto h-12 w-full rounded bg-white p-2 pl-5 text-left ring-indigo-400 hover:shadow-md focus:ring-4 dark:bg-zinc-800"
                on:click={() => (showServerList = !showServerList)}
            >
                <span class="block truncate">{servers[serverIdx]}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <i class="bi bi-chevron-expand" />
                </span>
            </button>
            {#if showServerList}
                <ul class="absolute z-10 mt-2 w-full overflow-auto rounded-md bg-white shadow-xl dark:bg-zinc-800 dark:shadow-zinc-600">
                    <div class="grid grid-cols-2 gap-x-1">
                        {#each servers as server, idx}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div
                                on:click={() => {
                                    serverIdx = idx
                                    showServerList = false
                                }}
                                class="relative rounded p-2 pl-7 hover:bg-indigo-200 hover:dark:bg-indigo-800 {idx === serverIdx && 'bg-indigo-400 text-white'}"
                            >
                                <span class="{idx === serverIdx ? 'font-medium' : ''} block truncate">{server}</span>
                                {#if idx === serverIdx}
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-1">
                                        <i class="bi bi-check" />
                                    </span>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </ul>
            {/if}
        </div>

        <!-- svelte-ignore a11y-autofocus -->
        <input
            placeholder="Summoner name"
            type="text"
            class="h-12 w-full rounded border-0 bg-white p-2 shadow outline-0 ring-indigo-400 focus:ring-4 dark:bg-zinc-800"
            on:keypress={handleKeyPress}
            bind:value={username}
            autofocus
        />

        <button
            class={`col-span-2 h-12 rounded bg-indigo-400 p-2 font-bold tracking-widest text-white shadow hover:bg-indigo-500 ${
                loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            on:click={handleSearch}
        >
            {#if loading}
                <div class="flex items-center justify-center">
                    <i class="bi bi-arrow-clockwise block animate-spin " />
                    <span class="ml-3">Loading...</span>
                </div>
            {:else}
                Search
            {/if}
        </button>

        <div class="col-span-2">
            <CachedPlayers summonerName={username} />
        </div>
    </div>

    {#if error}
        <div class="auto mx-auto mb-5 rounded border border-red-900 bg-red-200 py-3 px-6 text-red-900 shadow dark:bg-red-900 dark:text-white md:w-96">
            <strong class="font-bold">
                <i class="bi bi-emoji-frown-fill" /> Oh no!
            </strong>
            <p>Sorry, that player doesn&apos;t seem to exist.</p>
            <p>Is it the correct server ?</p>
        </div>
    {/if}
</div>
