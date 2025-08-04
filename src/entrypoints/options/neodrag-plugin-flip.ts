// This is a workaround for the following warning.
//   "Invalid keyframe value for property transform: translate(NaNpx, NaNpx) scale(Infinity, Infinity)"
// The warning is not shown if duration is null in the anmiate:flip parameter.
import { unstable_definePlugin } from '@neodrag/core/plugins';

let flipDurationStore: number | undefined = undefined;

export function flipDuration(): number | undefined {
  return flipDurationStore;
}

export const flipWorkaroundPlugin = unstable_definePlugin(() => ({
  name: 'my:flipWorkaround',
  start(ctx, state, event) {
    flipDurationStore = 200;
  },
  cleanup(ctx, state) {
    flipDurationStore = undefined;
  },
}));
