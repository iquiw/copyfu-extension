<script lang="ts">
  import { copyFormattedTemplate } from '../../lib/clipboard';
  import { loadTemplates } from '../../lib/storage';

  async function copy(template: string): void {
    await copyFormattedTemplate(template);
    window.close();
  }
</script>

{#await loadTemplates()}
<p>Loading...</p>
{:then formats}
{#each formats as format}
<button type="button" class="btn preset-filled-primary-500" onclick={() => copy(format.template)}>{format.name}</button>
{/each}
{/await}
