<script lang="ts">
  import { parseCopyOutput } from '@/lib/clipboard';
  import type { TypedText } from '@/lib/clipboard';
  import { formatTemplate } from '@/lib/format';

  let { index, error, errorPattern, exampleUrl, exampleTitle, exampleFeeds,
    name = $bindable(), value = $bindable(), pattern = $bindable(),
  } = $props();

  let exampleOutput = $derived.by((): TypedText | Error => {
    let feeds = [];
    try {
      feeds = JSON.parse(exampleFeeds);
    } catch {
    }
    try {
      const text = formatTemplate(value, {
        url: exampleUrl,
        title: exampleTitle,
        feeds,
      });
      return parseCopyOutput(text, exampleUrl);
    } catch (e) {
      return e instanceof Error ? e : new Error(String(e));
    }
  });

  function clear(): void {
    name = '';
    value = '';
    pattern = '';
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
  <span class="label-text">{browser.i18n.getMessage('options_label_url_pattern')}</span>
  {#if error == 'UrlPattern' && errorPattern == pattern}
  <input class="input border-1 not(:focus):border-red-500 peer interactive" bind:value={pattern} />
  <span class="mt-2 hidden text-sm text-red-500 peer-[:not(:focus)]:block">
    {browser.i18n.getMessage('options_error_url_pattern_invalid')}
  </span>
  {:else}
  <input class="input placeholder-gray-300 dark:placeholder-gray-600 interactive" bind:value={pattern} placeholder="^https://.*\.example\.com" />
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
  {#if exampleOutput instanceof Error}
  <div class="h-15.5 px-3 py-1 rounded-sm text-base text-surface-900-100 preset-filled-error-200-800">{exampleOutput.message}</div>
  {:else if exampleOutput.html !== undefined}
  <div class="h-15.5 px-3 py-1 rounded-sm text-base text-surface-50 bg-surface-500">{exampleOutput.html}</div>
  {:else}
  <textarea class="textarea bg-surface-100-900" readonly tabindex="-1">{exampleOutput.plain}</textarea>
  {/if}
</label>
<div class="grid justify-center m-2">
  <button class="btn preset-tonal interactive" onclick={clear}>{browser.i18n.getMessage('options_button_clear')}</button>
</div>
