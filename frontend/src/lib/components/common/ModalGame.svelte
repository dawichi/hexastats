<!--
  @component
  ## ModalGame
  used to display a game inside a modal
-->
<script lang="ts">
    import { styles } from '$lib/config'
    import { modalGameContext } from '$lib/context/modalGame'
    import type { GameDetailDto } from '$lib/types'

    const modal = {
        // Element.showModal() is still not noted in TS lib definitions
        open: () => {
            if (!document?.querySelector('[data-modal-game]')) return
            ;(document?.querySelector('[data-modal-game]') as any).showModal()
        },
        close: () => {
            if (!document?.querySelector('[data-modal-game]')) return
            ;(document?.querySelector('[data-modal-game]') as any).close()
        },
    }

    // This memo the state to prevent multiple calls
    let isModalOpen = false
    let game: GameDetailDto
    $: modalGameContext.subscribe(val => {
        game = val.game

        // Skip re-render if the value is the same
        if (val.isModalOpen === isModalOpen) return

        // Update the memo and run the logic
        isModalOpen = val.isModalOpen
        val.isModalOpen ? modal.open() : modal.close()
    })
</script>

<dialog data-modal-game class="relative h-96 w-96 {styles.background} rounded p-2 text-white">
    {#if game}
        <div>
            {game.matchId}
        </div>
    {/if}
    <button
        class="absolute top-2 right-2"
        on:click={() =>
            modalGameContext.update(val => ({
                ...val,
                isModalOpen: false,
            }))}
    >
        <i class="bi bi-x rounded border border-red-500 p-1 text-red-500 hover:bg-red-500 hover:text-white" />
    </button>
</dialog>

<style>
    dialog::backdrop {
        background-color: rgba(12, 12, 12, 0.5);
    }
</style>
