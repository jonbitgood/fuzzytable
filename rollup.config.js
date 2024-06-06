import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/FuzzyTable.js',
  output: {
    file: './dist/FuzzyTable.mjs',
    format: 'esm',
    name: 'FuzzyTable', // This will attach `FuzzyTable` to the `window` object in browsers
    globals: {
      FuzzyTable: 'FuzzyTable'
    }
  },
  plugins: [
    terser()
  ]
};
