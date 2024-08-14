<script setup lang="ts">
const props = defineProps<{
  src?: string
  width?: string
}>()

const embedSrc = computed(() => {
  if (props.src) {
    return `https://www.youtube-nocookie.com/embed/${props.src}?rel=0`
  } else {
    return null
  }
})

const container = computed(() => {
  return {
    width: props.width || 'inherit',
    margin: '0 auto',
  }
})
</script>

<template>
  <div class="videoWrapper overflow-hidden" :style="container">
    <iframe
      v-if="embedSrc"
      :src="embedSrc"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
      allowfullscreen
      controls
    ></iframe>
    <div v-if="src" class="inner">
      <slot></slot>
    </div>
    <div v-else>{{ $t('noData') }}</div>
  </div>
</template>

<style scoped>
.videoWrapper {
  width: 100%;
  height: auto;
  aspect-ratio: calc(16 / 9);
  position: relative;
}
.videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  aspect-ratio: calc(16 / 9);
}

.inner {
  position: absolute;
  width: 100%;
  height: auto;
  top: 0;
  left: 0;
}
</style>
