<script setup lang="ts">
const snackbar = defineModel<boolean>({ default: false })
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  type: { type: String, default: '' },
})
</script>
<template>
  <v-snackbar
    v-if="props.type === 'success'"
    v-model="snackbar"
    :timeout="2000"
    color="success"
    rounded="pill"
  >
    <p class="d-flex justify-center font-weight-bold">
      {{ props.title }}
    </p>
  </v-snackbar>
  <v-snackbar
    v-else-if="props.type === 'warning'"
    v-model="snackbar"
    :timeout="2000"
    color="warning"
    rounded="pill"
  >
    <p class="d-flex justify-center font-weight-bold">
      {{ props.title }}
    </p>
  </v-snackbar>
  <v-snackbar
    v-else
    v-model="snackbar"
    :timeout="2000"
    color="error"
    rounded="pill"
  >
    <p class="d-flex justify-center font-weight-bold">
      {{ props.title }}
    </p>
  </v-snackbar>
</template>
<style scoped></style>
