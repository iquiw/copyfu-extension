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
    browser_specific_settings: {
      gecko: {
        "id": "{ea350ae6-d119-44b0-a6d7-91b9235ad119}",
      },
    },
    default_locale: 'en',
    homepage_url: "https://github.com/iquiw/copyfu-extension",
  },
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-svelte'],

  vite: () => ({
    plugins: [
      tailwindcss(),
    ],
  }),
});
