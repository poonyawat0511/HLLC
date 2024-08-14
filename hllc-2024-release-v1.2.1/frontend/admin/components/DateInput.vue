<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="20rem">
      <v-date-picker v-model="selectedDate">
        <template #actions>
          <v-btn variant="text" color="error" @click="clear"> clear </v-btn>
          <v-spacer />
          <v-btn variant="text" color="warning" @click="cancel"> Cancel </v-btn>
          <v-btn
            variant="text"
            color="success"
            :disabled="!selectedDate"
            @click="confirm"
          >
            OK
          </v-btn>
        </template>
      </v-date-picker>
    </v-dialog>
    <v-text-field
      ref="textField"
      readonly
      :model-value="localValue"
      v-bind="inputProps"
      v-on="$props.readonly ? {} : { 'click:control': openDialog, ...$attrs }"
    >
      <template v-for="(slot, name) in $slots" :key="name" #[name]="slotProps">
        <component :is="slot" v-bind="slotProps" />
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import type { VTextField } from 'vuetify/components'

const adapter = useDate()

type TextFieldProps = VTextField['$props']
interface Props extends /** @vue-ignore */ TextFieldProps {
  readonly?: boolean | null
  min?: string | Date
  max?: string | Date
  autoClear?: boolean
  format?: string
}

const model = defineModel<string | Date | undefined | null>({
  type: [String, Date],
  default: null,
})

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  min: '',
  max: '',
  autoClear: true,
  format: 'fullDate',
})

const dialog = ref(false)
const selectedDate = ref<Date | null>()
const localValue = ref<string>()
const errors = ref<readonly string[] | string | null>([])
const textField = ref<VTextField | null>()

const attrs = useAttrs()

const inputProps = computed(() => {
  const { type, ...allowed } = attrs
  return allowed
})

const minDate = computed(() => {
  const date = getDateFormat(props.min)
  return date
})

const maxDate = computed(() => {
  const date = getDateFormat(props.max)
  return date
})

function confirm() {
  localValue.value = adapter.format(selectedDate.value, props.format)
  model.value = selectedDate.value
  dialog.value = false
  nextTick(() => {
    textField.value!.blur()
    errors.value = textField.value!.errorMessages
  })
}

function clear() {
  localValue.value = ''
  model.value = ''
  selectedDate.value = null
  dialog.value = false
  nextTick(() => {
    textField.value!.blur()
    errors.value = textField.value!.errorMessages
  })
}

function cancel() {
  setTextFieldValue(model.value)
  dialog.value = false
  nextTick(() => {
    textField.value!.blur()
    errors.value = textField.value!.errorMessages
  })
}

function setTextFieldValue(value: Date | string | null | undefined) {
  if (!value) {
    localValue.value = ''
  } else {
    localValue.value = adapter.format(value, props.format)
  }
  selectedDate.value = adapter.date(value) as Date
}

function getDateFormat(data: Date | string) {
  if (data instanceof Date) return data
  if (typeof data === 'string' && !!data) {
    return adapter.date(data) as Date
  }
  return null
}

function openDialog() {
  if (!errors.value?.length) {
    textField.value!.resetValidation()
  }
  dialog.value = true
}

function compareMinMax() {
  if (!selectedDate.value || !props.autoClear) return
  if (
    (minDate.value && adapter.isBefore(selectedDate.value, minDate.value)) ||
    (maxDate.value && adapter.isAfter(selectedDate.value, minDate.value))
  ) {
    clear()
  }
}

watch(
  () => model.value,
  (value) => setTextFieldValue(value),
  { immediate: true, deep: true }
)
watch(() => props.min, compareMinMax, { immediate: true })
watch(() => props.max, compareMinMax, { immediate: true })
</script>
