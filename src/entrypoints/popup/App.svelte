<script lang="ts">
  import { Settings } from '@lucide/svelte';
  import appIcon from '../../assets/copyfu.svg';

  import Format from './Format.svelte';
</script>

<main>
  <div class="grid grid-cols-1 gap-2 m-4">
    <Format />
    <div class="flex justify-end">
      <img src={appIcon} class="logo" alt="CopyFU Logo" />
      <h4 class="h4">CopyFU</h4>
      <span class="grow"></span>
      <button type="button" class="btn options" title="Options" onclick={() => browser.runtime.openOptionsPage()}>
        <Settings size="24" />
      </button>
    </div>
  </div>
</main>

<style>
  .logo {
    margin: 0.5rem;
    height: 1.5rem;
  }
  .h4 {
    height: 2.25rem;
    line-height: 2.25rem;
  }
</style>
