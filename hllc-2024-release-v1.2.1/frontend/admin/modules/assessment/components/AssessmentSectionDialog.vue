<template>
  <FormDialog
    v-model="dialog"
    icon="mdi-vector-intersection"
    header="Add Section"
  >
    <template #content>
      <v-form ref="formRef" class="py-2">
        <v-text-field
          v-bind="binding"
          v-model="form.title.en"
          label="Form Name (English)"
        />
        <v-text-field
          v-bind="binding"
          v-model="form.title.th"
          label="Form Name (Thai)"
        />
        <v-text-field
          v-bind="binding"
          v-model.number="form.order"
          label="Form Order"
          type="number"
        />
        <v-text-field
          v-bind="binding"
          v-model="form.subtitle.en"
          label="Section Name (English)"
        />
        <v-text-field
          v-bind="binding"
          v-model="form.subtitle.th"
          label="Section Name (Thai)"
        />
      </v-form>
    </template>
    <template #actions>
      <v-btn @click="cancle()"> Cancle </v-btn>
      <v-btn @click="save()"> Confirm </v-btn>
    </template>
  </FormDialog>
</template>
<script setup lang="ts">
import type { VForm } from 'vuetify/components'
import type { AssessmentSection } from '~/pages/assessments/systems/index.vue'
const dialog = defineModel<boolean>({ default: false })
const props = defineProps<{
  data: AssessmentSection | null | undefined
}>()

const binding = {
  rounded: true,
  density: 'compact',
  variant: 'outlined',
}
const initialForm = ref<AssessmentSection>({
  title: {
    th: '',
    en: '',
  },
  subtitle: { th: '', en: '' },
  order: 0,
  id: '',
})

const form = ref<AssessmentSection>({
  ...initialForm.value,
})

const formRef = ref<VForm | null>(null)
const emit = defineEmits(['save'])
const save = () => {
  emit('save', form.value)
}
const cancle = () => {
  dialog.value = false
  formRef.value?.reset()
}
watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
    } else {
      form.value = { ...initialForm.value }
    }
  },
  { immediate: true }
)

watch(
  () => dialog,
  (newVal) => {
    if (!newVal) {
      form.value = { ...initialForm.value }
    }
  }
)
</script>
