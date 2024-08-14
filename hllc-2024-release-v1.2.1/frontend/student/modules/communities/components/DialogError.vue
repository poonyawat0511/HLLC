<script setup lang="ts">
const { locale } = useI18n()
const emit = defineEmits(['close'])
const dialog = defineModel<boolean>({ default: false })

const props = defineProps<{
  title: {
    th: string
    en: string
  }
}>()

const onClose = () => {
  emit('close')
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>{{ props.title[locale as 'th' | 'en'] }}</v-card-title>
      <v-card-actions>
        <v-btn class="text-error" @click="onClose">{{$t('isClose')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
