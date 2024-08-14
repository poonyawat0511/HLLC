<script setup lang="ts">
const snackbar = defineModel<boolean>({ default: false })
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  icon: { type: String, default: '' },
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
    <v-icon class="mr-2">{{ props.icon }}</v-icon>
    <span class="font-weight-bold">
      {{ props.title }}
    </span>
  </v-snackbar>
  <v-snackbar
    v-else-if="props.type === 'warning'"
    v-model="snackbar"
    :timeout="2000"
    color="warning"
    rounded="pill"
  >
    <v-icon class="mr-2">{{ props.icon }}</v-icon>
    <span class="font-weight-bold">
      {{ props.title }}
    </span>
  </v-snackbar>
  <v-snackbar
    v-else
    v-model="snackbar"
    :timeout="2000"
    color="error"
    rounded="pill"
  >
    <v-icon class="mr-2">{{ props.icon }}</v-icon>
    <span class="font-weight-bold">
      {{ props.title }}
    </span>
  </v-snackbar>
</template>
<style scoped></style>
