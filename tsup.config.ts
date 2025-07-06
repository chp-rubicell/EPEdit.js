import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'epedit-mini': 'src/index.ts' },
  // format: ['cjs', 'esm'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
});