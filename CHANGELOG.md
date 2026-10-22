# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][]

### Changed

#### Breaking Change

- Declaring `vue` (`^3.5.2`) as `peerDependencies`. Previously, the package didn't declare its Vue dependency. Vue v3.5.2 is the minimum version supported by the package type declarations
- Renaming UMD output from `dist/vue-skeleton-content-loader.umd.js` to `dist/vue-skeleton-content-loader.umd.cjs`, since the package is `"type": "module"` and `.js` files are loaded as ES modules. It's now exposed via `unpkg`/`jsdelivr` fields and can be loaded via `require()`
- A CSS unit passed in `size` (E.G: `size="10em"`) now takes precedence over `measure-unit`, instead of being ignored
- `VueSkeletonContentLoader` now renders a single root element (`<div>`, a block element) wrapping the skeleton items, instead of rendering skeleton items as multiple root elements. Skeletons placed side by side without a flex or grid container are now rendered in separate lines. Attributes that are not props (E.G: `class`, `style`, `id` or `data-*`) are now added in the root element, instead of being ignored with a Vue warning
- WAI-ARIA attributes (`role="progressbar"`, `aria-busy`, `aria-valuemin`, `aria-valuemax`, `aria-label` and `aria-valuetext`) are now applied once in the root element, instead of in every skeleton item, so screen readers announce a single progress bar per component. Skeleton items are hidden from assistive technologies via `aria-hidden="true"` and no longer have `tabindex="-1"`. Code or tests querying these attributes in `.skeleton-loader` items need to query the root element instead
- Renaming CSS custom properties with `--vue-skeleton-content-loader-` prefix (E.G: `--base-color` is now `--vue-skeleton-content-loader-base-color`), avoiding collisions with CSS custom properties of the app

#### Other Changes

- Upgrading project to Node.js v24, Vite v8, Vitest v5, ESLint v10 (flat config), TypeScript v6 and latest versions of other dev dependencies
- Decreasing bundle size from 998B to 874B (ES) and from 966B to 938B (UMD) - gzip - by minifying the ES output and removing `Symbol.toStringTag` from the generated code
- Replacing `bundlesize` with `bundlesize2`, since `bundlesize` native dependencies don't work in Node.js v24
- Removing unused dev dependencies and configurations
- Adding CI via GitHub Actions: lint (including formatting), type check, unit tests, build, bundle size, SSR rendering of the built package (`npm run test:ssr`) and demo build, plus Dependabot updates for GitHub Actions
- Checking the packed package with the minimum `vue` version from `peerDependencies` in CI (`npm run check:min-peer`), including SSR rendering and type checking of a consumer app using the package type declarations
- Keeping modern CSS as is in the package build (`build.cssTarget: 'esnext'`), since consumers' bundlers handle their own browser targets
- Publishing only `dist`, `index.js` and `CHANGELOG.md` files (besides `README.md`, `LICENSE` and `package.json`) via `files` field, instead of `.npmignore`
- Rendering skeletons via `v-for` over a number instead of creating an array
- Using a single class binding for skeleton items, computed once for all of them, instead of one binding per appearance/animation class
- Improving rendering performance by scoping CSS `will-change` to the animated parts only: `transform` on the `progress`/`progress-dark` shimmer and `opacity` on `pulse`/`pulse-dark`. Skeletons without animation, or rendered with `prefers-reduced-motion: reduce`, are no longer promoted to their own GPU layer. In the demo page, composited layers dropped from 146 to 84 with animations
- Replacing `transform: translate3d(0, 0, 0)` with `isolation: isolate` in `progress`/`progress-dark` skeletons, keeping the shimmer clipped by `border-radius` without an extra GPU layer
- Adding CSS containment (`contain: layout paint`) to skeletons, isolating their layout and paint work from the rest of the page. There are no visual changes, since skeletons were already using `overflow: hidden` and `position: relative`
- Improving `progress` and `progress-dark` animations by making the shimmer cross the skeleton based on its own width, instead of the viewport width (`100vw`). Previously, small skeletons (E.G: a `40px` circle) displayed the shimmer for only a fraction of the animation duration
- Replacing deprecated `min-device-width` media query with `(hover: hover) and (pointer: fine)` to show the `wait` cursor and disable text selection only on devices with mouse/trackpad
- Removing unused and duplicated CSS rules, decreasing CSS bundle size from 791B to 762B (gzip), and checking CSS bundle size via `npm run bundlesize`

### Added

- Adding `./style.css` and `./package.json` to package `exports`, and `sideEffects` field, so bundlers can tree-shake the package safely
- Adding docs about CDN usage (UMD build) and minimum Vue version on `README.md` file
- Adding docs about rendered HTML, accessibility and theming via CSS custom properties on `README.md` file
- Adding `wave` animation, similar to `progress` but with an oblique shimmer
- Adding stagger effect via `--vue-skeleton-content-loader-animation-stagger` CSS custom property (`0s` by default), delaying each item animation based on its index. Items also expose their index via `--vue-skeleton-content-loader-index`, which can be used in custom animations
- Adding right-to-left (RTL) support for `progress`, `progress-dark` and `wave` animations: the shimmer crosses the skeleton from right to left when an ancestor element (or the component itself) has `dir="rtl"`
- Adding opt-in dark mode via `color-scheme` prop (`auto` follows the user's color scheme preference, `dark` forces dark colors) or via `--vue-skeleton-content-loader-color-scheme` CSS custom property, using `light-dark()` for the default base and shimmer colors. Browsers without `light-dark()` support keep the light colors
- Adding support for type-safe custom animations. Consumers can register their own animation names by extending `VueSkeletonContentLoaderCustomAnimations` interface via TypeScript declaration merging, and use them via `animation` prop. They are rendered as CSS class with `animation-` prefix (E.G: `animation="my-wave"` renders `.skeleton-loader.animation-my-wave`) and disabled automatically - including the ones applied to `::before`/`::after` - when user prefers reduced motion
- Accepting `undefined` values in `theme` prop, removing the style
- Adding examples of the new features in the demo page, which now imports the package as consumers do

### Fixed

- Fixing type declarations of the component slot referencing an internal type (`__VLS_2`), which raised TypeScript errors in apps with `skipLibCheck: false`
- Fixing CSS custom properties being ignored when set in an ancestor element, such as `:root`, `body` or a wrapper element. Now they are consumed with their default values as fallback, keeping the `:theme` support
- Fixing `main` field in `package.json`, pointing to a file that doesn't exist (`./dist/index.js`)
- Fixing `size` for `square` appearance ignoring decimal values (E.G: `1.5` became `15`) and CSS units passed in `size` (E.G: `10rem` became `10px`). Invalid values (E.G: `abc`) don't add `width`/`height` styles anymore, instead of adding `0px`
- Fixing `custom-content` appearance rendering the slot content multiple times when `count` is bigger than `1`. `count` is now forced to `1`, with a warning in development mode
- Fixing invalid `count` values (E.G: `0` or `"abc"`) rendering no skeletons. They render a single skeleton now, and decimal values are truncated
- Fixing `progress-dark` animation still running when user prefers reduced motion
- Fixing global registration example in `README.md` file, which used a default export that doesn't exist
- Fixing outdated info and commands on `CONTRIBUTING.md` and `PUBLISHING_HOTFIX.md` files

## [1.2.0][] - 2025-08-27

### Added

- Adding info about `measure-unit` usage on `README.md` file
- Adding support for different CSS measurement units via `measure-unit` input attribute

### Fixed

- Removing unnecessary folders from package distribution

## [1.1.1][] - 2025-06-13

### Changed

- Improving internal types

### Fixed

- Fixing `npm run lint` command. The command was complaining with ESLint config file format, so it was moved to CJS.

## [1.1.0][] - 2025-06-11

### Changed

- Updating docs to reflect new appearance for `square` option
- Updating docs to reflect new `size` props to be used when chosen appearance is `square`
- Updating examples with latest changes

### Added
- Adding new appearance for `square`. This one will also accept and require `size` as prop. So that, it can render a square.

## [1.0.2][] - 2025-06-09

### Added

- Moving CSS Params into CSS Vars

## [1.0.1][] - 2025-06-09

### Added

- Adding bundlesize validation

### Changed

- Fixing docs to refer to correct StackBlitz link

## [1.0.0][] - 2025-06-09

### Added
- Created `VueSkeletonContentLoader` package


[Unreleased]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/willmendesneto/vue-skeleton-content-loader/tree/v1.0.0
