import { defineConfig } from 'tsup';

export default defineConfig([
  // default
  {
    outDir: 'build',
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
    outDir: 'build',
    entry: { 'epedit-mini': 'src/index.ts' },
    // format: ['cjs', 'esm'],
    format: ['esm'],
    dts: true,
    splitting: true,
    sourcemap: false,
    clean: true,
    minify: true,
  }
]);