<script lang="ts">
    import { page } from "$app/stores"
    import { Container } from "$lib/components"

    const [x, y, server, alias, page_num] = $page.url.pathname.split('/')
</script>

<Container title="" description="" disableHeader>
    <div>
        <a href="/summoners/{server}/{alias}/1" class="rounded bg-indigo-500 px-2 text-white hover:bg-indigo-600">
            <i class="bi bi-arrow-90deg-left"></i> BACK TO GAMES LIST
        </a>
    </div>
</Container>