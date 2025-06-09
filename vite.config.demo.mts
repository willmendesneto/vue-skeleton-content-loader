import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { name } from './package.json';

export default defineConfig({
  base: process.env.GH_PAGES === 'true' ? `/${name}/` : '/',
  root: resolve(__dirname, 'demo'),
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: resolve(__dirname, 'dist-demo'),
  },
});
