import { terser } from 'rollup-plugin-terser';

const terserConfig = terser({
  mangle: {
      properties: false,
  },
  compress: false,
});

export default {
  input: './src/FuzzyTable.js',
  output: {
    file: 'dist/FuzzyTable.js',
    format: 'es',
    name: 'FuzzyTable',
    sourcemap: true
  },
  plugins: [
    terserConfig,
  ]
};
