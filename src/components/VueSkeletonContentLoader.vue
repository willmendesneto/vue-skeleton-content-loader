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
  });

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
    ...(size.value && { width: size.value, height: size.value }),
    ...props.theme,
  }));

  // NOTE: Template has a single root element, so attributes that are not props (e.g. `class`)
  // fall through to it. It also has the WAI-ARIA attributes, rendering a single progress bar per
  // component, while skeleton items are hidden from assistive technologies via `aria-hidden`

  // Classes shared by all skeleton items, computed once instead of per item
  const classes = computed(
    () =>
      // `RegExp.test()` converts values to string, including `animation` as boolean (`false`)
      `skeleton-loader ${/^(circle|square|custom-content)$/.test(props.appearance) ? props.appearance : ''} ${
        /^(progress|pulse)(-dark)?$/.test(props.animation as string) ? props.animation : ''
      }`,
  );
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
    <div v-for="item in count" :key="item" :class="classes" aria-hidden="true" :style="styles">
      <slot v-if="props.appearance === 'custom-content'"></slot>
    </div>
  </div>
</template>

<style scoped>
  .skeleton-loader {
    /**
      * CSS custom properties are NOT declared in here, only consumed with a fallback value.
      * Declaring them in `.skeleton-loader` would override any value set in an ancestor element
      * (e.g. `:root`, `body` or a wrapper), making them customizable only via `theme` prop.
      * Available CSS custom properties (and their default values):
      * - `--vue-skeleton-content-loader-base-color`: rgb(239, 241, 246)
      * - `--vue-skeleton-content-loader-light-mode-color`: rgba(255, 255, 255, 0.6)
      * - `--vue-skeleton-content-loader-light-mode-color-to`: rgba(255, 255, 255, 0)
      * - `--vue-skeleton-content-loader-dark-mode-color`: rgba(0, 0, 0, 0.2)
      * - `--vue-skeleton-content-loader-dark-mode-color-to`: transparent
      * - `--vue-skeleton-content-loader-animation-duration`: 2s
      * - `--vue-skeleton-content-loader-background-image-light-mode`: gradient based on light mode colors
      * - `--vue-skeleton-content-loader-background-image-dark-mode`: gradient based on dark mode colors
      */
    box-sizing: border-box;
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
    background: var(--vue-skeleton-content-loader-base-color, rgb(239, 241, 246)) no-repeat;
    border-radius: 4px;
    width: 100%;
    height: 20px;
    display: inline-block;
    margin-bottom: 10px;
  }

  /**
    * Added only when `appearance` prop is `circle` or `square`
    */
  .skeleton-loader.circle,
  .skeleton-loader.square {
    width: 40px;
    height: 40px;
    margin: 5px;
  }
  .skeleton-loader.circle {
    border-radius: 50%;
  }

  /**
    * Added only when `animation` prop is `progress` or `progress-dark`.
    * The shimmer is a 200px gradient aligned to the right of a `:before` element which is
    * 200px wider than the skeleton. Translating it from -100% to 0 makes the shimmer cross
    * the whole skeleton - and only the skeleton - regardless of its width
    */
  .skeleton-loader.progress,
  .skeleton-loader.progress-dark {
    /**
      * Creates a stacking context, so the animated `:before` is clipped by `border-radius`
      * in every browser (e.g. Safari) without promoting the skeleton to its own GPU layer
      */
    isolation: isolate;
  }
  .skeleton-loader.progress:before,
  .skeleton-loader.progress-dark:before {
    box-sizing: border-box;
    will-change: transform;
    animation: progress var(--vue-skeleton-content-loader-animation-duration, 2s) ease-in-out
      infinite;
    background: no-repeat right / 200px 100%;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: calc(100% + 200px);
    height: 100%;
    content: '';
  }
  .skeleton-loader.progress:before {
    background-image: var(
      --vue-skeleton-content-loader-background-image-light-mode,
      linear-gradient(
        90deg,
        var(--vue-skeleton-content-loader-light-mode-color-to, rgba(255, 255, 255, 0)),
        var(--vue-skeleton-content-loader-light-mode-color, rgba(255, 255, 255, 0.6)),
        var(--vue-skeleton-content-loader-light-mode-color-to, rgba(255, 255, 255, 0))
      )
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
  .skeleton-loader.pulse,
  .skeleton-loader.pulse-dark {
    will-change: opacity;
    animation: pulse var(--vue-skeleton-content-loader-animation-duration, 2s)
      cubic-bezier(0.4, 0, 0.2, 1) 0.5s infinite;
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
    .skeleton-loader.pulse,
    .skeleton-loader.pulse-dark,
    .skeleton-loader.progress:before,
    .skeleton-loader.progress-dark:before {
      animation: none;
      will-change: auto;
    }
    .skeleton-loader.progress:before,
    .skeleton-loader.progress-dark:before {
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
