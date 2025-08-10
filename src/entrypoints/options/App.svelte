<script lang="ts">
  import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte';
  import { draggable, controls, events, position, Compartment, ControlFrom } from '@neodrag/svelte';

  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import { loadTemplates, saveTemplates, serialize } from '../../lib/storage';
  import type { FormatTemplate } from '../../lib/storage';

  import { importTemplates, exportTemplates } from './imex';

  import { validate } from './validate';
  import type { FormatTemplateForm, FormatTemplateFormResult } from './validate';

  import TemplateEdit from './TemplateEdit.svelte';
  import { flipDuration, flipWorkaroundPlugin } from './neodrag-plugin-flip';
  import appIcon from '../../assets/copyfu.svg';

  const toaster = createToaster({
    placement: 'top-end'
  });

  let ftemplForms: FormatTemplateForm[] = $state([]);
  let ftemplsOriginal: FormatTemplate[] | null = $state(null);

  let storagePromise = $state(loadTemplates().then((ftemplsLoad) => {
    ftemplsOriginal = ftemplsLoad;
    for (let ftempl of ftemplsLoad) {
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
    let result = validate(ftemplForms);
    ftemplForms = result.ftemplForms;
    if (!result.hasError) {
      ftemplsOriginal = await saveTemplates(ftemplForms);
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
    let original = serialize(ftemplsOriginal);
    let current = serialize(ftemplForms);
    let modified = original != current;
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
    let elements = document.elementsFromPoint(event.clientX, event.clientY);
    for (let element of elements) {
      let indexStr = element.getAttribute('data-ftempl-index');
      if (indexStr != null) {
        let index = parseInt(indexStr, 10);
        if (ftemplForms[index].id !== dragState?.ftemplId) {
          return index;
        }
      }
    }
    return -1;
  }

  function clickImportFile() {
    let input = document.getElementById('import-file');
    input?.click();
  }

  function handleImport(event: Event) {
    let input = event.target as HTMLInputElement;
    if (!input || !input.files) {
      return;
    }
    let file = input.files[0];
    if (!file) {
      return;
    }
    input.value = '';
    importTemplates(file,
      (ftemplsImport) => {
        ftemplForms = [];
        for (let ftempl of ftemplsImport) {
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
</script>

<svelte:window onbeforeunload={beforeUnload} />

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="{appIcon}" />
</svelte:head>

<main>
  <Toaster {toaster} width="min-w-sm" messageClasses="toast-message"></Toaster>
  <div class="grid m-2 space-y-2">
    <h2 class="h2">{browser.i18n.getMessage('options_title')}</h2>
    <div class="text-sm">
      <p>{@html browser.i18n.getMessage('options_help_text1')}</p>
      <p>{@html browser.i18n.getMessage('options_help_text2')}</p>
      <p>{@html browser.i18n.getMessage('options_help_text3')}</p>
    </div>
    <div class="flex space-x-2">
      <button class="btn preset-filled-success-100-900 dark:preset-filled-success-900-100" disabled={!isModified} onclick={() => storagePromise = save()}>{browser.i18n.getMessage('options_button_save')}</button>
      <button class="btn preset-filled-primary-300-700 dark:preset-filled-primary-900-100" onclick={() => storagePromise = add()}>{browser.i18n.getMessage('options_button_add')}</button>
      <button class="btn preset-filled-secondary-300-700 dark:preset-filled-secondary-900-100" onclick={() => exportTemplates(ftemplsOriginal)}>{browser.i18n.getMessage('options_button_export')}</button>
      <button class="btn preset-filled-secondary-300-700 dark:preset-filled-secondary-900-100" onclick={clickImportFile}>{browser.i18n.getMessage('options_button_import')}</button>
    </div>
    <input id="import-file" class="hidden" type="file" onchange={handleImport}/>
    {#await storagePromise}
    <p>Loading...</p>
    {:then dummy}
    <div class="grid grid-cols-2 gap-8">
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
          <TemplateEdit index={index + 1} error={ftemplForm.error} bind:name={ftemplForm.name} bind:value={ftemplForm.template} />
        </div>
      {/each}
    </div>
    {/await}
  </div>
</main>
