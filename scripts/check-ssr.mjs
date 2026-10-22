// Renders the built package (ES and UMD outputs) via `vue/server-renderer` in Node.js, checking
// that `dist` files work without a browser/DOM, as in SSR apps (e.g. Nuxt or Vite SSR).
// Unit tests run against the source files, so build-only issues weren't caught.
// `PACKAGE_DIR` environment variable sets the package folder (project root by default).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runInThisContext } from 'node:vm';
import * as Vue from 'vue';
import { renderToString } from 'vue/server-renderer';

const DIST_DIR = resolve(process.env.PACKAGE_DIR ?? '.', 'dist');
const ES_FILE = resolve(DIST_DIR, 'vue-skeleton-content-loader.es.js');
const UMD_FILE = resolve(DIST_DIR, 'vue-skeleton-content-loader.umd.cjs');

const fail = (message) => {
  console.error(`SSR check failed: ${message}`);
  process.exit(1);
};

const render = (component) =>
  renderToString(Vue.createSSRApp({ render: () => Vue.h(component, { count: 2 }) }));

const { VueSkeletonContentLoader: esComponent } = await import(pathToFileURL(ES_FILE).href);

// UMD output loaded via `require()` (CommonJS) and as a `<script>` tag would do it (`Vue` global)
const { VueSkeletonContentLoader: cjsComponent } = createRequire(import.meta.url)(UMD_FILE);
globalThis.Vue = Vue;
runInThisContext(readFileSync(UMD_FILE, 'utf8'));
const globalComponent = globalThis.VueSkeletonContentLoader?.VueSkeletonContentLoader;

console.log(`Vue v${Vue.version}`);

for (const [format, component] of [
  ['ES', esComponent],
  ['UMD (require)', cjsComponent],
  ['UMD (global)', globalComponent],
]) {
  if (!component) {
    fail(`${format} output doesn't export \`VueSkeletonContentLoader\``);
  }

  const html = await render(component);
  const skeletons = html.match(/class="skeleton-loader/g)?.length ?? 0;

  if (skeletons !== 2) {
    fail(`${format} output rendered ${skeletons} skeletons instead of 2: ${html}`);
  }
  console.log(`${format} output -> ${skeletons} skeletons`);
}

console.log('SSR check passed');
