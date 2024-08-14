<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

const { message } = defineProps({
  message: {
    type: String,
    default: 'Unknown error occurred',
  },
})
</script>

<template>
  <v-dialog v-model="dialog" max-width="20rem" persistent>
    <v-card max-height="20rem" rounded="xl">
      <v-card-title class="text-center">
        <v-icon color="error" size="60" class="mt-5"> mdi-alert </v-icon>
      </v-card-title>
      <v-card-text class="text-center">
        {{ message }}
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn size="large" rounded block @click="dialog = false"> OK </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
