<script lang="ts">
  import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte';
  import { draggable, controls, events, bounds, position, BoundsFrom, Compartment, ControlFrom } from '@neodrag/svelte';

  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import { loadTemplates, saveTemplates } from '../../lib/storage';
  import TemplateEdit from './TemplateEdit.svelte';
  import appIcon from '../../assets/copyfu.svg';

  interface FormatTemplateForm {
    id: string,
    name: string,
    template: string,
    error: string | null,
  }

  const toaster = createToaster({
     placement: 'top-end'
  });

  let ftempls: FormatTemplateForm[] = $state([]);
  let storagePromise = $state(loadTemplates().then((ftemplsLoad) => {
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
    let ftemplsSave = [];
    let hasError = false;
    for (let i = 0; i < ftempls.length; ) {
      let ftempl = ftempls[i];
      let name = ftempl.name.trim();
      let template = ftempl.template;
      ftempl.error = null;
      if (name == '') {
        if (template == '') {
          // skip
          ftempls.splice(i, 1);
          continue;
        } else {
          ftempl.error = 'Name';
          hasError = true;
        }
      } else if (template == '') {
        ftempl.error = 'Template';
        hasError = true;
      }
      if (ftempl.error == null) {
        ftemplsSave.push({ name, template })
      }
      i++;
    }
    if (!hasError) {
      await saveTemplates(ftemplsSave);
      toaster.success({
        title: 'Saved!'
      });
    }
    if (ftempls.length == 0) {
      await add();
    }
    return null;
  }

  let dragState = null;

  const positionComp = new Compartment(() =>
    position({ current: null }),
  );

  function findTargetIndex(event, ftemplId: string): number {
    let elements = document.elementsFromPoint(event.clientX, event.clientY);
    for (let element of elements) {
      let indexStr = element.getAttribute('data-ftempl-index');
      if (indexStr != null) {
        let index = parseInt(indexStr, 10);
        if (ftempls[index].id !== ftemplId) {
          return index;
        }
      }
    }
    return -1;
  }
</script>

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
      <button class="btn preset-filled-success-100-900 dark:preset-filled-success-900-100" onclick={() => storagePromise = save()}>Save</button>
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
            positionComp,
            controls({ allow: ControlFrom.selector('.header') }),
            events({
              onDragStart: (data) => {
                data.rootNode.style.zIndex = 100;
                dragState = { ftemplId: ftempl.id };
              },
              onDragEnd: (data) => {
                data.rootNode.style.zIndex = '';
                if (dragState == null) {
                  return;
                }
                const dragIndex = ftempls.findIndex((ftempl: FormatTemplateForm) => ftempl.id === dragState.ftemplId);;
                const dropIndex = findTargetIndex(data.event, dragState.ftemplId);

                positionComp.current = position({ current: { x: 0, y: 0 } });
                if (dragIndex !== -1 && dropIndex !== -1 && !isNaN(dropIndex)) {
                  const [item] = ftempls.splice(dragIndex, 1);
                  ftempls.splice(dropIndex, 0, item);
                }
                dragState = null;
              },
            })
          ])}
          animate:flip={{ duration: 200 }}>
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
