<template>
  <div class="image-loader-container">
    <img
      class="placeholder"
      src="../assets/images/loading.svg"
      alt=""
      v-show="!hasLoaded"
    >
    <img
      class="origin"
      :src="src"
      :alt="desc"
      @load="handleLoad"
      :class="{ hidden: !hasLoaded }"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

type ImageLoaderProps = {
  src: string
  desc?: string
  duration?: number
}

const props = withDefaults(defineProps<ImageLoaderProps>(), {
  duration: 500
})

const hasLoaded = ref(false)

const handleLoad = () => {
  hasLoaded.value = true
}

watchEffect(() => {
  if (props.src) {
    hasLoaded.value = false
  }
})
</script>

<style scoped>
  .image-loader-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    min-height: 260px;
  }

.origin {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
}

.hidden {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  inset: 0;
}
</style>
