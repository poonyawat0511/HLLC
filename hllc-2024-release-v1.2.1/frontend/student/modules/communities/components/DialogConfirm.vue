<script setup lang="ts">
const dialog = defineModel<boolean>({ default: false })
const emit = defineEmits(['cancel'])
const props = defineProps({
  req: {
    required: true,
    type: Object,
    default: null,
  },
})

const cancel = () => {
  emit('cancel', props.req, 'reject')
  dialog.value = false
}
const { colors } = useSchool()
</script>
<template>
  <v-dialog
    v-model="dialog"
    max-width="25rem"
    persistent
    content-class="elevation-0"
  >
    <v-card
      :style="{
        backgroundColor: colors['dialog-surface'],
        '-webkit-backdrop-filter': 'blur(15px)',
        'backdrop-filter': 'blur(15px)',
      }"
      class="pr-4 pl-4"
      rounded="xl"
      elevation="0"
    >
      <v-card-title class="d-flex">
        <v-avatar size="36px" color="error">
          <v-icon icon="mdi-delete"/>
        </v-avatar>
        <span class="mt-1 ml-2">{{ $t('Confirm Delete Request') }}</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer/>
        <v-btn rounded @click="dialog = false">
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn rounded color="error" @click="cancel">
          {{ $t('Confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
