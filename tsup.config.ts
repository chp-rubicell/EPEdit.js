import { defineConfig } from 'tsup';

export default defineConfig([
  // default
  {
    entry: { 'epedit': 'src/index.ts' },
    // format: ['cjs', 'esm'],
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    minify: false,
  },
  // minified
  {
    entry: { 'epedit-mini': 'src/index.ts' },
    // format: ['cjs', 'esm'],
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    minify: true,
  }
]);