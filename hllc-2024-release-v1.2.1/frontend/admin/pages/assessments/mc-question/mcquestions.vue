<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/assessments', title: 'Assessments' },
    { to: '/assessments/activities/mcquestions', title: 'Questions' },
  ],
})

const dialog = ref<boolean>(false)
const EditDialog = ref(false)
const deleteDialog = ref(false)
const snackbar = ref(false)
const questionToDelete = ref<string | null>(null)
const selectedQuestion = ref<IQuestions | null>(null)
const { questionsData, fetchQuestions, createQuestion, deleteQuestion } = useQuestions()

const headers = [
  { title: 'Title (TH)', align: 'start', key: 'title.th', width: '10px' },
  { title: 'Title (EN)', align: 'start', key: 'title.en', width: '10px' },
  { title: 'Text (TH)', align: 'start', key: 'text.th', width: '10px' },
  { title: 'Text (EN)', align: 'start', key: 'text.en', width: '10px' },
  {
    title: 'Image',
    align: 'center',
    key: 'image',
    width: '100px',
    sortable: false,
  },
  {
    title: 'Actions',
    align: 'center',
    key: 'actions',
    width: '100px',
    sortable: false,
  },
]

interface CreateSnackbarNotify {
  title: string
  type: string
}

const snackbarNotify = reactive<CreateSnackbarNotify>({
  title: '',
  type: '',
})

const onSnackbar = (title: string, type: string) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  snackbar.value = true
}

const openCreateDialog = () => {
  selectedQuestion.value = null
  EditDialog.value = false
  dialog.value = true
}

const openEditDialog = (item: IQuestions) => {
  selectedQuestion.value = item
  EditDialog.value = true
  dialog.value = true
}

const openDeleteDialog = (questionId: string) => {
  questionToDelete.value = questionId
  deleteDialog.value = true
}

const handleCreate = async (question: IQuestions) => {
  const formData = new FormData()
  formData.append('title[th]', question.title.th)
  formData.append('title[en]', question.title.en)
  formData.append('text[th]', question.text.th)
  formData.append('text[en]', question.text.en)

  if (question.image instanceof File) {
    formData.append('image', question.image)
  } else if (typeof question.image === 'string') {
    formData.append('image', question.image)
  }

  try {
    if (selectedQuestion.value && selectedQuestion.value.id) {
      // Update existing question
      await createQuestion(formData, selectedQuestion.value.id)
      onSnackbar('Question updated successfully!', 'success')
    } else {
      // Create new question
      await createQuestion(formData)
      onSnackbar('Question created successfully!', 'success')
    }
    await fetchQuestions() // Refresh data
    dialog.value = false // Close dialog
  } catch (error) {
    console.error('Error saving question:', error)
    onSnackbar('An error occurred while saving the question', 'error')
  }
}

const handleDelete = async (id: string) => {
  try {
    await deleteQuestion(id)
    // Refresh the data
    onSnackbar('Question deleted successfully!', 'success')
    await fetchQuestions()
    deleteDialog.value = false
  } catch (error) {
    console.error('Error deleting question:', error)
    onSnackbar('An error occurred while deleting the question', 'error')
  }
}

onMounted(() => {
  fetchQuestions()
})

function wrapStyle(lines: number = 1): Record<string, string | number> {
  return {
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    'white-space': 'normal',
    '-webkit-line-clamp': lines,
  }
}

function wrapHeight(lines: number = 1): string {
  return `${lines * 1.5}rem`
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="9" sm="8" class="d-flex justify-space-between">
        <h1 class="ml-1">Question MC</h1>
      </v-col>
      <v-col cols="12" md="3" sm="4" class="d-flex justify-end">
        <v-btn
          variant="elevated"
          prepend-icon="mdi-plus"
          color="black"
          rounded
          block
          @click="openCreateDialog"
        >
          Create Question
        </v-btn>
      </v-col>
    </v-row>

    <!-- Table to display questions -->
    <v-card
      class="mt-4"
      rounded="lg"
      elevation="0"
      block
      border
      style="overflow-y: auto; max-height: 80vh"
    >
      <v-data-table :headers="headers" :items="questionsData" item-key="id">
        <template #[`item.title.th`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(5)">
            <p :style="wrapStyle(3)">{{ item.title.th }}</p>
          </v-responsive>
        </template>
        <template #[`item.title.en`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(5)">
            <p :style="wrapStyle(3)">{{ item.title.en }}</p>
          </v-responsive>
        </template>
        <template #[`item.image`]="{ item }">
          <v-card
            color="black"
            max-width="6rem"
            max-height="6rem"
            class="mx-auto my-3"
            rounded="lg"
          >
            <v-img
              :src="item.image"
              class="mx-auto"
              max-width="6rem"
              max-height="6rem"
            />
          </v-card>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            icon
            color="primary"
            variant="flat"
            class="rounded-xl mx-2 my-2"
            @click="openEditDialog(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            variant="flat"
            class="rounded-xl my-2"
            @click="openDeleteDialog(item.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <questions-create
      v-model="dialog"
      :questions-data="questionsData"
      :EditDialog="EditDialog"
      :check-data="selectedQuestion"
      @save="handleCreate"
    />
    <questions-delete
      v-model="deleteDialog"
      :question-item="{ id: questionToDelete }"
      @delete="handleDelete"
    />
    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
  </v-container>
</template>

<style scoped></style>
