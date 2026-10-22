import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  base: process.env.GH_PAGES === 'true' ? `/${pkg.name}/` : '/',
  root: resolve(import.meta.dirname, 'demo'),
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      // Demo imports the package as consumers do, using its source files
      'vue-skeleton-content-loader': resolve(import.meta.dirname, 'src/index.ts'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: resolve(import.meta.dirname, 'dist-demo'),
    emptyOutDir: true,
  },
});
