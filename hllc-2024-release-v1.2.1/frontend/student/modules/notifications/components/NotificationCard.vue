<script setup lang="ts">
const { colors } = useSchool()

defineProps<{
  item: NotificationEntity
}>()
defineEmits<{
  click: []
}>()

type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
</script>

<template>
  <v-card
    v-if="item"
    :color="colors['card-surface']"
    rounded="xl"
    flat
    @click="$emit('click')"
  >
    <template #prepend>
      <v-icon :icon="item.icon" />
    </template>
    <template #title>{{ item.title[lang] }}</template>
    <template #append>
      <span style="font-size: 12px"> {{ item.timestamp[lang] }} </span>
    </template>
    <v-card-text class="mb-n1">
      <div class="d-flex flex-no-wrap justify-space-between">
        <div style="width: 100%">
          <div class="box-subtitle">{{ item.subtitle[lang] }}</div>
        </div>
        <v-avatar tile class="rounded-lg" size="50">
          <v-img :src="item.image" />
        </v-avatar>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.box-subtitle {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
