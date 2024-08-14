<script setup lang="ts">
const { colors } = useSchool()
const emits = defineEmits(['confirm'])

const props = defineProps<{
  startDate?: Date | null
  endDate?: Date | null
  isOpen?: boolean
  isClosed?: boolean
}>()
const locale = computed(() => {
  return current.value as 'th' | 'en'
})
const { current } = useLocale()
const adapter = useDate()
const openDate = computed(() => {
  return adapter.toJsDate(props.startDate)?.toLocaleDateString(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
})
</script>
<template>
  <div>
    <v-card
      rounded="xl"
      elevation="0"
      :color="colors['card-surface']"
      class="text-center"
    >
      <v-card-title class="ml-3">
        <v-img class="mx-auto" width="15rem" contain src="/icons/edit-lamduan.png"></v-img>
      </v-card-title>
      <v-card-text class="mb-2">
        <h3 class="text-title mb-3">{{ $t('sendLamduan') }}</h3>
        <v-btn
          v-if="!isClosed"
          rounded
          color="primary"
          class="text-white"
          elevation="0"
          :disabled="!isOpen"
          @click="$emit('confirm')"
        >
          <span>
            {{ !isOpen ? $t('Open') + ' : ' + openDate : $t('Submit') }}
          </span>
        </v-btn>
        <v-btn
          v-else
          rounded
          color="primary"
          class="text-white"
          elevation="0"
          :disabled="!isOpen"
          @click="$emit('confirm')"
        >
          <span>
            {{ $t('isClose') }}
          </span>
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
