<script lang="ts">
  import { formatTemplate } from '../../lib/format';

  let { index, error, exampleUrl, exampleTitle, exampleFeeds,
    name = $bindable(''), value = $bindable(''),
  } = $props();

  let exampleOutput = $derived.by(() => {
    let feeds = [];
    try {
      feeds = JSON.parse(exampleFeeds);
    } catch {
    }
    try {
      return formatTemplate(value, {
        url: exampleUrl,
        title: exampleTitle,
        feeds,
      });
    } catch (e) {
      return e;
    }
  });

  function clear(): void {
    name = '';
    value = '';
    error = '';
  };
</script>

<header class="header cursor-move bg-surface-100-900 rounded-md p-2">⋮⋮ {browser.i18n.getMessage('options_label_template')} {index}</header>
<label class="label">
  <span class="label-text">{browser.i18n.getMessage('options_label_name')}</span>
  {#if error == 'Name'}
  <input class="input border-1 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer interactive" bind:value={name} required/>
  <span class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
    {browser.i18n.getMessage('options_error_name_missing')}
  </span>
  {:else}
  <input class="input placeholder-gray-300 dark:placeholder-gray-600 interactive" bind:value={name} placeholder="Markdown" required/>
  {/if}
</label>
<label class="label">
  <span class="label-text">{browser.i18n.getMessage('options_label_template')}</span>
  {#if error == 'Template'}
  <textarea class="textarea border-1 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer interactive" bind:value={value} required></textarea>
  <span class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
    {browser.i18n.getMessage('options_error_template_missing')}
  </span>
  {:else}
  <textarea class="textarea placeholder-gray-300 dark:placeholder-gray-600 interactive" bind:value={value} placeholder="[&lbrace;&lbrace;title&rbrace;&rbrace;](&lbrace;&lbrace;url&rbrace;&rbrace;)" required></textarea>
  {/if}
</label>
<label class="label">
  <span class="label-text">{browser.i18n.getMessage('options_label_example_output')}</span>
  <textarea class="textarea bg-surface-100-900" readonly tabindex="-1">{exampleOutput}</textarea>
</label>
<div class="grid justify-center m-2">
  <button class="btn preset-tonal interactive" onclick={clear}>{browser.i18n.getMessage('options_button_clear')}</button>
</div>
