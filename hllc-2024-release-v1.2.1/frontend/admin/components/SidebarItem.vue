<script setup lang="ts">
interface Props {
  to: string
  icon: string
  title: string
}

const props = defineProps<Props>()
</script>

<template>
  <v-list-item nuxt link :to="props.to" density="compact">
    <template #prepend>
      <v-avatar size="small" tile rounded="lg" color="grey">
        <v-icon size="small" color="white">{{ props.icon }}</v-icon>
      </v-avatar>
    </template>
    <v-list-item-title>
      {{ props.title }}
    </v-list-item-title>
  </v-list-item>
</template>
