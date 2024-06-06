import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/FuzzyTable.js',
  output: {
    file: 'dist/FuzzyTable.js',
    format: 'umd',  // UMD format for universal compatibility
    name: 'FuzzyTable'
  },
  plugins: [
    terser()
  ]
};
