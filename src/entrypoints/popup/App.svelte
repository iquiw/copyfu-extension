<script lang="ts">
  import Format from './Format.svelte';
</script>

<main>
  <div class="grid grid-cols-1 gap-2 m-4">
    <Format />
    <button type="button" class="btn preset-filled-surface-500" onclick={() => browser.runtime.openOptionsPage()}>Options</button>
  </div>
</main>
