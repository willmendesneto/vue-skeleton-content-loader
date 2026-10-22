// Renders the built package (ES and UMD outputs) via `vue/server-renderer` in Node.js, checking
// that `dist` files work without a browser/DOM, as in SSR apps (e.g. Nuxt or Vite SSR).
// Unit tests run against the source files, so build-only issues weren't caught.
import { readFileSync } from 'node:fs';
import { runInThisContext } from 'node:vm';
import * as Vue from 'vue';
import { renderToString } from 'vue/server-renderer';

const fail = (message) => {
  console.error(`SSR check failed: ${message}`);
  process.exit(1);
};

const render = (component) =>
  renderToString(Vue.createSSRApp({ render: () => Vue.h(component, { count: 2 }) }));

const { VueSkeletonContentLoader: esComponent } =
  await import('../dist/vue-skeleton-content-loader.es.js');

// UMD output is loaded as a `<script>` tag would do it: using `Vue` global
globalThis.Vue = Vue;
runInThisContext(readFileSync('dist/vue-skeleton-content-loader.umd.js', 'utf8'));
const umdComponent = globalThis.VueSkeletonContentLoader?.VueSkeletonContentLoader;

for (const [format, component] of [
  ['ES', esComponent],
  ['UMD', umdComponent],
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
