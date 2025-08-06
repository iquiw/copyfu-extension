<script lang="ts">
  import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte';
  import { draggable, controls, events, position, Compartment, ControlFrom } from '@neodrag/svelte';

  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import { loadTemplates, saveTemplates, serialize } from '../../lib/storage';
  import type { FormatTemplate } from '../../lib/storage';

  import { validate } from './validate';
  import type { FormatTemplateForm, FormatTemplateFormResult } from './validate';

  import TemplateEdit from './TemplateEdit.svelte';
  import { flipDuration, flipWorkaroundPlugin } from './neodrag-plugin-flip';
  import appIcon from '../../assets/copyfu.svg';

  const toaster = createToaster({
     placement: 'top-end'
  });

  let ftempls: FormatTemplateForm[] = $state([]);
  let ftemplsOriginal: FormatTemplate[] | null = $state(null);

  let storagePromise = $state(loadTemplates().then((ftemplsLoad) => {
    ftemplsOriginal = ftemplsLoad;
    for (let ftempl of ftemplsLoad) {
      addTemplate(ftempl.name, ftempl.template);
    }
    if (ftempls.length == 0) {
      addTemplate();
    }
    return null;
  }));

  function addTemplate(name: string = '', template: string = ''): void {
    ftempls.push({ id: crypto.randomUUID(), name, template, error: null, });
  }

  function add(name: string = '', template: string = ''): Promise<null> {
    addTemplate();
    return Promise.resolve(null);
  }

  async function save(): Promise<null> {
    let result = validate(ftempls);
    ftempls = result.ftempls;
    if (!result.hasError) {
      ftemplsOriginal = await saveTemplates(ftempls);
      toaster.success({
        title: 'Saved!'
      });
    }
    if (ftempls.length == 0) {
      addTemplate();
    }
    return null;
  }

  let isModified = $derived.by(() => {
    let original = serialize(ftemplsOriginal);
    let current = serialize(ftempls);
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
        if (ftempls[index].id !== dragState?.ftemplId) {
          return index;
        }
      }
    }
    return -1;
  }
</script>

<svelte:window onbeforeunload={beforeUnload} />

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="{appIcon}" />
</svelte:head>

<main>
  <Toaster {toaster}></Toaster>
  <div class="grid m-2 space-y-2">
    <h2 class="h2">CopyFU Options</h2>
    <div>
      <p>Copy URL and Title with formatted by <a href="https://liquidjs.com" class="anchor">Liquid</a> template.</p>
      <p>
        <code class="code">&lbrace;&lbrace;url&rbrace;&rbrace;</code> and <code class="code">&lbrace;&lbrace;title&rbrace;&rbrace;</code> are replaced by actual URL and title of the current page.
      </p>
      <p>To change the order, drag and drop the templates. To delete a template, clear the template and save.</p>
    </div>
    <div class="flex space-x-2">
      <button class="btn preset-filled-success-100-900 dark:preset-filled-success-900-100" disabled={!isModified} onclick={() => storagePromise = save()}>Save</button>
      <button class="btn preset-filled-primary-300-700 dark:preset-filled-primary-900-100" onclick={() => storagePromise = add()}>Add</button>
    </div>
    {#await storagePromise}
    <p>Loading...</p>
    {:then dummy}
    <div class="grid grid-cols-2 gap-8">
      {#each ftempls as ftempl, index (ftempl.id)}
        <div class="card w-full preset-outlined-primary-500 p-2"
          data-ftempl-index={index}
          {@attach draggable(() => [
            flipWorkaroundPlugin(),
            positionComp,
            controls({ allow: ControlFrom.selector('.header') }),
            events({
              onDragStart: (data) => {
                data.rootNode.style.zIndex = '100';
                dragState = { ftemplId: ftempl.id };
              },
              onDragEnd: (data) => {
                data.rootNode.style.zIndex = '';
                const dragIndex = ftempls.findIndex((ftempl: FormatTemplateForm) => ftempl.id === dragState?.ftemplId);;
                const dropIndex = findTargetIndex(data.event);

                positionComp.current = position({ current: { x: 0, y: 0 } });
                if (dragIndex !== -1 && dropIndex !== -1 && !isNaN(dropIndex)) {
                  const [item] = ftempls.splice(dragIndex, 1);
                  ftempls.splice(dropIndex, 0, item);
                }
                dragState = null;
              },
            })
          ])}
          animate:flip={{ duration: flipDuration() }}>
          <TemplateEdit index={index + 1} error={ftempl.error} bind:name={ftempl.name} bind:value={ftempl.template} />
        </div>
      {/each}
    </div>
    {/await}
  </div>
</main>

<style>
  .card {
    background-color: inherit;
  }
</style>
