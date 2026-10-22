import 'vue-skeleton-content-loader';

// Custom animations registered via declaration merging
declare module 'vue-skeleton-content-loader' {
  interface VueSkeletonContentLoaderCustomAnimations {
    'my-wave': true;
  }
}
