<script setup lang="ts">
const dialog = defineModel<boolean>({ default: false })
const props = defineProps<{
  questionsData: IQuestions[]
  EditDialog: boolean
  checkData: IQuestions | null
}>()
const formData = ref<IQuestions>({
  id: '',
  title: {
    th: '',
    en: '',
  },
  text: {
    th: '',
    en: '',
  },
  image: '',
})
const emit = defineEmits(['save'])
const saveQuestion = async () => {
  emit('save', formData.value)
}

// watch(
//   [() => props.EditDialog, () => props.checkData],
//   ([newEditDialog, newCheckData]) => {
//     if (newEditDialog) {
//       if (newCheckData) {
//         formData.value = { ...newCheckData }
//       } else {
//         resetForm()
//       }
//     } else {
//       resetForm()
//     }
//   }
// )
watch(
  [() => props.EditDialog, () => props.checkData],
  ([newEditDialog, newCheckData]) => {
    if (newEditDialog && newCheckData) {
      // Populate form data with the data of the question to be edited
      formData.value = {
        id: newCheckData.id,
        title: {
          th: newCheckData.title.th,
          en: newCheckData.title.en,
        },
        image: newCheckData.image,
      };
      dialog.value = true; // Open the dialog
    } else {
      resetForm() // Clear form if no question provided
    }
  }
)
watch(
  () => dialog.value,
  (newDialog) => {
    if (!newDialog && !props.EditDialog) {
      resetForm()
    }
  }
)
// Function to reset form data
const resetForm = () => {
  formData.value = {
    id: '',
    title: {
      th: '',
      en: '',
    },
    text: {
      th: '',
      en: '',
    },
    image: '',
  }
}

const formIsValid = computed(() => {
  if (!props.EditDialog) {
    // Validate only for Create Dialog
    return (
      !!formData.value.title.th &&
      !!formData.value.title.en &&
      !!formData.value.image
    )
  } else {
    // Always consider form valid for Edit Dialog
    return true
  }
})
</script>

<template>
  <v-container>
    <FormDialog
      v-model="dialog"
      icon="mdi-ticket-percent-outline"
      max-width="40rem"
      :header="props.EditDialog ? 'Edit Question' : 'Add Question'"
      sub-header="Enter Voucher Information"
    >
      <template #content>
        <v-form ref="formRef">
          <v-row>
            <v-col cols="12" md="6">
              <base-image-upload
                v-model="formData.image"
                :aspect-ratio="2 / 2"
                color="gray"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.title.th"
                class="mt-2"
                label="Title (TH)"
                density="compact"
                variant="outlined"
                rounded
              />
              <v-text-field
                v-model="formData.title.en"
                label="Title (EN)"
                density="compact"
                variant="outlined"
                rounded
              />
              <v-text-field
                v-model="formData.text.th"
                label="Text (TH)"
                density="compact"
                variant="outlined"
                rounded
              />
              <v-text-field
                v-model="formData.text.en"
                label="Text (EN)"
                density="compact"
                variant="outlined"
                rounded
              />
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #actions>
        <v-spacer />
        <v-btn text rounded @click="dialog = false">Cancel</v-btn>
        <v-btn
          text
          variant="flat"
          class="px-4"
          color="black"
          rounded
          :disabled="!formIsValid"
          @click="saveQuestion()"
          >{{ props.EditDialog ? 'Save' : 'Create' }}</v-btn
        >
        <v-spacer />
      </template>
    </FormDialog>
  </v-container>
</template>
