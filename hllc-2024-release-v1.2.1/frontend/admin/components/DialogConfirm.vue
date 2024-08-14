<script setup lang="ts">
const dialog = defineModel<boolean>({ default: false })
const props = defineProps({
  image: { type: String, default: '' },
  title: { type: String, default: '' },
  colorConfirm: { type: String, default: 'black' },
  colorCancel: { type: String, default: 'error' },
})
const emit = defineEmits(['submit'])
function closeDialog() {
  dialog.value = false
}

function submitDialog() {
  dialog.value = false
  emit('submit')
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card class="rounded-xl pa-4 text-center">
      <div class="d-flex justify-center mt-4">
        <v-img :src="props.image" max-width="9rem" />
      </div>
      <v-card-text>
        <h2 class="mt-4">{{ props.title }}</h2>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn
          class="px-4"
          :color="props.colorCancel"
          variant="text"
          rounded="lg"
          @click="closeDialog()"
        >
          Cancel
        </v-btn>
        <v-btn
          class="px-4"
          :color="props.colorConfirm"
          variant="flat"
          rounded="lg"
          @click="submitDialog()"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
