<script lang="ts">
  import { formatTemplate } from '../../lib/format';

  let { index, error, name = $bindable(''), value = $bindable('') } = $props();

  let exampleContext = {
    url: 'https://example.com',
    title: 'タイトル',
  };

  function format(template: string): any {
    try {
      return formatTemplate(template, exampleContext);
    } catch (e) {
      return e;
    }
  };

  function clear(): void {
    name = '';
    value = '';
    error = '';
  };
</script>

<header class="header bg-surface-50 dark:text-gray-800 rounded-md p-2">Template {index}</header>
<label class="label">
  <span class="label-text">Name</span>
  {#if error == 'Name'}
  <input class="input border-1 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer interactive" bind:value={name} required/>
  <span class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
    Please input Name!
  </span>
  {:else}
  <input class="input placeholder-gray-300 dark:placeholder-gray-600 interactive" bind:value={name} placeholder="Markdown" required/>
  {/if}
</label>
<label class="label">
  <span class="label-text">Template</span>
  {#if error == 'Template'}
  <textarea class="textarea border-1 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer interactive" bind:value={value} required></textarea>
  <span class="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
    Please input Template!
  </span>
  {:else}
  <textarea class="textarea placeholder-gray-300 dark:placeholder-gray-600 interactive" bind:value={value} placeholder="[&lbrace;&lbrace;title&rbrace;&rbrace;](&lbrace;&lbrace;url&rbrace;&rbrace;)" required></textarea>
  {/if}
</label>
<label class="label">
  <span class="label-text">Example output</span>
  <textarea class="textarea bg-surface-100 dark:text-surface-800" readonly tabindex="-1">{format(value)}</textarea>
</label>
<div class="grid justify-center m-2">
  <button class="btn preset-tonal interactive" onclick={clear} z-index="1000">Clear</button>
</div>
