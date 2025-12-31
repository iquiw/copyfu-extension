<script lang="ts">
  import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';

  let { buttonClass, buttonTitle, tooltip, callback, disabled = false } = $props();
</script>

<Tooltip positioning={{ placement: 'top' }}>
  <Tooltip.Trigger>
    <button class={buttonClass} disabled={disabled} onclick={callback}>{buttonTitle}</button>
  </Tooltip.Trigger>
  <Portal>
    <Tooltip.Positioner>
      <Tooltip.Content class="card preset-filled p-4">
        {tooltip}
        <Tooltip.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-950-50)]">
          <Tooltip.ArrowTip />
        </Tooltip.Arrow>
      </Tooltip.Content>
    </Tooltip.Positioner>
  </Portal>
</Tooltip>
