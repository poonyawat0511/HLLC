<script setup lang="ts">
import { computed, onMounted } from 'vue'

const headers = ref<Header[]>([
  { title: 'Category Thai', align: 'center', key: 'name.th', sortable: true },
  { title: 'Category Eng', align: 'center', key: 'name.en', sortable: true },
  { title: 'Actions', align: 'center', key: 'actions', sortable: false },
])

interface Header {
  title: string
  align: 'center'
  key: string
  sortable: boolean
}

interface Category {
  id: string
  name: {
    th: string
    en: string
  }
}

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

const dialogError = ref(false)
const thaiPattern = /^[ก-๏\s]+$/
const englishPattern = /^[a-zA-Z\s]+$/

const showErrorDialog = (message: string) => {
  onDialogConfirm(`${message}`, '../../icons/error.png')
  dialogError.value = true
}
// Validate form data
const isValidForm = () => {
  const isCategoryTHNotEmpty = editedItems.value.name.th.trim() !== ''
  const isCategoryENNotEmpty = editedItems.value.name.en.trim() !== ''
  const isValidCategoryTH = thaiPattern.test(editedItems.value.name.th.trim())
  const isValidCategoryEN = englishPattern.test(
    editedItems.value.name.en.trim()
  )

  if (!isCategoryTHNotEmpty || !isCategoryENNotEmpty) {
    showErrorDialog('Please ensure the information is not empty.')
    return false
  }

  if (!isValidCategoryTH || !isValidCategoryEN) {
    showErrorDialog('Please enter valid Thai and English categories.')
    return false
  }

  return true
}
const { $api } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const apiBaseUrl = runtimeConfig.public.baseURL
const createDialog = ref<boolean>(false)
const items = ref<Category[]>([])
const search = ref('')
const deleteDialogs = ref<boolean>(false)
const editedItems = ref<Category>({
  name: {
    th: '',
    en: '',
  },
  id: '',
})

const fetchData = async () => {
  try {
    const response = await $api.get<{ data: Category[] }>(
      `${apiBaseUrl}/report-categories`
    )
    items.value = response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const isDuplicate = (name: { th: string; en: string }) => {
  return items.value.some(
    (item) => item.name.th === name.th && item.name.en === name.en
  )
}
// Save (create or update) an item
const onSave = async () => {
  if (!isValidForm()) return

  if (isDuplicate(editedItems.value.name)) {
    onSnackbar('This category already exists.', 'warning')
    return
  }

  if (editedIndex.value > -1 && editedItems.value.id) {
    // Update existing report
    try {
      await $api.put(
        `${apiBaseUrl}/report-categories/${editedItems.value.id}`,
        { body: JSON.stringify({ name: editedItems.value.name }) }
      )
      Object.assign(items.value[editedIndex.value], editedItems.value)
      createDialog.value = false
      onSnackbar('Update successful', 'success')
    } catch (error) {
      console.error('Error updating item:', error)
      onSnackbar('Error updating item', 'error')
    }
  } else {
    // Create new report
    try {
      await $api.post(`${apiBaseUrl}/report-categories`, {
        body: JSON.stringify(editedItems.value),
      })

      createDialog.value = false
      fetchData()
      onSnackbar('Creation successful', 'success')
    } catch (error) {
      console.error('Error submitting report:', error)
      onSnackbar('Error creating item', 'error')
    }
  }
}

const filteredItems = computed(() => {
  if (!search.value) return items.value
  return items.value.filter(
    (item) =>
      item.name.th.toLowerCase().includes(search.value.toLowerCase()) ||
      item.name.en.toLowerCase().includes(search.value.toLowerCase())
  )
})
const onCancel = () => {
  createDialog.value = false
  deleteDialogs.value = false
}
const editedIndex = ref(-1)
const formTitle = computed(() =>
  editedIndex.value === -1 ? 'New Report Category' : 'Edit Report Category'
)
const openCreateDialog = () => {
  editedIndex.value = -1
  editedItems.value = { name: { th: '', en: '' }, id: '' }
  createDialog.value = true
}

const openEditDialog = (item: Category, index: number) => {
  editedIndex.value = index
  editedItems.value = JSON.parse(JSON.stringify(item))
  createDialog.value = true
}

const deleteDialog = (item: Category, index: number) => {
  deleteDialogs.value = true
  editedIndex.value = index
  editedItems.value = JSON.parse(JSON.stringify(item))
  onDialogConfirm('Confirm delete creation?', '../../icons/delete.png')
}

interface CreateDialogConfirm {
  image: string
  title: string
}
const dialogConfirmDetail = reactive<CreateDialogConfirm>({
  image: '',
  title: '',
})

const onDialogConfirm = (title: string, image: string) => {
  dialogConfirmDetail.title = title
  dialogConfirmDetail.image = image
}

const deleteItem = async (item: Category, index: number) => {
  if (!editedItems.value.id) {
    console.error('Item does not have a valid _id')
    return
  }

  try {
    await $api.delete(`${apiBaseUrl}/report-categories/${editedItems.value.id}`)

    items.value.splice(index, 1)
    deleteDialogs.value = false
    onSnackbar('Deletion successful', 'success')
  } catch (error) {
    console.error('Error deleting item:', error)
    onSnackbar('Error deleting item', 'error')
  }
}

onMounted(() => {
  fetchData()
})

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/reports', title: 'User Reports' },
    { to: '/reports/categiries', title: 'Report Categories' },
  ],
})
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="6" sm="6">
        <span class="text-h4 font-weight-medium text-black"
          >Report Categories</span
        >
      </v-col>
      <v-col  cols="12" md="4" sm="4">
        <v-text-field
          v-model="search"
         prepend-inner-icon="mdi-magnify"
          label="Search"
          variant="outlined"
          hide-details
          color="black"
          rounded
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="2" sm="2" class="d-flex justify-end">
        <v-btn
          prepend-icon="mdi-plus"
          rounded
          block
          color="black"
          @click="openCreateDialog"
          >Add
        </v-btn>
      </v-col>
    </v-row>

    <v-card  class="mt-4" variant="text" rounded border>
      <v-data-table :headers="headers" :items="filteredItems">
        <template #[`item.actions`]="{ item, index }">
          <v-btn variant="text" icon @click="openEditDialog(item, index)">
            <v-icon color="black">mdi-pencil</v-icon>
          </v-btn>
          <v-btn variant="text" icon @click="deleteDialog(item, index)">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- dialog create -->
    <v-dialog v-model="createDialog" persistent max-width="700">
      <v-card class="rounded-lg" max-width="700" max-height="500">
        <v-card-title class="mt-3 ml-4">
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItems.name.th"
                label="Category Thai"
                required
                pattern="^[ก-๏\s]+$"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editedItems.name.en"
                label="Category English"
                required
                pattern="^[a-zA-Z\s]+$"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="text" @click="onCancel">Cancel</v-btn>
          <v-btn color="black" variant="flat" @click="onSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <DialogConfirm
      v-model="dialogError"
      :image="dialogConfirmDetail.image"
      :title="dialogConfirmDetail.title"
      @submit="dialogError = false"
    />

    <!-- delete dialog -->
    <DialogConfirm
      v-model="deleteDialogs"
      :image="dialogConfirmDetail.image"
      :title="dialogConfirmDetail.title"
      :color-confirm="'error'"
      :color-cancel="'black'"
      @submit="deleteItem"
    />

    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
  </v-container>
</template>

<style scoped>
.text-center {
  text-align: center;
}
.small-text-field .v-text-field__control {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
.small-text-field .v-input__control {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
.v-dialog {
  border-radius: 20px;
}
</style>
