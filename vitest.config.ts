import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vitePluginDts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    vitePluginDts({
      // this is an expensive operation that is necessary so that we can
      // know exactly where to reference types in the package exports
      rollupTypes: true,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.vue', '.json'],
  },
});
