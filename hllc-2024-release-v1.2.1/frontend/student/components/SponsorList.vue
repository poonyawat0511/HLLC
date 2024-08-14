<script setup lang="ts">
// Define props
const props = defineProps<{
  size?: number | string
  items: Sponsor[]
}>()

const sortedItems = computed(() => {
  return props.items.filter(item => item.show).slice().sort((a, b) => a.no - b.no)
})
</script>

<template>
  <v-container fluid class="text-center">
    <div v-if="props.items.length" class="image-container">
      <v-avatar
        v-for="(item, index) in sortedItems"
        :key="index"
        :size="size ?? 30"
        tile
        style="margin: 0 1px"
      >
        <v-img :src="item.logo" class="logo-image" />
      </v-avatar>
    </div>
    <span v-else class="no-data text-white">{{ $t('noSponsor') }}</span>
  </v-container>
</template>

<style scoped>
.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>
