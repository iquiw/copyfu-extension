<script lang="ts">
  import appIcon from '@/assets/copyfu.svg';

  import Cog from './Cog.svelte';
  import Format from './Format.svelte';
</script>

<main class="border-2 border-tertiary-100 rounded-md">
  <div class="grid grid-cols-1 gap-2 mx-3 mt-3 mb-2">
    <Format />
    <div class="flex justify-end">
      <img src={appIcon} class="logo" alt="CopyFU Logo" />
      <h4 class="app-name text-lg font-bold text-tertiary-600-400">CopyFU</h4>
      <span class="grow"></span>
      <button type="button" class="btn options" title={browser.i18n.getMessage('options_title')} onclick={() => browser.runtime.openOptionsPage()}>
        <Cog/>
      </button>
    </div>
  </div>
</main>

<style>
  .logo {
    margin: 0.5rem;
    height: 1.5rem;
  }
  .app-name {
    height: 2.20rem;
    line-height: 2.25rem;
  }
</style>
