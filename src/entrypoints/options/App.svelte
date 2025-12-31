<script lang="ts">
  import { Github } from '@lucide/svelte';
  import { AppBar, Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
  import { draggable, controls, events, position, Compartment, ControlFrom } from '@neodrag/svelte';

  import { flip } from 'svelte/animate';

  import { COMMAND_P2B_REFRESH_MENU } from '@/lib/command';
  import { loadTemplates, saveTemplates, serialize } from '@/lib/storage';
  import type { FormatTemplate } from '@/lib/storage';

  import { importTemplates, exportTemplates } from './imex';

  import { validate } from './validate';
  import type { FormatTemplateForm } from './validate';

  import TemplateEdit from './TemplateEdit.svelte';
  import TTButton from './TTButton.svelte';
  import { flipDuration, flipWorkaroundPlugin } from './neodrag-plugin-flip';
  import appIcon from '@/assets/copyfu.svg';

  const toaster = createToaster({
    placement: 'top-end'
  });

  let ftemplForms: FormatTemplateForm[] = $state([]);
  let ftemplsOriginal: FormatTemplate[] | null = $state(null);

  let storagePromise = $state(loadTemplates().then((ftemplsLoad) => {
    ftemplsOriginal = ftemplsLoad;
    for (const ftempl of ftemplsLoad) {
      addTemplate(ftempl.name, ftempl.template);
    }
    if (ftemplForms.length == 0) {
      addTemplate();
    }
    return null;
  }));

  function addTemplate(name: string = '', template: string = ''): void {
    ftemplForms.push({ id: crypto.randomUUID(), name, template, error: null, });
  }

  function add(name: string = '', template: string = ''): Promise<null> {
    addTemplate();
    return Promise.resolve(null);
  }

  async function save(): Promise<null> {
    const result = validate(ftemplForms);
    ftemplForms = result.ftemplForms;
    if (!result.hasError) {
      const ftempls = await saveTemplates(ftemplForms);
      await browser.runtime.sendMessage({
        action: COMMAND_P2B_REFRESH_MENU,
        ftempls: ftempls,
      });
      ftemplsOriginal = ftempls;
      toaster.success({
        title: browser.i18n.getMessage('options_success_saved'),
      });
    }
    if (ftemplForms.length == 0) {
      addTemplate();
    }
    return null;
  }

  let isModified = $derived.by(() => {
    const original = serialize(ftemplsOriginal);
    const current = serialize(ftemplForms);
    const modified = original != current;
    return modified;
  });

  function beforeUnload(event: BeforeUnloadEvent) {
    if (isModified) {
      event.preventDefault();
      event.returnValue = true;
    }
  }

  interface DragState {
    ftemplId: string,
  };

  let dragState: DragState | null = null;

  const positionComp = new Compartment(() =>
    position({ current: null }),
  );

  function findTargetIndex(event: PointerEvent): number {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    for (const element of elements) {
      const indexStr = element.getAttribute('data-ftempl-index');
      if (indexStr != null) {
        const index = parseInt(indexStr, 10);
        if (ftemplForms[index].id !== dragState?.ftemplId) {
          return index;
        }
      }
    }
    return -1;
  }

  function clickImportFile() {
    const input = document.getElementById('import-file');
    input?.click();
  }

  function handleImport(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files) {
      return;
    }
    const file = input.files[0];
    if (!file) {
      return;
    }
    input.value = '';
    importTemplates(file,
      (ftemplsImport) => {
        ftemplForms = [];
        for (const ftempl of ftemplsImport) {
          addTemplate(ftempl.name, ftempl.template);
        }
        toaster.success({
          title: browser.i18n.getMessage('options_success_imported'),
          description: browser.i18n.getMessage('options_message_imported'),
        });
      },
      (error) => {
        toaster.error({
          title: browser.i18n.getMessage('options_error_imported'),
          description: error.message
        });
      }
    );
  }

  let exampleUrl = $state('https://example.com');
  let exampleTitle = $state(browser.i18n.getMessage('options_example_title_value'));
  let exampleFeeds = $state(`[{ "url":"https://example.com/feed", "title": "RSS Feed", "type": "rss" },{ "url":"https://example.com/atom", "title": "Atom Feed", "type": "atom" }]`);
</script>

<svelte:window onbeforeunload={beforeUnload} />

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="{appIcon}" />
</svelte:head>

<main class="min-w-2xl">
  <Toast.Group {toaster}>
    {#snippet children(toast)}
      <Toast toast={toast}>
	<Toast.Message>
	  <Toast.Title>{toast.title}</Toast.Title>
	  <Toast.Description>{toast.description}</Toast.Description>
	</Toast.Message>
	<Toast.CloseTrigger />
      </Toast>
    {/snippet}
  </Toast.Group>
  <div class="grid m-2 space-y-2">
    <AppBar class="p-2">
      <AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
        <AppBar.Lead class="pl-25" />
        <AppBar.Headline class="flex justify-center">
          <h1 class="text-lg font-bold text-tertiary-600-400">{browser.i18n.getMessage('options_title')}</h1>
        </AppBar.Headline>
        <AppBar.Trail class="flex gap-2">
          <a href={browser.runtime.getManifest().homepage_url} target="_blank" class="hover:preset-tonal"><Github size={24} /></a>
          <div>Version: {browser.runtime.getManifest().version}</div>
        </AppBar.Trail>
      </AppBar.Toolbar>
    </AppBar>
    <div class="text-sm">
      <p>{@html browser.i18n.getMessage('options_help_text1')}</p>
      <p>{@html browser.i18n.getMessage('options_help_text2')}</p>
      <p>{@html browser.i18n.getMessage('options_help_text3')}</p>
    </div>
    <div class="flex space-x-2">
      <TTButton
        buttonClass="btn preset-filled-success-300-700 dark:text-gray-100"
        buttonTitle={browser.i18n.getMessage('options_button_save')}
        tooltip={browser.i18n.getMessage('options_tooltip_save')}
        callback={() => storagePromise = save()}
        disabled={!isModified}
      />
      <TTButton
        buttonClass="btn preset-filled-primary-300-700"
        buttonTitle={browser.i18n.getMessage('options_button_add')}
        tooltip={browser.i18n.getMessage('options_tooltip_add')}
        callback={() => storagePromise = add()}
      />
      <TTButton
        buttonClass="btn preset-filled-secondary-300-700 dark:text-gray-100"
        buttonTitle={browser.i18n.getMessage('options_button_export')}
        tooltip={browser.i18n.getMessage('options_tooltip_export')}
        callback={() => exportTemplates(ftemplsOriginal)}
      />
      <TTButton
        buttonClass="btn preset-filled-secondary-300-700 dark:text-gray-100"
        buttonTitle={browser.i18n.getMessage('options_button_import')}
        tooltip={browser.i18n.getMessage('options_tooltip_import')}
        callback={clickImportFile}
      />
    </div>
    <input id="import-file" class="hidden" type="file" onchange={handleImport}/>
    <details>
      <summary>{browser.i18n.getMessage('options_summary_example_change')}</summary>
      <label for="example-url">
        {browser.i18n.getMessage('options_label_example_url')}
        <input id="example-url" class="input" bind:value={exampleUrl} />
      </label>
      <label for="example-title">
        {browser.i18n.getMessage('options_label_example_title')}
        <input id="example-title" class="input" bind:value={exampleTitle} />
      </label>
      <label for="example-feeds">
        {browser.i18n.getMessage('options_label_example_feeds')}
        <input id="example-feeds" class="input" bind:value={exampleFeeds} />
      </label>
    </details>
    {#await storagePromise}
    <p>Loading...</p>
    {:then dummy}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      {#each ftemplForms as ftemplForm, index (ftemplForm.id)}
        <div class="card w-full preset-outlined-primary-500 p-2"
          data-ftempl-index={index}
          {@attach draggable(() => [
            flipWorkaroundPlugin(),
            positionComp,
            controls({ allow: ControlFrom.selector('.header') }),
            events({
              onDragStart: (data) => {
                data.rootNode.style.zIndex = '100';
                dragState = { ftemplId: ftemplForm.id };
              },
              onDragEnd: (data) => {
                data.rootNode.style.zIndex = '';
                const dragIndex = ftemplForms.findIndex((ftemplForm: FormatTemplateForm) => ftemplForm.id === dragState?.ftemplId);;
                const dropIndex = findTargetIndex(data.event);

                positionComp.current = position({ current: { x: 0, y: 0 } });
                if (dragIndex !== -1 && dropIndex !== -1 && !isNaN(dropIndex)) {
                  const [item] = ftemplForms.splice(dragIndex, 1);
                  ftemplForms.splice(dropIndex, 0, item);
                }
                dragState = null;
              },
            })
          ])}
          animate:flip={{ duration: flipDuration() }}>
          <TemplateEdit index={index + 1} error={ftemplForm.error}
            {exampleUrl} {exampleTitle} {exampleFeeds}
            bind:name={ftemplForm.name} bind:value={ftemplForm.template} />
        </div>
      {/each}
    </div>
    {/await}
  </div>
</main>
