<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { locale, setLocale } = useI18n()

function toggleLang() {
  const newLocale = locale.value === 'en' ? 'th' : 'en'
  setLocale(newLocale)
}

const flag = computed(() => {
  if (locale.value === 'en') return `/icons/flag.en.png`
  return `/icons/flag.th.png`
})
</script>

<template>
  <div>
    <v-avatar
      color="transparent"
      size="40"
      class="mr-3 align-center"
      style="cursor: pointer"
      tile
    >
      <v-img :src="flag" :alt="`${locale} flag`" @click="toggleLang" />
    </v-avatar>
  </div>
</template>
