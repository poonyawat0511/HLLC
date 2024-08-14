<script setup lang="ts">
import type { VForm, VTextField } from 'vuetify/components'

// Refs
const dialog = defineModel({ type: Boolean, default: false })

interface Props {
  title?: string
  loading?: boolean
  action?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Form',
  loading: false,
  action: undefined,
})

// Form and validation
const form = ref<VForm | null>()

// Input props
const inputProps = computed<VTextField['$props']>(() => ({
  disabled: props.loading,
}))

const emit = defineEmits<{
  save: [valid: boolean]
  cancel: []
  'click:action': []
}>()

function onCancel() {
  emit('cancel')
}

function onSave() {
  nextTick(async () => {
    const { valid } = await form.value!.validate()
    emit('save', valid)
  })
}
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="50rem">
    <v-card rounded="lg" :loading="loading">
      <v-toolbar color="transparent">
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
        <template #append>
          <slot name="action">
            <v-btn v-if="action" @click="$emit('click:action')">
              {{ action }}
            </v-btn>
          </slot>
        </template>
      </v-toolbar>
      <v-divider />
      <v-card-text>
        <v-form ref="form">
          <slot :props="inputProps" />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="plain" :disabled="loading" @click="onCancel">
          Cancel
        </v-btn>
        <v-btn variant="text" :loading="loading" @click="onSave"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
