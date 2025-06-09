<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { VueSkeletonContentLoader, VueSkeletonContentLoaderConfig } from '@/index';

  const intervalId = ref<number | null>(null);
  const contentLoaded = ref(false);
  const animation = ref<VueSkeletonContentLoaderConfig['animation']>('pulse');
  const count = ref<VueSkeletonContentLoaderConfig['count']>(2);
  const widthHeightSizeInPixels = ref<number>(50);

  onMounted(() => {
    // This is just to simulate a loading time for the skeleton loader
    // In a real application, you would fetch data from an API or perform some async operation
    window.setTimeout(() => {
      contentLoaded.value = true;
    }, 2000);

    intervalId.value = window.setInterval(() => {
      animation.value = animation.value === 'pulse' ? 'progress-dark' : 'pulse';
      count.value = count.value === 2 ? 5 : 2;
      widthHeightSizeInPixels.value = widthHeightSizeInPixels.value === 50 ? 100 : 50;
    }, 5000);
  });

  onUnmounted(() => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
  });
</script>

<template>
  <h1 :style="{ textAlign: 'center', marginBottom: '20px' }">
    <a href="https://github.com/willmendesneto/VueSkeletonContentLoader">Vue Skeleton Loader</a>
  </h1>

  <h2>Skeleton Loader Simulation</h2>

  <p>
    Here is a simulation of a skeleton for an user card component. This skeleton will be replaced in
    few seconds for an image and its own content.
  </p>
  <br />
  <br />

  <div class="fb-item">
    <div class="first-section-wrapper">
      <div class="gravatar">
        <template v-if="!contentLoaded">
          <VueSkeletonContentLoader
            appearance="circle"
            :theme="{ width: '80px', height: '80px' }"
          />
        </template>
        <template v-if="contentLoaded">
          <div class="content-loaded">
            <img
              src="//user-images.githubusercontent.com/1252570/96255429-9e7e7a00-1002-11eb-9471-1e7fdfc139cd.png"
              alt=""
              class="content-loaded-image"
            />
          </div>
        </template>
      </div>
      <div class="gravatar-title">
        <div>
          <template v-if="!contentLoaded">
            <VueSkeletonContentLoader
              :theme="{
                width: '200px',
                'border-radius': '0',
                height: '15px',
                'margin-bottom': '10px',
              }"
            />
            <template v-if="contentLoaded">
              <p class="gravatar-title-name">Wilson Mendes</p>
            </template>
          </template>
        </div>
        <div>
          <template v-if="!contentLoaded">
            <VueSkeletonContentLoader
              :theme="{ width: '170px', 'border-radius': '0', height: '15px' }"
            />
          </template>
          <template v-if="contentLoaded">
            <p class="gravatar-description">Hi! It's me</p>
          </template>
        </div>
      </div>
    </div>
  </div>

  <br />
  <br />

  <hr />

  <h2>Line skeletons</h2>

  <div class="item">
    <p>Pulse - Dark</p>
    <VueSkeletonContentLoader count="5" animation="pulse-dark" />
  </div>
  <div class="item">
    <VueSkeletonContentLoader count="5" />
  </div>

  <h2>Line skeletons with theming</h2>
  <div class="item">
    <VueSkeletonContentLoader count="5" :theme="{ 'border-radius': '0', height: '50px' }" />
  </div>

  <h2>Line skeletons with theming - Changing Colors and Switching Animations</h2>
  <p>You can use the same colors for the other examples</p>
  <p>
    Also, this example will be switching between `<b>pulse</b>` and `<b>progress-dark</b>`
    animations
  </p>
  <p>
    Current value: <b>{{ animation }}</b>
  </p>

  <div class="item-with-background">
    <VueSkeletonContentLoader
      count="5"
      :animation="animation"
      :theme="{
        'border-radius': '5px',
        height: '50px',
        'background-color': '#323232',
        border: '1px solid #323232',
        'animation-duration': '2s',
      }"
    />
  </div>

  <h2>Circle skeletons</h2>
  <p>
    This circle is overriding CSS attribute `height` from `.forRoot()` module's method as an
    example. So that, it can keep `height` and `width` with the same values.
  </p>
  <div class="item">
    <VueSkeletonContentLoader
      count="5"
      appearance="circle"
      :theme="{
        height: '40px',
      }"
    />
  </div>

  <h2>Circle skeletons with theming</h2>
  <div class="item">
    <VueSkeletonContentLoader
      count="5"
      appearance="circle"
      :theme="{
        width: '70px',
        height: '70px',
        'border-radius': '10px',
      }"
    />
  </div>

  <h2>Circle skeletons with mixing theming and `[style]` via `:theme` input</h2>
  <p>Width and height will be switching between 50px and 100px every 5 seconds</p>
  <p>
    Current value: <b>{{ widthHeightSizeInPixels }}px</b>
  </p>
  <div class="item">
    <VueSkeletonContentLoader
      count="5"
      appearance="circle"
      :theme="{
        'width.px': widthHeightSizeInPixels,
        'height.px': widthHeightSizeInPixels,
        'border-radius': '10px',
      }"
    />
  </div>

  <h2>Facebook skeleton example</h2>

  <div class="fb-item">
    <div class="first-section-wrapper">
      <div class="gravatar">
        <VueSkeletonContentLoader appearance="circle" :theme="{ width: '80px', height: '80px' }" />
      </div>
      <div class="gravatar-title">
        <div>
          <VueSkeletonContentLoader
            :theme="{
              width: '200px',
              'border-radius': '0',
              height: '15px',
              'margin-bottom': '10px',
            }"
          />
        </div>
        <div>
          <VueSkeletonContentLoader
            :theme="{ width: '170px', 'border-radius': '0', height: '15px' }"
          />
        </div>
      </div>
    </div>
    <div class="second-section-wrapper">
      <div class="wrapper">
        <VueSkeletonContentLoader
          :theme="{
            width: '80%',
            'border-radius': '0',
            height: '15px',
            'margin-bottom': '10px',
          }"
        />
      </div>
      <div class="wrapper">
        <VueSkeletonContentLoader
          :theme="{
            width: '90%',
            'border-radius': '0',
            height: '15px',
            'margin-bottom': '10px',
          }"
        />
      </div>
      <div class="wrapper">
        <VueSkeletonContentLoader
          :theme="{
            width: '60%',
            'border-radius': '0',
            height: '15px',
            'margin-bottom': '10px',
          }"
        />
      </div>
    </div>
  </div>

  <h2>Animations</h2>

  <h3>Skeletons without animation</h3>

  <div class="item">
    <VueSkeletonContentLoader
      count="5"
      animation="false"
      appearance="circle"
      :theme="{ height: '40px' }"
    />
  </div>

  <div class="item">
    <VueSkeletonContentLoader
      count="3"
      animation="false"
      :theme="{
        height: '50px',
      }"
    />
  </div>

  <h3>Skeleton using `progress` animation</h3>

  <div class="item">
    <VueSkeletonContentLoader
      count="5"
      animation="progress"
      appearance="circle"
      :theme="{ height: '40px' }"
    />
  </div>

  <div class="item">
    <VueSkeletonContentLoader
      count="3"
      animation="progress"
      :theme="{
        height: '50px',
      }"
    />
  </div>

  <h3>Skeleton using `pulse` animation</h3>

  <div class="item">
    <VueSkeletonContentLoader
      count="5"
      animation="pulse"
      appearance="circle"
      :theme="{ height: '40px' }"
    />
  </div>

  <div class="item">
    <VueSkeletonContentLoader
      count="3"
      animation="pulse"
      :theme="{
        height: '50px',
        'background-color': '#C64949',
      }"
    />
  </div>

  <h3>Skeleton using `progress-dark` animation</h3>

  <div class="item">
    <VueSkeletonContentLoader
      count="5"
      animation="progress-dark"
      appearance="circle"
      :theme="{ height: '40px' }"
    />
  </div>

  <h3>Skeleton using custom-content (SVG for example)</h3>

  <div class="item">
    <div style="width: 50%">
      <VueSkeletonContentLoader appearance="custom-content" :theme="{ height: '250px' }">
        <svg viewBox="0 0 312 103" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="312" height="102" fill="white" />
          <path
            d="M14 49.5338C5.2 43.5338 1 47.3671 0 50.0338V102.034H312V44.5338C312 35.7338 303.667 37.8671 299.5 40.0338C292.167 44.5338 276.3 54.4338 271.5 58.0338C266.7 61.6338 261.833 62.2005 260 62.0338H248C243.2 62.0338 240 60.7005 239 60.0338C237.833 59.2005 233.5 56.0338 225.5 50.0338C217.5 44.0338 210.167 47.2004 207.5 49.5338C204.833 51.8671 197.6 58.0338 190 64.0338C182.4 70.0338 176.833 65.2005 175 62.0338C168.167 48.3671 153.5 19.3338 149.5 12.5338C144.7 6.13377 138.5 9.8671 136 12.5338C130.667 18.3671 118.8 31.3338 114 36.5338C109.2 41.7338 102.667 42.3671 100 42.0338H76C66.5 42.0338 48 56.5338 42 59.0338C37.2 61.0338 32.3333 59.8671 30.5 59.0338C28.6667 58.3671 22.8 55.5338 14 49.5338Z"
            fill="#EFEFEF"
          />
          <path
            d="M14 49.5338C5.2 43.5338 1 47.3671 0 50.0338V102.034H312V44.5338C312 35.7338 303.667 37.8671 299.5 40.0338C292.167 44.5338 276.3 54.4338 271.5 58.0338C266.7 61.6338 261.833 62.2005 260 62.0338H248C243.2 62.0338 240 60.7005 239 60.0338C237.833 59.2005 233.5 56.0338 225.5 50.0338C217.5 44.0338 210.167 47.2004 207.5 49.5338C204.833 51.8671 197.6 58.0338 190 64.0338C182.4 70.0338 176.833 65.2005 175 62.0338C168.167 48.3671 153.5 19.3338 149.5 12.5338C144.7 6.13377 138.5 9.8671 136 12.5338C130.667 18.3671 118.8 31.3338 114 36.5338C109.2 41.7338 102.667 42.3671 100 42.0338H76C66.5 42.0338 48 56.5338 42 59.0338C37.2 61.0338 32.3333 59.8671 30.5 59.0338C28.6667 58.3671 22.8 55.5338 14 49.5338Z"
            fill="black"
            fill-opacity="0.1"
          />
        </svg>
      </VueSkeletonContentLoader>
    </div>
  </div>

  <h3>Skeleton switching values for `animation` and `count` &#64;Input</h3>
  <p>Current values:</p>
  <ul>
    <li>
      Count: <b>{{ count }}</b>
    </li>
    <li>
      Animation: <b>{{ animation }}</b>
    </li>
  </ul>

  <div class="item-with-background">
    <VueSkeletonContentLoader
      :count="count"
      :animation="animation"
      :theme="{
        'border-radius': '5px',
        height: '50px',
        'background-color': '#323232',
        border: '1px solid #323232',
        'animation-duration': '2s',
      }"
    />
  </div>
</template>

<style scoped>
  .item {
    width: auto;
    height: auto;
    margin: 10px auto;
    border: 1px solid #eaeaea;
    padding: 10px;
  }

  .fb-item {
    width: auto;
    height: auto;
    margin: 10px auto;
    border: 1px solid #eaeaea;
    padding: 10px;
  }

  .gravatar {
    width: 100px;
    height: 90px;
  }

  .gravatar-title {
    width: 500px;
    padding: 10px;
    height: 80px;
  }

  .first-section-wrapper,
  .second-section-wrapper {
    width: 100%;
    height: auto;
    flex: 1;
  }

  .first-section-wrapper {
    display: inline-flex;
  }

  .second-section-wrapper {
    margin-top: 30px;
  }

  .wrapper {
    width: 100%;
    flex: 1;
  }

  .item-with-background {
    background: #121212;
    padding: 10px;
  }

  .content-loaded .content-loaded-image {
    display: inline-block;
    width: 80px;
    height: 80px;
    background-color: rgb(174, 174, 174);
    margin: 5px;
    border-radius: 50%;
  }

  .gravatar-title-name {
    margin-top: 0;
    width: 200px;
    border-radius: 0;
    height: 15px;
    margin-bottom: 15px;
    font-size: 18px;
  }

  .gravatar-description {
    width: 170px;
    border-radius: 0;
    height: 15px;
    font-size: 12px;
  }
</style>
