<!--
  @component
  ## EmptyPlayers component
  View when there are no players
-->
<script>
    import { styles } from '$lib/config'
</script>

<div class="animate__animated animate__fadeIn flex h-96 flex-col items-center justify-center text-2xl">
    <i class="bi bi-emoji-frown-fill" />
    <h2>There is no players !</h2>
    <p>To visualize their data, add them first !</p>
    <br />
    <p>Go back to Home page</p>
    <a href="/">
        <button
            title="Add more players"
            class="{styles.foreground} {styles.card} m-1 cursor-pointer py-2 px-3 hover:bg-indigo-600 hover:text-white hover:dark:bg-indigo-600"
        >
            <i class="bi bi-person-plus-fill" />
        </button>
    </a>
</div>
