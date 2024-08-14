<script setup lang="ts">
const snackbar = defineModel({ type: Boolean, default: false })
interface Props {
  message: string
  timeout?: number
  color?: string
}

withDefaults(defineProps<Props>(), {
  timeout: 3000,
  color: '',
})
</script>

<template>
  <v-snackbar v-model="snackbar" :timeout="timeout" :color="color">
    {{ message }}
    <template #actions>
      <v-btn color="dark" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
