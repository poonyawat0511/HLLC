<script setup lang="ts">
import type { VForm, VTextField } from 'vuetify/components'

// Refs
const dialog = defineModel('dialog', { type: Boolean, default: false })
const data = defineModel<SettingEntity>({
  type: Object,
  default: () => ({
    key: '',
    value: '',
    description: '',
    type: 'text',
  }),
})
const types: SettingType[] = ['text', 'number', 'boolean', 'date', 'array']

type CacheStorage = { [K in SettingType]?: Setting[K] }
const cache = reactive<CacheStorage>({
  text: undefined,
  number: undefined,
  boolean: undefined,
  date: undefined,
  array: undefined,
})

// Model props
export type Mode = 'new' | 'update'
interface Props {
  mode?: Mode
  initialData: SettingEntity
  loading?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  mode: 'new',
  loading: false,
})

// Data initialization
const temp = ref<SettingEntity>()
watch(
  () => props.initialData,
  (value) => {
    if (dialog.value) return
    temp.value = Object.assign({}, value)
  },
  {
    immediate: true,
    deep: true,
  }
)

// Form and validation
const form = ref<VForm | null>()

// Input props
const inputProps = computed<VTextField['$props']>(() => ({
  variant: 'outlined',
  disabled: props.loading,
  persistentPlaceholder: true,
}))

function saveCache<T extends SettingType>(type: T, value: CacheStorage[T]) {
  cache[type] = value
}

function onChangeType(type: SettingType) {
  // Save cache
  saveCache(data.value.type, data.value.value)
  data.value.value = cache[type]
  data.value.type = type
}

const emit = defineEmits<{
  save: [mode: Mode, data: SettingEntity]
  cancel: []
}>()
function onSave() {
  emit('save', props.mode, data.value)
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="50rem">
    <v-card rounded="lg" :loading="loading">
      <v-toolbar color="transparent">
        <v-toolbar-title>
          {{ mode === 'new' ? 'New Setting' : 'Update Setting' }}
        </v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <v-card-text>
        <v-from ref="form">
          <v-text-field
            v-model="data.key"
            v-bind="inputProps"
            label="Key"
            placeholder="Setting key"
          />
          <v-text-field
            v-model="data.description"
            v-bind="inputProps"
            label="Description"
            placeholder="Setting description"
          />
          <v-text-field
            v-model="data.group"
            v-bind="inputProps"
            label="Group"
            placeholder="Setting group"
          />
          <v-select
            v-bind="inputProps"
            :model-value="data.type"
            :items="types"
            label="Type"
            placeholder="Select Type"
            @update:model-value="onChangeType"
          />
          <setting-dynamic-input
            v-model="data.value"
            :type="data.type"
            v-bind="inputProps"
          />
        </v-from>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="plain" :disabled="loading" @click="cancel">
          Cancel
        </v-btn>
        <v-btn variant="text" :loading="loading" @click="onSave"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
