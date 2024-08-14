<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

interface Props {
  title?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Are you sure to perform the action?',
  loading: false,
})

defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="20rem">
    <v-card rounded="lg" :loading="loading">
      <v-card-text>
        {{ title }}
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="plain" :disabled="loading" @click="$emit('cancel')">
          Cancel
        </v-btn>
        <v-btn variant="text" :loading="loading" @click="$emit('confirm')">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
