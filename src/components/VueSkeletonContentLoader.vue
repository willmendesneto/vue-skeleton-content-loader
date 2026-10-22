<script setup lang="ts">
  import { computed, warn } from 'vue';
  import { VueSkeletonContentLoaderConfig } from '@/components/VueSkeletonContentLoader.types';

  // Converts a size (e.g. `10`, `'1.5'`, `'10rem'`) into a CSS value, using `unit` if it has none
  const toCSSSize = (
    size: VueSkeletonContentLoaderConfig['size'],
    unit: VueSkeletonContentLoaderConfig['measureUnit'],
  ) => {
    const [, value, sizeUnit] = `${size}`.match(/^\s*(\d*\.?\d+)(px|em|rem|%|vh|vw)?\s*$/) || [];

    return value ? value + (sizeUnit || unit) : null;
  };

  const props = withDefaults(defineProps<Partial<VueSkeletonContentLoaderConfig>>(), {
    loadingText: 'Loading...',
    ariaLabel: 'loading',
    appearance: 'line',
    count: 1,
    size: null,
    animation: 'progress',
    theme: null,
    measureUnit: 'px',
    colorScheme: 'light',
  });

  // Explicit slots type, so the generated type declarations don't reference internal types
  defineSlots<{
    /** Content rendered when `appearance` is `custom-content` */
    default?: () => unknown;
  }>();

  // Number of skeletons. `v-for` over a number renders items from 1 to `count`
  const count = computed(() => {
    const total = Math.trunc(+props.count) || 1;

    // `custom-content` renders the slot content, so it should be a single DOM node
    if (props.appearance === 'custom-content' && total !== 1) {
      // `warn` is a no-op in production builds of Vue
      warn('"custom-content" appearance renders a single skeleton');
      return 1;
    }
    return total;
  });

  const size = computed(() =>
    props.appearance === 'square' ? toCSSSize(props.size, props.measureUnit) : null,
  );

  // Styles can be passed as a prop to customize the skeleton loader
  const styles = computed<VueSkeletonContentLoaderConfig['theme']>(() => ({
    // `light` is the default color scheme, set via CSS (`undefined` values are not rendered)
    'color-scheme': ({ auto: 'light dark', dark: 'dark' } as Record<string, string>)[
      props.colorScheme
    ],
    ...(size.value && { width: size.value, height: size.value }),
    ...props.theme,
  }));

  // NOTE: Template has a single root element, so attributes that are not props (e.g. `class`)
  // fall through to it. It also has the WAI-ARIA attributes, rendering a single progress bar per
  // component, while skeleton items are hidden from assistive technologies via `aria-hidden`.
  // Items also expose their index (from 0) via `--vue-skeleton-content-loader-index`, used by
  // the stagger effect and available for custom animations

  // Classes shared by all skeleton items, computed once instead of per item.
  // Custom animations are `animation-` prefixed to avoid collisions with internal classes
  const classes = computed(() => {
    const { appearance, animation } = props;

    return `skeleton-loader ${/^(circle|square|custom-content)$/.test(appearance) ? appearance : ''} ${
      !animation || animation === 'false'
        ? ''
        : /^(wave|(progress|pulse)(-dark)?)$/.test(animation)
          ? animation
          : `animation-${animation}`
    }`;
  });
</script>

<template>
  <div
    role="progressbar"
    aria-busy="true"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="props.ariaLabel"
    :aria-valuetext="props.loadingText"
  >
    <div
      v-for="item in count"
      :key="item"
      :class="classes"
      aria-hidden="true"
      :style="[styles, { '--vue-skeleton-content-loader-index': item - 1 }]"
    >
      <slot v-if="props.appearance === 'custom-content'"></slot>
    </div>
  </div>
</template>

<style scoped>
  .skeleton-loader {
    /**
      * Public CSS custom properties are NOT declared in here, only consumed with a fallback value.
      * Declaring them in `.skeleton-loader` would override any value set in an ancestor element
      * (e.g. `:root`, `body` or a wrapper), making them customizable only via `theme` prop.
      * Available CSS custom properties (and their default values, as `light-dark(<light>, <dark>)`
      * when they change based on the color scheme):
      * - `--vue-skeleton-content-loader-color-scheme`: light (`light dark` follows user's preference)
      * - `--vue-skeleton-content-loader-base-color`: light-dark(rgb(239, 241, 246), rgb(48, 52, 61))
      * - `--vue-skeleton-content-loader-light-mode-color`: light-dark(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1))
      * - `--vue-skeleton-content-loader-light-mode-color-to`: rgba(255, 255, 255, 0)
      * - `--vue-skeleton-content-loader-dark-mode-color`: rgba(0, 0, 0, 0.2)
      * - `--vue-skeleton-content-loader-dark-mode-color-to`: transparent
      * - `--vue-skeleton-content-loader-animation-duration`: 2s
      * - `--vue-skeleton-content-loader-animation-stagger`: 0s (delay between items, based on their index)
      * - `--vue-skeleton-content-loader-index`: item index, set per item (read-only, for custom animations)
      * - `--vue-skeleton-content-loader-background-image-light-mode`: gradient based on light mode colors
      * - `--vue-skeleton-content-loader-background-image-dark-mode`: gradient based on dark mode colors
      *
      * Internal (`--_vscl-` prefixed) CSS custom properties hold the default colors, so they can
      * use `light-dark()` only in browsers supporting it (see `@supports` rule below).
      */
    --_vscl-base-color: rgb(239, 241, 246);
    --_vscl-light-mode-color: rgba(255, 255, 255, 0.6);

    box-sizing: border-box;
    /**
      * Dark mode is opt-in: skeletons use light colors by default. `color-scheme="auto"` prop or
      * `--vue-skeleton-content-loader-color-scheme: light dark` make default colors follow the
      * user's color scheme preference (OS and/or browser), and `dark` forces dark colors.
      * More details in https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
      */
    color-scheme: var(--vue-skeleton-content-loader-color-scheme, light);
    /**
      * `overflow` and `position` are required steps to make sure
      * the component respects the specified dimensions
      * given via `theme` prop
      */
    overflow: hidden;
    position: relative;
    /**
      * Isolates skeleton layout and paint from the rest of the page, so changes inside of it
      * (e.g. animations or `custom-content`) don't trigger layout/paint work outside of it.
      * More details in https://developer.mozilla.org/en-US/docs/Web/CSS/contain
      */
    contain: layout paint;
    background: var(--vue-skeleton-content-loader-base-color, var(--_vscl-base-color)) no-repeat;
    border-radius: 4px;
    width: 100%;
    height: 20px;
    display: inline-block;
    margin-bottom: 10px;
  }

  /**
    * Browsers without `light-dark()` support keep the light colors. Using it directly as fallback
    * of `var()` would make the whole declaration invalid in these browsers (e.g. no background)
    */
  @supports (color: light-dark(#000, #fff)) {
    .skeleton-loader {
      --_vscl-base-color: light-dark(rgb(239, 241, 246), rgb(48, 52, 61));
      --_vscl-light-mode-color: light-dark(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1));
    }
  }

  /**
    * Added only when `appearance` prop is `circle` or `square`
    */
  .skeleton-loader:is(.circle, .square) {
    width: 40px;
    height: 40px;
    margin: 5px;
  }
  .skeleton-loader.circle {
    border-radius: 50%;
  }

  /**
    * Added only when `animation` prop is `progress`, `progress-dark` or `wave`.
    * The shimmer is a 200px gradient aligned to the right of a `:before` element which is
    * 200px wider than the skeleton. Translating it from -100% to 0 makes the shimmer cross
    * the whole skeleton - and only the skeleton - regardless of its width
    */
  .skeleton-loader:is(.progress, .progress-dark, .wave) {
    /**
      * Creates a stacking context, so the animated `:before` is clipped by `border-radius`
      * in every browser (e.g. Safari) without promoting the skeleton to its own GPU layer
      */
    isolation: isolate;
  }
  .skeleton-loader:is(.progress, .progress-dark, .wave):before {
    box-sizing: border-box;
    will-change: transform;
    animation: progress var(--vue-skeleton-content-loader-animation-duration, 2s) ease-in-out
      infinite;
    /**
      * Stagger effect: each item is delayed based on its index (`--vue-skeleton-content-loader-index`,
      * set per item) and `--vue-skeleton-content-loader-animation-stagger` (`0s` by default)
      */
    animation-delay: calc(
      var(--vue-skeleton-content-loader-index, 0) *
        var(--vue-skeleton-content-loader-animation-stagger, 0s)
    );
    background: no-repeat right / 200px 100%;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: calc(100% + 200px);
    height: 100%;
    content: '';
  }
  /**
    * Right-to-left support: reversing the animation makes the shimmer cross the skeleton
    * from right to left, when an ancestor element (or the component itself) has `dir="rtl"`.
    * NOTE: `:dir(rtl)` is not used, since build tools (e.g. Lightning CSS, used by Vite)
    * transpile it into `:lang()` selectors for older browsers, which don't match `dir` attribute
    */
  [dir='rtl'] .skeleton-loader:is(.progress, .progress-dark, .wave):before {
    animation-direction: reverse;
  }
  .skeleton-loader.progress:before {
    background-image: var(
      --vue-skeleton-content-loader-background-image-light-mode,
      linear-gradient(
        90deg,
        var(--vue-skeleton-content-loader-light-mode-color-to, rgba(255, 255, 255, 0)),
        var(--vue-skeleton-content-loader-light-mode-color, var(--_vscl-light-mode-color)),
        var(--vue-skeleton-content-loader-light-mode-color-to, rgba(255, 255, 255, 0))
      )
    );
  }
  /* `wave` uses the same shimmer of `progress` animation, but with an oblique gradient */
  .skeleton-loader.wave:before {
    background-image: linear-gradient(
      120deg,
      transparent 30%,
      var(--vue-skeleton-content-loader-light-mode-color, var(--_vscl-light-mode-color)),
      transparent 70%
    );
  }
  .skeleton-loader.progress-dark:before {
    background-image: var(
      --vue-skeleton-content-loader-background-image-dark-mode,
      linear-gradient(
        90deg,
        var(--vue-skeleton-content-loader-dark-mode-color-to, transparent),
        var(--vue-skeleton-content-loader-dark-mode-color, rgba(0, 0, 0, 0.2)),
        var(--vue-skeleton-content-loader-dark-mode-color-to, transparent)
      )
    );
  }

  /**
    * Added only when `animation` prop is `pulse` or `pulse-dark`
    */
  .skeleton-loader:is(.pulse, .pulse-dark) {
    will-change: opacity;
    animation: pulse var(--vue-skeleton-content-loader-animation-duration, 2s)
      cubic-bezier(0.4, 0, 0.2, 1) infinite;
    animation-delay: calc(
      0.5s + var(--vue-skeleton-content-loader-index, 0) *
        var(--vue-skeleton-content-loader-animation-stagger, 0s)
    );
  }
  .skeleton-loader.pulse-dark {
    background: var(--vue-skeleton-content-loader-dark-mode-color, rgba(0, 0, 0, 0.2));
  }
  .skeleton-loader.custom-content {
    height: 100%;
    background: none;
  }

  /**
    * Removing animations if user enabled the `Reduce Motion` option
    * via operating system and/or browser
    */
  @media (prefers-reduced-motion: reduce) {
    .skeleton-loader:is(.pulse, .pulse-dark),
    .skeleton-loader:is(.progress, .progress-dark, .wave):before,
    /**
      * Custom animations are rendered as `animation-<name>` classes. None of the internal
      * classes contains `animation-`, so these selectors disable any custom animation -
      * including the ones in pseudo-elements. Their specificity is higher than
      * `.skeleton-loader.animation-<name>` (consumer global CSS)
      */
    .skeleton-loader[class*='animation-'],
    .skeleton-loader[class*='animation-']:before,
    .skeleton-loader[class*='animation-']:after {
      animation: none;
      will-change: auto;
    }
    .skeleton-loader:is(.progress, .progress-dark, .wave):before {
      background-image: none;
    }
  }

  /**
    * Removing selection and adding `wait` cursor only on devices with mouse/trackpad
    * (e.g. desktops and laptops), since the content is loading
    */
  @media (hover: hover) and (pointer: fine) {
    .skeleton-loader {
      user-select: none;
      cursor: wait;
    }
  }

  @keyframes progress {
    0% {
      transform: translate3d(-100%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
</style>
