<script setup lang="ts">

const props = defineProps({
  openDialog: Boolean,
  title: {
    type: String,
    default: 'Dialog Title',
  },
})
const emit = defineEmits(['update:openDialog', 'close'])

// Local state to control the dialog
const dialog = ref(props.openDialog)

// Watch for changes in the prop and update local state
watch(
  () => props.openDialog,
  (newVal) => {
    dialog.value = newVal
  }
)

// Method to handle closing the dialog
const onClose = () => {
  emit('close')
  emit('update:openDialog', false)
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="30rem"
    persistent
    content-class="elevation-0"
  >
    <v-card class="rounded-xl">
      <v-card-title class="d-flex justify-center">{{ title }}</v-card-title>
      <v-divider />
      <v-card-actions class="d-flex justify-center">
        <slot name="actions">
          <v-btn rounded @click="onClose"> Close </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
