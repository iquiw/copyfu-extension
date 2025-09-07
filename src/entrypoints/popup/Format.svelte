<script lang="ts">
  import { copyFormattedTemplate, FormatResult } from '@/lib/clipboard';
  import { loadTemplates } from '@/lib/storage';
  import type { FormatTemplate } from '@/lib/storage';
  import { COMMAND_MESSAGE_COPY_TEMPLATE } from '@/lib/command';

  const VISUAL_EFFECT_DURATION = 500;
  let formatsCache: FormatTemplate[] | null = null;
  let formatResults: FormatResult[] | null = null;
  let eventProcessing = false;

  async function copy(index: number, event?: Event): Promise<void> {
    eventProcessing = true;
    const button = event?.currentTarget;
    if (button != null && formatsCache != null && formatResults != null && index < formatsCache.length) {
      const template = formatsCache[index].template;
      const result = await copyFormattedTemplate(template);
      formatResults[index] = result;
      if (result == FormatResult.Success) {
        setTimeout(() => {
          window.close();
        }, VISUAL_EFFECT_DURATION);
      } else {
        setTimeout(() => {
          if (formatResults != null) {
            formatResults[index] = FormatResult.Initial;
          }
          eventProcessing = false;
        }, VISUAL_EFFECT_DURATION);
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key >= '1' || event.key <= '9') {
      const index = parseInt(event.key, 10);
      if (index > 0) {
        const button = document.getElementById(`copy-button-${index - 1}`);
        if (button != null) {
          button.click();
        }
      }
    }
  }

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == COMMAND_MESSAGE_COPY_TEMPLATE) {
      const button = document.getElementById(`copy-button-${request.index - 1}`);
      if (button != null) {
        button.click();
        sendResponse({ success: true });
        return;
      }
    }
    sendResponse({ success: false });
  });
</script>

{#await loadTemplates().then((fs) => {
  formatsCache = fs;
  formatResults = Array(fs.length).fill(FormatResult.Initial);
  return fs;
})}
<p>Loading...</p>
{:then formats}
{#each formats as format, index}
  {#if formatResults == null || formatResults[index] == FormatResult.Initial}
  <button id="copy-button-{index}" type="button" class="btn preset-filled-primary-500" disabled={eventProcessing}
          onclick={() => copy(index, event)}>
    <div class="flex w-full">
      <div class="flex-none">{index + 1}:</div>
      <div class="grow">{format.name}</div>
    </div>
  </button>
  {:else if formatResults[index] === FormatResult.Success}
  <button type="button" class="btn preset-filled-success-300-700 dark:preset-filled-success-700-300">
    <div class="flex w-full">
      <div class="flex-none">{index + 1}:</div>
      <div class="grow">{browser.i18n.getMessage('popup_button_result_success')}</div>
    </div>
  </button>
  {:else if formatResults[index] === FormatResult.Empty}
  <button type="button" class="btn preset-filled-warning-300-700 dark:preset-filled-warning-700-300">
    <div class="flex w-full">
      <div class="flex-none">{index + 1}:</div>
      <div class="grow">{browser.i18n.getMessage('popup_button_result_empty')}</div>
    </div>
  </button>
  {:else if formatResults[index] === FormatResult.NoLink}
  <button type="button" class="btn preset-filled-warning-300-700 dark:preset-filled-warning-700-300">
    <div class="flex w-full">
      <div class="flex-none">{index + 1}:</div>
      <div class="grow">{browser.i18n.getMessage('popup_button_result_nolink')}</div>
    </div>
  </button>
  {:else if formatResults[index] === FormatResult.Error}
  <button type="button" class="btn preset-filled-error-200-800 dark:preset-filled-error-900-100">
    <div class="flex w-full">
      <div class="flex-none">{index + 1}:</div>
      <div class="grow">{browser.i18n.getMessage('popup_button_result_error')}</div>
    </div>
  </button>
  {/if}
{/each}
{/await}

<svelte:window onkeydown={handleKeydown} />
