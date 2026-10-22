<script setup lang="ts">
  // Type checked against the packed package (`scripts/check-min-peer-dependency.sh`), checking
  // its type declarations (without `skipLibCheck`) and declaration merging, as consumers do
  import {
    VueSkeletonContentLoader,
    type VueSkeletonContentLoaderConfig,
  } from 'vue-skeleton-content-loader';

  const animation: VueSkeletonContentLoaderConfig['animation'] = 'my-wave';
</script>

<template>
  <VueSkeletonContentLoader :animation="animation" color-scheme="auto" count="3" class="x" />
  <VueSkeletonContentLoader
    animation="wave"
    :theme="{ '--vue-skeleton-content-loader-base-color': 'red', height: undefined }"
  />
  <VueSkeletonContentLoader appearance="custom-content"><p>content</p></VueSkeletonContentLoader>
  <!-- @vue-expect-error not registered animation -->
  <VueSkeletonContentLoader animation="not-registered" />
  <!-- @vue-expect-error invalid color scheme -->
  <VueSkeletonContentLoader color-scheme="blue" />
</template>
