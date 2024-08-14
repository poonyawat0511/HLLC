<script setup lang="ts">
interface Props {
  item: IAnswer
}

defineProps<Props>()

const { colors } = useSchool()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
</script>
<template>
  <div>
    <v-card :color="colors['card-surface']" rounded="xl" elevation="0">
      <v-card-title class="text-title"> {{ $t('yourQuestion') }} </v-card-title>
      <v-card-text>
        <span class="text-primary">"{{ item.value }}"</span>
      </v-card-text>
      <v-card-actions class="mt-n4 mb-1">
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </div>
</template>
