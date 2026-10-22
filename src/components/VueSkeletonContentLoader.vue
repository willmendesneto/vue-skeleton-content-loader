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
</script>

<template>
  <div
    v-for="item in count"
    :key="item"
    :aria-label="props.ariaLabel"
    aria-busy="true"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuetext="props.loadingText"
    role="progressbar"
    tabindex="-1"
    :class="[
      'skeleton-loader',
      {
        'custom-content': props.appearance === 'custom-content',
        circle: props.appearance === 'circle',
        square: props.appearance === 'square',
        progress: props.animation === 'progress',
        'progress-dark': props.animation === 'progress-dark',
        pulse: props.animation === 'pulse',
        'pulse-dark': props.animation === 'pulse-dark',
      },
    ]"
    :style="styles"
  >
    <template v-if="props.appearance === 'custom-content'">
      <slot></slot>
    </template>
  </div>
</template>

<style scoped>
  .skeleton-loader {
    --base-color: rgb(239, 241, 246);
    --light-mode-color: rgba(255, 255, 255, 0.6);
    --light-mode-color-to: rgba(255, 255, 255, 0);
    --dark-mode-color: rgba(0, 0, 0, 0.2);
    --dark-mode-color-to: transparent;
    --animation-duration: 2s;
    --background-image-light-mode: linear-gradient(
      90deg,
      var(--light-mode-color-to),
      var(--light-mode-color),
      var(--light-mode-color-to)
    );
    --background-image-dark-mode: linear-gradient(
      90deg,
      var(--dark-mode-color-to),
      var(--dark-mode-color),
      var(--dark-mode-color-to)
    );

    box-sizing: border-box;
    /**
      * `overflow` and `position` are required steps to make sure
      * the component respects the specified dimensions
      * given via `theme` object @Input attribute
      */
    overflow: hidden;
    position: relative;
    background: var(--base-color) no-repeat;
    border-radius: 4px;
    width: 100%;
    height: 20px;
    display: inline-block;
    margin-bottom: 10px;
    will-change: transform;
  }
  .skeleton-loader:after,
  .skeleton-loader:before {
    box-sizing: border-box;
  }

  /**
    * Added only when `animation` attribute is `pulse`
    * at component level. So that we can load the
    * animations only if needed
    */
  .skeleton-loader.circle {
    width: 40px;
    height: 40px;
    margin: 5px;
    border-radius: 50%;
  }
  .skeleton-loader.square {
    width: 40px;
    height: 40px;
    margin: 5px;
  }

  /**
    * Added only when `animation` attribute is `progress`
    * at component level. So that we can load the
    * animations only if needed
    */
  .skeleton-loader.progress,
  .skeleton-loader.progress-dark {
    transform: translate3d(0, 0, 0);
  }
  .skeleton-loader.progress:after,
  .skeleton-loader.progress:before,
  .skeleton-loader.progress-dark:after,
  .skeleton-loader.progress-dark:before {
    box-sizing: border-box;
  }
  .skeleton-loader.progress:before,
  .skeleton-loader.progress-dark:before {
    animation: progress var(--animation-duration) ease-in-out infinite;
    background-size: 200px 100%;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    content: '';
  }
  .skeleton-loader.progress:before {
    background-image: var(--background-image-light-mode);
  }
  .skeleton-loader.progress-dark:before {
    background-image: var(--background-image-dark-mode);
  }

  /**
    * Added only when `animation` attribute is `pulse`
    * at component level. So that we can load the
    * animations only if needed
    */
  .skeleton-loader.pulse {
    animation: pulse var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1) infinite;
    animation-delay: 0.5s;
  }
  .skeleton-loader.pulse-dark {
    background: var(--dark-mode-color);
    animation: pulse var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1) infinite;
    animation-delay: 0.5s;
  }
  .skeleton-loader.custom-content {
    height: 100%;
    background: none;
  }

  /* Removing animations if Reduce motion is enabled via user's operating system */
  @media (prefers-reduced-motion: reduce) {
    .skeleton-loader.pulse,
    .skeleton-loader.pulse-dark,
    .skeleton-loader.progress-dark::before,
    .skeleton-loader.custom-content,
    .skeleton-loader.custom-content::before,
    .skeleton-loader.custom-content::after,
    .skeleton-loader.progress::before {
      animation: none;
    }
    .skeleton-loader.progress::before,
    .skeleton-loader.custom-content::before,
    .skeleton-loader.custom-content::after,
    .skeleton-loader.progress-dark::before,
    .skeleton-loader.pulse-dark,
    .skeleton-loader.custom-content {
      background-image: none;
    }
  }

  /* Adding cursor styles ONLY for desktop users */
  @media screen and (min-device-width: 1200px) {
    .skeleton-loader {
      user-select: none;
      cursor: wait;
    }
  }

  /* Skeleton animations  */
  @keyframes progress {
    0% {
      transform: translate3d(-200px, 0, 0);
    }
    100% {
      transform: translate3d(calc(200px + 100vw), 0, 0);
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
