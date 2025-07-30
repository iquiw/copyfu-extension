<script lang="ts">
  import { copyFormattedTemplate } from '../../lib/clipboard';
  import { loadTemplates } from '../../lib/storage';

  let formatsCache = null;

  async function copy(index: number): Promise<void> {
    if (formatsCache != null && index < formatsCache.length) {
      let template = formatsCache[index].template;
      await copyFormattedTemplate(template);
      window.close();
    }
  }

  function handleKeydown(event) {
    if (event.key >= '1' || event.key <= '9') {
      let number = parseInt(event.key, 10);
      if (number > 0) {
        copy(number - 1);
      }
    }
  }
</script>

{#await loadTemplates().then((fs) => { formatsCache = fs; return fs; })}
<p>Loading...</p>
{:then formats}
{#each formats as format, index}
<button type="button" class="btn preset-filled-primary-500" onclick={() => copy(index)}>
  <div class="flex w-full">
    <div class="flex-none">{index + 1}:</div>
    <div class="grow">
      {format.name}
    </div>
  </div>
</button>
{/each}
{/await}

<svelte:window onkeydown={handleKeydown} />
