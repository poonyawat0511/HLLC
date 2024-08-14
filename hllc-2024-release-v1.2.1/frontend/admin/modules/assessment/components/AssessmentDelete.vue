<script setup lang="ts">
const dialog = defineModel<boolean>({ default: false })
const emit = defineEmits(['confirm'])
const props = defineProps<{
  item: Assessment | null
}>()

const onConfirm = () => {
  if (props.item) {
    emit('confirm', 'delete', props.item)
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="450" persistent>
    <v-card>
      <v-card-title class="text-center"> Delete Assessment</v-card-title>
      <v-card-text class="text-center">
        <span class="text-h7 font-weight-normal"
          >Are you sure you want to delete?</span
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn
          variant="flat"
          class="px-3"
          color="error"
          rounded
          @click="onConfirm"
          >Confirm</v-btn
        >
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
