/// <reference types="vite/client" />
import 'vue-skeleton-content-loader';

// Registering `shine` custom animation, so it can be used via `animation` prop
declare module 'vue-skeleton-content-loader' {
  interface VueSkeletonContentLoaderCustomAnimations {
    shine: true;
  }
}
