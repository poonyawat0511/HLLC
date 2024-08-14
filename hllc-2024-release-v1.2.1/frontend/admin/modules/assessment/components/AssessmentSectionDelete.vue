<script setup lang="ts">
const dialog = defineModel<boolean>({ default: false })
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['submit'])
function confirmdelete() {
  emit('submit', props.id)
}
</script>
<template>
  <dialog-confirm
    v-model="dialog"
    title="Are you sure you want to delete this section?"
    image="/icons/delete.png"
    @submit="confirmdelete"
  />
</template>
