<script setup lang="ts">
import type { VCard } from 'vuetify/components'

type CardProps = VCard['$props']

interface Props extends /* @vue-ignore */ CardProps {
  title: string
  icon: string
}

defineProps<Props>()
</script>

<template>
  <v-card v-bind="$attrs">
    <v-card-title class="text-center">
      <v-avatar size="120" class="mx-auto">
        <v-icon :icon="icon" size="60" />
      </v-avatar>
    </v-card-title>
    <v-card-text class="text-truncated text-center">
      {{ title }}
    </v-card-text>
  </v-card>
</template>

<style scoped>
.menu-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: normal;
  line-clamp: 2;
}
</style>
