import { defineConfig } from 'tsup';

export default defineConfig([
  // default
  {
    outDir: 'dist',
    entry: { 'epedit': 'src/index.ts' },
    // format: ['cjs', 'esm'],
    format: ['esm'],
    dts: true,
    splitting: true,
    sourcemap: false,
    clean: true,
    minify: false,
  },
  // minified
  {
    outDir: 'dist',
    entry: { 'epedit.mini': 'src/index.ts' },
    format: ['cjs', 'esm'],
    // format: ['esm'],
    dts: true,
    splitting: true,
    sourcemap: false,
    clean: true,
    minify: true,
  }
]);