import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    permissions: ['clipboardWrite', 'storage', 'tabs'],
    commands: {
      "_execute_action": {
        "suggested_key": {
          "default": "Ctrl+Shift+U",
        },
      },
    },
  },
  modules: ['@wxt-dev/module-svelte'],

  vite: () => ({
    plugins: [
      tailwindcss(),
    ],
  }),
});
