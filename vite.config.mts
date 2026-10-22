import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue(), dts({ bundleTypes: true, include: ['src'], exclude: ['src/**/*.spec.ts'] })],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: {
        'vue-skeleton-content-loader': resolve(import.meta.dirname, 'src/index.ts'),
      },
      name: 'VueSkeletonContentLoader',
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      // Keeps `dist/style.css` name, imported by `index.js`
      cssFileName: 'style',
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        minify: true,
        generatedCode: { symbols: false },
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
