<template>
  <v-dialog v-model="model" :max-width="maxWidth" scrollable>
    <v-card rounded="lg" class="pa-2">
      <template #prepend>
        <div class="border rounded-lg ml-2" style="width: 50px; height: 50px">
          <v-icon class="pa-6 text-grey-darker-1">{{ props.icon }}</v-icon>
        </div>
      </template>
      <template #title>
        {{ props.header }}
      </template>
      <template #subtitle> {{ props.subHeader }} </template>
      <template #append>
        <v-icon class="pa-6 text-red" @click="closeDialog">mdi-close</v-icon>
      </template>
      <v-card-text>
        <v-form>
          <slot name="content" />
        </v-form>
      </v-card-text>
      <v-divider/>
      <v-card-actions class="mt-2">
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type { VForm } from 'vuetify/components'
const props = withDefaults(
  defineProps<{
    icon: string
    maxWidth?: string | number
    header?: string
    subHeader?: string
  }>(),
  {
    maxWidth: 800,
    header: '',
    subHeader: '',
  }
)

const model = defineModel<boolean>({ default: false })

function closeDialog() {
  model.value = false
}
</script>
