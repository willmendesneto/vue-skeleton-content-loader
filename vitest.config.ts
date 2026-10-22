import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [resolve(import.meta.dirname, 'vitest.setup.ts')],
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.vue', '.json'],
  },
});
