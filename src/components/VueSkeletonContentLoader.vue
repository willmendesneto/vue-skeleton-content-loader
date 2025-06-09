<script setup lang="ts">
  import { computed } from 'vue';
  import { VueSkeletonContentLoaderConfig } from '@/components/VueSkeletonContentLoader.types';

  interface Props extends Partial<VueSkeletonContentLoaderConfig> {}

  const props = withDefaults(defineProps<Props>(), {
    loadingText: 'Loading...',
    ariaLabel: 'loading',
    appearance: 'line',
    count: 1,
    animation: 'progress',
    theme: null,
  });

  const items = computed(() => Array.from({ length: Number(props.count) }, (_, i) => i + 1));

  // Styles can be passed as a prop to customize the skeleton loader
  const styles = computed(() => props.theme);
</script>

<template>
  <div
    v-for="item in items"
    :key="item"
    class="skeleton-loader"
    :aria-label="props.ariaLabel"
    aria-busy="true"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuetext="props.loadingText"
    role="progressbar"
    tabindex="-1"
    :class="[
      {
        'custom-content': props.appearance === 'custom-content',
        circle: props.appearance === 'circle',
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
    box-sizing: border-box;
    /**
      * `overflow` and `position` are required steps to make sure
      * the component respects the specified dimensions
      * given via `theme` object @Input attribute
      */
    overflow: hidden;
    position: relative;
    background: rgb(239, 241, 246) no-repeat;
    border-radius: 4px;
    width: 100%;
    height: 20px;
    display: inline-block;
    margin-bottom: 10px;
    will-change: transform;
    /**
  * Added only when `appearance` attribute is `circle`
  * at component level. So that we can use it only if needed
  */
    /**
  * Added only when `animation` attribute is `progress`
  * at component level. So that we can load the
  * animations only if needed
  */
    /**
  * Added only when `animation` attribute is `pulse`
  * at component level. So that we can load the
  * animations only if needed
  */
  }
  .skeleton-loader:after,
  .skeleton-loader:before {
    box-sizing: border-box;
  }
  .skeleton-loader.circle {
    width: 40px;
    height: 40px;
    margin: 5px;
    border-radius: 50%;
  }
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
    animation: progress 2s ease-in-out infinite;
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
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0)
    );
  }
  .skeleton-loader.progress-dark:before {
    background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent);
  }
  .skeleton-loader.pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    animation-delay: 0.5s;
  }
  .skeleton-loader.pulse-dark {
    background: rgba(50, 50, 50, 0.2);
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    animation-delay: 0.5s;
  }
  .skeleton-loader.custom-content {
    height: 100%;
    background: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton-loader.pulse,
    .skeleton-loader.pulse-dark,
    .skeleton-loader.progress-dark,
    .skeleton-loader.custom-content,
    .skeleton-loader.progress::before {
      animation: none;
    }
    .skeleton-loader.progress::before,
    .skeleton-loader.progress-dark,
    .skeleton-loader.pulse-dark,
    .skeleton-loader.custom-content {
      background-image: none;
    }
  }
  @media screen and (min-device-width: 1200px) {
    .skeleton-loader {
      user-select: none;
      cursor: wait;
    }
  }

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
