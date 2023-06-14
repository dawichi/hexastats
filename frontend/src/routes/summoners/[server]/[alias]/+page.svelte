<script lang="ts">
    import { goto } from '$app/navigation'
    import { onMount } from "svelte"
    import type { PlayerDto } from "$lib/types"
    import Spinner from '$lib/components/common/Spinner.svelte'

    /** @type {import('./$types').PageData} */
    export let data: {
        server: string
        player: PlayerDto
    }

    onMount(async () => {
        console.log(data)

        // Redirect to the first page
        goto(`/summoners/${data.server}/${data.player.alias}/1`)
    })
</script>

<Spinner />
<h1 class="text-center text-2xl">Getting data for: <br /> {data.player.alias}</h1>
