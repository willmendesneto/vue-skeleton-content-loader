# Vue Skeleton Content Loader

[![npm downloads](https://img.shields.io/npm/dm/vue-skeleton-content-loader.svg)](https://npmjs.org/vue-skeleton-content-loader)
[![npm](https://img.shields.io/badge/stackblitz-online-orange.svg)](https://stackblitz.com/edit/vue-skeleton-content-loader-sample)
[![npm](https://img.shields.io/badge/stackblitz-online-orange.svg)](https://stackblitz.com/edit/vue-skeleton-content-loader-user-card-component-sample)

[![NPM](https://nodei.co/npm/vue-skeleton-content-loader.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/vue-skeleton-content-loader)
[![NPM](https://nodei.co/npm-dl/vue-skeleton-content-loader.png?height=3&months=3)](https://npmjs.org/vue-skeleton-content-loader)

[![CI](https://github.com/willmendesneto/vue-skeleton-content-loader/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/willmendesneto/vue-skeleton-content-loader/actions/workflows/ci.yml)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/vue-skeleton-content-loader.svg)](https://bundlephobia.com/result?p=vue-skeleton-content-loader)
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](/LICENSE)

<!-- ![vue-skeleton-content-loader in action](https://user-images.githubusercontent.com/1252570/50053778-d4e0d900-018e-11e9-9de7-fad6f9fddd9e.gif) -->

## Why skeletons?

The idea of this component is to make the process transparent and easier. So the main point is to integrate this component with other tooling processes, such as:

- Server-side rendering;
- Progressive rendering;
- Any other that you like :)

It's totally transparent for you and you can integrate it easily into your application, improving your user experience 🎉

- [Demo](#demo)
- [Install](#install)
- [Usage](#usage)
- [Development](#development)
- [Contribute](#contribute)

## Demo

Try out our demos on Stackblitz!

- [Usage: animations, appearance, and themes](https://vue-skeleton-content-loader-sample.stackblitz.io)
- [User Card Component Loading simulation using Vue Skeleton Loader](https://vue-skeleton-content-loader-user-card-component-sample.stackblitz.io)

## Install

You can get it on NPM by installing the `vue-skeleton-content-loader` module as a project dependency.

```shell
npm install vue-skeleton-content-loader --save
```

> Requires Vue v3.5.2 or higher.

### Using via CDN

The package also provides an UMD build, exposing the component via `VueSkeletonContentLoader` global variable. It requires Vue's global build and the package styles to be loaded in the page.

```html
<link rel="stylesheet" href="https://unpkg.com/vue-skeleton-content-loader/dist/style.css" />
<script src="https://unpkg.com/vue/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/vue-skeleton-content-loader"></script>
<script>
  const app = Vue.createApp({});
  app.component('VueSkeletonContentLoader', VueSkeletonContentLoader.VueSkeletonContentLoader);
  app.mount('#app');
</script>
```

## Usage

### Basic Usage - Local import

To use `VueSkeletonContentLoader` in your Vue application, you first need to import it into your component's script section.

```typescript
// YourComponent.vue
<script setup lang="ts">
import { VueSkeletonContentLoader } from 'vue-skeleton-content-loader';
</script>

<template>
  <div class="item">
    <p>Circle Skeleton</p>
    <VueSkeletonContentLoader count="5" appearance="circle" />
  </div>
  <div class="item">
    <p>Line Skeleton</p>
    <VueSkeletonContentLoader count="5" appearance="line" />
  </div>
  <div class="item">
    <p>Square Skeleton</p>
    <VueSkeletonContentLoader count="5" appearance="square" />
    <VueSkeletonContentLoader count="5" appearance="square" measure-unit="rem" size="10" />
  </div>
</template>
```

### Global Registration - Component register via app boostrap file

For global availability across your application, you can register `VueSkeletonContentLoader` when you create your Vue app instance.

```typescript
// main.ts or main.js
import { createApp } from 'vue';
import App from './App.vue';
import { VueSkeletonContentLoader } from 'vue-skeleton-content-loader';

const app = createApp(App);
// Register globally
app.component('VueSkeletonContentLoader', VueSkeletonContentLoader);
app.mount('#app');
```

After global registration, you can use `<VueSkeletonContentLoader>` directly in any component's template without explicit import.

### Props

`VueSkeletonContentLoader` accepts several props to customize its behavior and appearance:

- `count` - _default_ `1`: Number of skeleton lines/shapes to render. Invalid values (E.G: `0` or `"abc"`) render a single skeleton. It's always `1` when `appearance` is `custom-content`.
- `animation` - _default_ `progress`: Defines the CSS animation. See [Animations](#animations) for options.
- `appearance` - _default_ `line`: Defines the shape of the skeleton. See [Appearance](#appearance) for options.
- `theme` - _default_ `null`: An object containing CSS styles to apply to the skeleton. See [Theming](#theming) for details.
- `size` - _default_ `null`: A number to be passed for the component if `appearance` is `square`. Uses `pixel` as default unit and accepts as number, number as string or number with CSS unit (E.G: `40`, `"1.5"` or `"10rem"`). A CSS unit passed in `size` takes precedence over `measure-unit`. Invalid values don't add `width`/`height` styles. It also supports `measure-unit` as optional way to change default CSS measure unit from `px` to one of the valid options: `px`, `em`, `rem`, `%`, `vh`, `vw`
- `loadingText` - _default_ `Loading...`: attribute that defines the text value for `aria-valuetext` attribute. Defaults to "Loading..."
- `aria-label` - _default_ `loading`: you can add `ariaLabel` as input of the component to set a different value.
- `color-scheme` - _default_ `light`: Defines the color scheme of the default colors: `light`, `dark` or `auto` (follows the user's preference). See [Color scheme (dark mode)](#color-scheme-dark-mode) for details.

### Rendered HTML and accessibility

`VueSkeletonContentLoader` renders a single root element (a block element, taking the full width of its container) wrapping the skeleton items. The root element has the WAI-ARIA attributes (`role="progressbar"`, `aria-busy`, `aria-valuemin`, `aria-valuemax`, `aria-label` and `aria-valuetext`), so screen readers announce a single progress bar per component. Skeleton items are hidden from assistive technologies via `aria-hidden="true"`.

Attributes that are not props, such as `class`, `style`, `id` or `data-*`, are added in the root element.

```html
<VueSkeletonContentLoader count="3" class="my-skeleton" data-testid="skeleton" />

<!-- Renders: -->
<div role="progressbar" aria-busy="true" aria-valuemin="0" aria-valuemax="100" aria-label="loading" aria-valuetext="Loading..." class="my-skeleton" data-testid="skeleton">
  <div class="skeleton-loader progress" aria-hidden="true"></div>
  <div class="skeleton-loader progress" aria-hidden="true"></div>
  <div class="skeleton-loader progress" aria-hidden="true"></div>
</div>
```

## Appearance

You can also define which appearance you want to use in your skeleton loader by passing the options in your component via the `:appearance` prop.

### Options

- `''` - _default_: it will use it `''` as appearance. At the end, it will render like a line;
- `line`: it will render like a line. This is the same behavior as passing an empty string;
- `circle`: it will use `circle` as appearance. Great for avatar skeletons, for example :);
- `square`: it will use `square` as appearance and render it appropriately. Great for cards and images, for example; It also requires `size` to be passed through the component - `size` has default size of `40px` and it has `measure-unit` as optional way to change default CSS measure unit from `px` to one of the valid options: `px`, `em`, `rem`, `%`, `vh`, `vw`
- `custom-content`: it will NOT add any appearance. Great for custom content, such as SVG, internal components and such. Although not rendering appearance, animation will be added unless component has `animation="false"` prop. It renders a single skeleton, even if `count` is bigger than `1`;

### Appearance props (specific for `square`)

When setting `square` as appearance, your component can also use these other input attributes to configure it properly
- `size` - default _40_: number to be passed as definition for `width` and `height`. If not passed, it defaults to `40`
- `measure-unit` - default _px_: CSS measure unit to be used for `width` and `height`. If not passed, it defaults to `px`. Valid options: `px`, `em`, `rem`, `%`, `vh`, `vw`

## Animations

You can also define which CSS animation you want to use - even not use any, if it's the case - in your skeleton loader by passing the options in your component via the `:animation` prop.

### Options

- `"false"`|`false`: it will disable the animation. Component will receive `false` as string when `animation` prop is not using binding;
- `progress` - _default_: it will use it `progress` as animation;
- `progress-dark`: it will use it `progress-dark` as animation. Recommended if your color schema is darken;
- `pulse`: it will use `pulse` as animation;
- `pulse-dark`: it will use it `pulse-dark` as animation. Recommended if your color schema is darken;
- `wave`: it will use `wave` as animation. Similar to `progress`, but with an oblique shimmer;
- Custom animations: see [Custom animations](#custom-animations).

> `progress` is the default animation, used as the single one previously. If you don't pass the animation attribute, it defaults to `progress`.

```html
<template>
  <div class="item">
    <!-- Disables the animation -->
    <VueSkeletonContentLoader animation="false" />
    <VueSkeletonContentLoader :animation="false" />
    <!-- Disables the animation, but receiving boolean value from binding -->
    <!-- Via binding it can receive `false` (boolean), "false" (string), or any other animation type -->
    <VueSkeletonContentLoader :animation="classAttributeWithBooleanFalseValue" />
    <!-- Uses `progress` as animation -->
    <VueSkeletonContentLoader animation="progress" />
    <VueSkeletonContentLoader />
    <!-- Uses `pulse` as animation -->
    <VueSkeletonContentLoader animation="pulse" />
  </div>
</template>
```

> You can check the code details in the [Stackblitz Live Demo Link](https://stackblitz.com/edit/vue-skeleton-content-loader-sample?file=app%2Fapp.component.html)

### Stagger effect

Each skeleton item animation can be delayed based on its index, via `--vue-skeleton-content-loader-animation-stagger` CSS custom property (`0s` by default: no delay). Items also expose their index (from `0`) via `--vue-skeleton-content-loader-index`, which can be used in custom animations.

```html
<!-- Each item starts its animation 0.2s after the previous one -->
<VueSkeletonContentLoader count="5" style="--vue-skeleton-content-loader-animation-stagger: 0.2s" />
```

### Right-to-left (RTL) layouts

`progress`, `progress-dark` and `wave` shimmers cross the skeleton from right to left when an ancestor element - or the component itself - has `dir="rtl"` attribute.

```html
<div dir="rtl">
  <VueSkeletonContentLoader count="3" />
</div>
```

### Custom animations

You can use your own animations via `animation` prop. They are rendered as CSS class with `animation-` prefix (E.G: `animation="my-wave"` renders `.skeleton-loader.animation-my-wave`), avoiding collisions with internal classes.

1. Register the animation name via TypeScript declaration merging, so it's a valid `animation` value (invalid names raise TypeScript errors in templates, via `vue-tsc`):

```typescript
// env.d.ts
import 'vue-skeleton-content-loader';

declare module 'vue-skeleton-content-loader' {
  interface VueSkeletonContentLoaderCustomAnimations {
    'my-wave': true;
  }
}
```

2. Add the animation styles in a global stylesheet (or via `:deep()`), since component styles are scoped:

```css
.skeleton-loader.animation-my-wave {
  animation: my-wave 1.5s ease-in-out infinite;
  /* Optional: using stagger effect */
  animation-delay: calc(
    var(--vue-skeleton-content-loader-index, 0) *
      var(--vue-skeleton-content-loader-animation-stagger, 0s)
  );
}

@keyframes my-wave {
  50% {
    background-color: #ffe9a8;
  }
}
```

3. Use it in the component:

```html
<VueSkeletonContentLoader animation="my-wave" />
```

> Custom animations - including the ones applied to `::before`/`::after` pseudo-elements - are disabled automatically when user prefers reduced motion.

## Theming

You can also define different styles for the skeleton loader by passing an object with the css styles - in dashed case - into the component via the `:theme` prop.

```html
<template>
  <!--
  If you need to change all the background wrapper
  you need to apply the style changes on the
  `vue-skeleton-content-loader` component wrapper
  -->

  <div style="background: #FF0001; padding: 10px;">
    <VueSkeletonContentLoader
      count="5"
      :theme="{
        'border-radius': '5px',
        height: '50px',
        'background-color': '#992929',
        border: '1px solid white'
      }"
    />
  </div>
</template>
```

The `:theme` prop now accepts the same configuration as Vue's `v-bind:style` directive. That means you can manage to use it like you're doing with the built-in directive, having a pleasant and beautiful experience.

```html
<template>
  <!--
  Note that we are using a combination of styles inside theme object,
  having `height.px` receiving a number and `background-color` receiving a HEX Color
  -->
  <div style="background: #FF0001; padding: 10px;">
    <VueSkeletonContentLoader
      count="5"
      :theme="{
        'height': `50px`,
        'background-color': '#992929'
      }"
    />
  </div>
</template>
```

> You should change the styles on the skeleton wrapper element in case you need to change the background color. You can check the code details in the [Stackblitz Live Demo Link](https://stackblitz.com/edit/vue-skeleton-content-loader-sample?file=app%2Fapp.component.html) or check out a content load simulation [in this Stackblitz Live Demo Link](https://stackblitz.com/edit/vue-skeleton-content-loader-user-card-component-sample?file=app%2Fapp.component.html)

### Theming via CSS custom properties

Skeletons can also be themed via CSS custom properties. They can be set in any ancestor element - such as `:root`, `body`, a wrapper element or the component itself (via `class` or `style` attributes) - or per skeleton item via `:theme` prop.

| CSS custom property | Default value |
| --- | --- |
| `--vue-skeleton-content-loader-color-scheme` | `light` (use `light dark` to follow the user's preference) |
| `--vue-skeleton-content-loader-base-color` | `rgb(239, 241, 246)` (dark mode: `rgb(48, 52, 61)`) |
| `--vue-skeleton-content-loader-light-mode-color` | `rgba(255, 255, 255, 0.6)` (dark mode: `rgba(255, 255, 255, 0.1)`) |
| `--vue-skeleton-content-loader-light-mode-color-to` | `rgba(255, 255, 255, 0)` |
| `--vue-skeleton-content-loader-dark-mode-color` | `rgba(0, 0, 0, 0.2)` |
| `--vue-skeleton-content-loader-dark-mode-color-to` | `transparent` |
| `--vue-skeleton-content-loader-animation-duration` | `2s` |
| `--vue-skeleton-content-loader-animation-stagger` | `0s` (delay between items, based on their index) |
| `--vue-skeleton-content-loader-index` | item index, set per item (read-only, for custom animations) |
| `--vue-skeleton-content-loader-background-image-light-mode` | gradient based on light mode colors (`progress` animation) |
| `--vue-skeleton-content-loader-background-image-dark-mode` | gradient based on dark mode colors (`progress-dark` animation) |

```css
/* Applies to every skeleton in the page */
:root {
  --vue-skeleton-content-loader-base-color: #e0e0e0;
  --vue-skeleton-content-loader-animation-duration: 1.5s;
}
```

```html
<!-- Applies to a single skeleton -->
<VueSkeletonContentLoader :theme="{ '--vue-skeleton-content-loader-base-color': '#992929' }" />
```

### Color scheme (dark mode)

Dark mode is opt-in: skeletons use light colors by default. It can be enabled via `color-scheme` prop - `auto` follows the user's color scheme preference (OS and/or browser) and `dark` forces dark colors - or via `--vue-skeleton-content-loader-color-scheme` CSS custom property.

```html
<!-- Follows the user's preference -->
<VueSkeletonContentLoader color-scheme="auto" />
<!-- Forces dark colors -->
<VueSkeletonContentLoader color-scheme="dark" />
```

```css
/* Follows the user's preference in every skeleton of the page */
:root {
  --vue-skeleton-content-loader-color-scheme: light dark;
}
```

> Default dark colors use CSS [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) function. Browsers without its support keep the light colors.

## Development

### Run demo locally

1. This project uses [Vite](https://vitejs.dev/) as base. That means you just need to run `npm run dev` and access the link `http://localhost:3000` (or whatever port Vite assigns) in your browser.

### Run tests

1. Run `npm test` to run tests. In case you want to test using watch, please use `npm run tdd`.

## Contribute

For any type of contribution, please follow the instructions in [CONTRIBUTING.md](https://github.com/willmendesneto/vue-skeleton-content-loader/blob/main/CONTRIBUTING.md) and read [CODE_OF_CONDUCT.md](https://github.com/willmendesneto/vue-skeleton-content-loader/blob/main/CODE_OF_CONDUCT.md) and [PUBLISHING_HOTFIX.md](https://github.com/willmendesneto/vue-skeleton-content-loader/blob/main/PUBLISHING_HOTFIX.md) files.

## Author

**Wilson Mendes (willmendesneto)**

- <https://instagram.com/willmendesneto>
- <http://github.com/willmendesneto>
