<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/community', title: 'Community' },
    { to: '/questionnair', title: 'Question' },
  ],
})

interface Question {
  questionnaire: {
    th: string
    en: string
  }
  type: string
  id?: string
  isEdit?: boolean
}

interface Header {
  title: string
  value: string
}

interface CreateDialogConfirm {
  image: string
  title: string
}

const headers = ref<Header[]>([
  { title: 'Questionnaire Thai', value: 'questionnaire.th' },
  { title: 'Questionnaire English', value: 'questionnaire.en' },
  { title: 'Type', value: 'type' },
  { title: 'Actions', value: 'actions' },
])

const { $api } = useNuxtApp()
const question = ref<Question[]>([])
const search = ref('')
const deleteDialogs = ref(false)
const editedItems = ref<Question | null>(null)
const openEditorDialog = ref(false)
const fetchData = async () => {
  try {
    const response = await $api.get<{ data: Question[] }>('questionnaire')
    question.value = response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const filteredItems = computed(() => {
  if (!search.value) return question.value
  return question.value.filter(
    (question) =>
      question.questionnaire.th
        .toLowerCase()
        .includes(search.value.toLowerCase()) ||
      question.questionnaire.en
        .toLowerCase()
        .includes(search.value.toLowerCase())
  )
})
const snackbar = ref(false)
interface CreateSnackbarNotify {
  title: string
  type: string
}

const snackbarNotify = ref<CreateSnackbarNotify>({
  title: '',
  type: '',
})

const onSnackbar = (title: string, type: string) => {
  snackbarNotify.value.title = title
  snackbarNotify.value.type = type
  snackbar.value = true
}

const dialogConfirmDetail = reactive<CreateDialogConfirm>({
  image: '',
  title: '',
})

const onDialogConfirm = (title: string, image: string) => {
  dialogConfirmDetail.title = title
  dialogConfirmDetail.image = image
}

const ondelete = (item: Question) => {
  deleteDialogs.value = true
  editedItems.value = JSON.parse(JSON.stringify(item))
  onDialogConfirm('Confirm delete creation?', '../../icons/delete.png')
}

const deleteItem = async () => {
  if (editedItems.value) {
    try {
      await $api.delete<{ data: Question[] }>(
        `questionnaire/${editedItems.value.id}`
      )
      fetchData()
      deleteDialogs.value = false
      onSnackbar('Deletion successful', 'success')
    } catch (error) {
      console.error('Error deleting item:', error)
      deleteDialogs.value = false
      onSnackbar('Error deleting item', 'error')
    }
  }
}

const editQuestion = async (item: Question) => {
  if (item.isEdit) {
    try {
      await $api.put<{ data: Question[] }>(`questionnaire/${item.id}`, {
        body: item,
      })
      fetchData()
      openEditorDialog.value = false
      onSnackbar('Update successful', 'success')
    } catch (error) {
      console.error('Error updating item:', error)
      openEditorDialog.value = false
      onSnackbar('Error updating item', 'error')
    }
  } else {
    try {
      await $api.post<{ data: Question[] }>(`questionnaire/`, {
        body: item,
      })
      fetchData()
      openEditorDialog.value = false
      onSnackbar('Post successful', 'success')
    } catch (error) {
      console.error('Error Post item:', error)
      openEditorDialog.value = false
      onSnackbar('Error updating item', 'error')
    }
  }
}

const onCreate = () => {
  openEditorDialog.value = true
}

const onUpdated = (item: Question) => {
  openEditorDialog.value = true
  editedItems.value = JSON.parse(JSON.stringify(item))
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <span class="text-h4 font-weight-medium text-black">Questionnaire</span>
      </v-col>
      <v-col cols="6" md="4">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search"
          variant="outlined"
          hide-details
          color="black"
          rounded-lg
        />
      </v-col>
      <v-col cols="6" md="4" class="d-flex justify-end">
        <v-btn rounded="lg" color="black" dark @click="onCreate()">
          <v-icon icon="mdi-table-plus" />Add
        </v-btn>
      </v-col>
    </v-row>
    <v-card rounded="lg" variant="text" border>
      <v-data-table :headers="headers" :items="filteredItems">
        <template #[`item.actions`]="{ item }">
          <v-btn variant="text" icon @click="onUpdated(item)">
            <v-icon color="black">mdi-pencil</v-icon>
          </v-btn>
          <v-btn variant="text" icon @click="ondelete(item)">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <DialogConfirm
      v-model="deleteDialogs"
      :image="dialogConfirmDetail.image"
      :title="dialogConfirmDetail.title"
      :color-confirm="'error'"
      :color-cancel="'black'"
      @submit="deleteItem"
    />

    <community-questionnaire
      v-model="openEditorDialog"
      :item="editedItems"
      @submit="editQuestion"
    />

    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
  </v-container>
</template>
