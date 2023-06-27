<script lang="ts">
    import { onMount } from 'svelte'
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'

    const [x, y, server, summoner, page_num] = $page.url.pathname.split("/")

    onMount(async () => {
        // Redirect to the first page
        goto(`/summoners/${server}/${summoner}/1`)
    })
</script>

Redirecting to the first page...
