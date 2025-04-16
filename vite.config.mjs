// vite.config.mjs
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
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
