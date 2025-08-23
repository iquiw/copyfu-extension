import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    permissions: ['activeTab', 'clipboardWrite', 'storage', 'tabs'],
    commands: {
      "_execute_action": {
        "suggested_key": {
          "default": "Ctrl+Shift+U",
        },
      },
      "copy-template-1": {
        "description": "Copy with template 1",
      },
      "copy-template-2": {
        "description": "Copy with template 2",
      },
      "copy-template-3": {
        "description": "Copy with template 3",
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
