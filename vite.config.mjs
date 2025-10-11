
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(), // Load Svelte plugin for dev mode
  ],
  build: {
    // Plain JS build (original)
    lib: {
      entry: path.resolve('src/FuzzyTable.js'),
      name: 'FuzzyTable',
      fileName: 'FuzzyTable.min',
      formats: ['umd', 'es'],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'FuzzyTable.min.css';
          }
          return assetInfo.name;
        },
      },
    },
    cssCodeSplit: true,
  },
});
