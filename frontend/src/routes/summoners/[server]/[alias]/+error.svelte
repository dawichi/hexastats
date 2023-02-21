<script>
    import { page } from '$app/stores'
</script>

<div class="p-4 lg:p-8 w-96 m-auto">
    <h1 class="flex flex-col justify-center items-center">
        <i class="bi bi-emoji-frown text-6xl mb-4"></i>
        <p>Oh no! Something went wrong</p>
    </h1>

    {#if $page?.error}
        <div class="mt-4 border-y-2 p-4">
            {#if $page?.status}
                <p>Error {$page?.status}</p>
            {/if}

            {#if $page?.error?.message}
                <p>{$page?.error?.message}</p>
            {/if}
        </div>
    {/if}
</div>
