<script setup lang="ts">
const visible = defineModel<boolean>({ default: false })
const props = defineProps({
  item: {
    type: Object as () => Question | null,
    default: null,
  },
})

interface Question {
  questionnaire: {
    th: string
    en: string
  }
  type: string
  id?: string
}

const emit = defineEmits(['submit'])

const formModel = ref<Question>({
  questionnaire: {
    th: '',
    en: '',
  },
  type: '',
})

const isEdit = ref(false)

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      formModel.value = { ...newItem }
      isEdit.value = true
    } else {
      formModel.value = { questionnaire: { th: '', en: '' }, type: '' }
      isEdit.value = false
    }
  },
  { immediate: true }
)

const rules = {
  required: (value: string) => !!value || 'Required.',
}

const submit = () => {
  emit('submit', { ...formModel.value, isEdit: isEdit.value })
  close()
}

const close = () => {
  visible.value = false
  formModel.value = { questionnaire: { th: '', en: '' }, type: '' }
  isEdit.value = false
}
</script>

<template>
  <v-dialog v-model="visible" max-width="600px">
    <v-card>
      <v-card-title>
        {{ isEdit ? 'Edit Question' : 'Add Question' }}
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="formModel.questionnaire.th"
          label="Questionnaire Thai"
          :rules="[rules.required]"
          required
          variant="outlined"
          density="comfortable"
          rounded-lg
        />
        <v-text-field
          v-model="formModel.questionnaire.en"
          label="Questionnaire English"
          :rules="[rules.required]"
          required
          variant="outlined"
          density="comfortable"
          rounded-lg
        />
        <v-select
          v-model="formModel.type"
          label="Type"
          :items="['Text']"
          :rules="[rules.required]"
          variant="outlined"
          density="comfortable"
          rounded-lg
          required
        />
      </v-card-text>
      <v-card-actions>
        <v-btn class="text-error" @click="close">Cancel</v-btn>
        <v-btn color="black" @click="submit">
          {{ isEdit ? 'Save' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
