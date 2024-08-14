<template>
    <v-dialog v-model="Deletedialog" max-width="400" persistent>
      <v-card class="rounded-xl elevation-0">
        <v-card-text class="mb-n5 text-center">
          <v-img src="../delete-icon.png" class="mx-auto mb-2" max-width="7rem" />
          <span class="text-h6 font-weight-normal"
            >Are you sure you want to delete this voucher?</span
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="black"  rounded @click="Deletedialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" class="px-3" rounded @click="deleteItem">Delete</v-btn>
          <v-spacer/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    voucherItem: Object,
  })
  
  const Deletedialog =  defineModel<boolean>({ default: false })
  
  const emit = defineEmits(['delete'])
  
  const deleteItem = () => {
    if (props.voucherItem) {
      emit('delete', props.voucherItem.id)
    }
  }
  
  </script>
  