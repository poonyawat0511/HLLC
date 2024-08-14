<template>
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card class="rounded-xl text-center elevation-0">
      <v-card-text class="mb-n5">
        <v-img src="../delete-icon.png" class="mx-auto mb-2" max-width="7rem" />
        <span class="text-h6 font-weight-normal"
          >Are you sure you want to delete this sponsor?</span
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn rounded @click="closeDialog">Cancel</v-btn>
        <v-btn color="error" variant="flat" class="px-3" rounded @click="confirmDelete"
          >Delete</v-btn
        >
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
  <SnackbarNotify
    v-model="snackbar"
    :title="snackbarNotify.title"
    :type="snackbarNotify.type"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  dialog: Boolean,
  sponsorId: String,
})

const emit = defineEmits(['update:dialog', 'delete'])
const snackbar = ref(false)
const deleteDialog = ref(props.dialog)
watch(
  () => props.dialog,
  (newVal) => {
    deleteDialog.value = newVal
  }
)

interface CreateSnackbarNotify {
  title: string
  type: string
}
const snackbarNotify = reactive<CreateSnackbarNotify>({
  title: '',
  type: '',
})
const onSnackbar = (title: string, type: string) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  snackbar.value = true
}
const closeDialog = () => {
  deleteDialog.value = false
  emit('update:dialog', false)
}

const { $api } = useNuxtApp()

const confirmDelete = async () => {
  try {
    await $api.delete(`/sponsors/${props.sponsorId}`)
    closeDialog()
    emit('delete') // Emit an event to handle deletion in the parent component
    onSnackbar('Delete question successfully', 'success')
  } catch (error) {
    console.error('Error deleting sponsor:', error)
  }
}
</script>
