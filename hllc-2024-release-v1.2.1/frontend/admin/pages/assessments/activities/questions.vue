<script setup lang="ts">
import type { VDataTable } from 'vuetify/components'
const dialogConfirm = ref(false)
const selectedActivityId = ref<string>('')
const itemActivity = ref<ActivityModel[]>([])
const dialogView = ref(false)
const questionCreate = ref<boolean>(false)
const items = ref<DialogModel[]>([])
const snackbar = ref(false)
const { $api } = useNuxtApp()
const editedItem = ref<DialogModel>()
type DataTable = InstanceType<typeof VDataTable>['$props']
const headers = ref<DataTable['headers']>([
  {
    title: 'Question English',
    align: 'start',
    sortable: false,
    key: 'question.en',
    width: '200px',
  },
  {
    title: 'Question Thai',
    align: 'start',
    sortable: false,
    key: 'question.th',
    width: '200px',
  },
  {
    title: 'Question Type',
    align: 'center',
    sortable: false,
    key: 'type',
    width: '100px',
  },
  {
    title: 'Required',
    align: 'center',
    sortable: false,
    key: 'required',
    width: '100px',
  },
  {
    title: 'Actions',
    align: 'center',
    sortable: false,
    key: 'actions',
    width: '100px',
  },
])

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/assessments', title: 'Assessments' },
    { to: '/assessments/activiities/questions', title: 'Activities Questions' },
  ],
})

interface ActivityModel {
  id: string
  name: {
    th: string
    en: string
  }
}

interface DialogModel {
  id: string
  question: {
    th: string
    en: string
  }
  activity: {
    id: string
  }
  type: string
  status: string
  required: boolean
}

onMounted(async () => {
  await fetchActivity()
  if (itemActivity.value.length > 0) {
    selectedActivityId.value = itemActivity.value[0].id
    await fetchQuestionsByActivity(selectedActivityId.value)
  }
})

const fetchActivity = async () => {
  try {
    const response = await $api.get<{ data: ActivityModel[] }>('/activities')
    itemActivity.value = response.data
  } catch (error) {
    console.error('Error fetching questions:', error)
  }
}

const fetchQuestionsByActivity = async (id: string) => {
  if (!id) return
  try {
    const response = await $api.get<{ data: DialogModel[] }>(
      `/activities/${id}/assessments`
    )
    items.value = response.data
  } catch (error) {
    console.error('Error fetching questions:', error)
  }
}
const createQuestion = async (question: DialogModel) => {
  try {
    console.log(question)
    await $api.post<ApiResponse<DialogModel>>('/assessments', {
      body: {
        question: {
          th: question.question.th,
          en: question.question.en,
        },
        status: 'ACTIVITY',
        activity: question.activity,
        type: question.type,
        required: question.required,
      },
    })
    await fetchQuestionsByActivity(selectedActivityId.value)
    onSnackbar('Question created successfully', 'success')
  } catch (error) {
    console.error('Error creating question:', error)
    onSnackbar(`Error: ${error}`, 'error')
  }
}

const updateQuestion = async (question: DialogModel) => {
  try {
    console.log(question)

    await $api.put<ApiResponse<DialogModel>>(`/assessments/${question.id}`, {
      body: {
        question: {
          th: question.question.th,
          en: question.question.en,
        },
        activity: question.activity,
        status: 'ACTIVITY',
        type: question.type,
        required: question.required,
      },
    })
    await fetchQuestionsByActivity(selectedActivityId.value)
    onSnackbar('Question updated successfully', 'success')
  } catch (error) {
    console.error('Error updating question:', error)
    onSnackbar(`Error: ${error}`, 'error')
  }
}
const handleCreateOrUpdate = async (question: DialogModel) => {
  try {
    if (question.id) {
      await updateQuestion(question)
    } else {
      await createQuestion(question)
    }
    questionCreate.value = false
  } catch (error) {
    console.error('Error handling create or update:', error)
    onSnackbar(`Error: ${error}`, 'error')
  }
}

function wrapHeight(lines: number = 1): string {
  return `${lines * 1.5}rem`
}

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

const activityName = computed(() => {
  const activity = itemActivity.value.find(
    (activity) => activity.id === selectedActivityId.value
  )
  return activity ? activity.name.en : ''
})

const menuItems = ref([
  { title: 'Create', icon: 'mdi-plus', action: 'create' },
  { title: 'View', icon: 'mdi-eye', action: 'view' },
])

interface CreateDialogConfirm {
  image: string
  title: string
}
const dialogConfirmDetail = reactive<CreateDialogConfirm>({
  image: '',
  title: '',
})

const opendialogView = (activityId: string) => {
  dialogView.value = true
  selectedActivityId.value = activityId
}
interface SelectedItem {
  action: string
}

const handleItemClick = (selected: SelectedItem) => {
  if (selected.action === 'create') {
    openCreEdit()
  } else if (selected.action === 'view') {
    opendialogView(selectedActivityId.value)
  }
}

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

const deleteItemId = ref<string>('')

const openCreEdit = () => {
  questionCreate.value = true
  dialogConfirmDetail.title = 'Create Question' // Set the title for create
  dialogConfirmDetail.image = 'mdi-plus' // Set the icon for create
}

const openEdit = (item: DialogModel) => {
  questionCreate.value = true
  editedItem.value = { ...item }
  dialogConfirmDetail.title = 'Update Question' // Set the title for update
  dialogConfirmDetail.image = 'mdi-pencil' // Set the icon for update
}

const openDelete = (item: DialogModel) => {
  deleteItemId.value = item.id
  dialogConfirmDetail.title = 'Confirm Delete'
  dialogConfirmDetail.image = '../../icons/delete.png'
  dialogConfirm.value = true
}

const deleteItem = async () => {
  try {
    await $api.delete(`/assessments/${deleteItemId.value}`)
    await fetchQuestionsByActivity(selectedActivityId.value)
    onSnackbar('delete question successfully', 'success')
    dialogConfirm.value = false
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}
</script>
<template>
  <ClientOnly>
    <v-container fluid>
      <v-row class="mb-4">
        <v-col cols="12" md="6" sm="6" class="d-flex align-center">
          <span class="text-h4 font-weight-medium">Question Activity</span>
        </v-col>
        <v-col cols="12" md="4" sm="4" class="d-flex align-center">
          <v-autocomplete
            v-model="selectedActivityId"
            label="Please select activity"
            :items="itemActivity"
            item-value="id"
            item-title="name.en"
            variant="outlined"
            hide-details="auto"
            density="compact"
            rounded
            @update:model-value="fetchQuestionsByActivity"
          />
        </v-col>
        <v-col cols="12" md="2" sm="2">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                prepend-icon="mdi-check-circle"
                append-icon="mdi-menu-down"
                color="black"
                rounded
                block
                v-bind="props"
                >Add</v-btn
              >
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                @click="handleItemClick(item)"
              >
                <v-list-item-title>
                  <v-icon>{{ item.icon }}</v-icon>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <v-card class="rounded-lg" elevation="0" border>
        <v-card-text>
          <v-data-table :headers="headers" :items="items">
            <template #[`item.question.th`]="{ item }">
              <v-responsive class="d-flex align-center" :height="wrapHeight(5)">
                <p class="td" :style="wrapStyle(3)">{{ item.question.th }}</p>
              </v-responsive>
            </template>
            <template #[`item.question.en`]="{ item }">
              <v-responsive class="d-flex align-center" :height="wrapHeight(5)">
                <p class="td" :style="wrapStyle(3)">{{ item.question.en }}</p>
              </v-responsive>
            </template>
            <template #[`item.required`]="{ item }">
              <p class="td" :style="wrapStyle(1)">{{ item.required }}</p>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-btn icon elevation="0" @click="openEdit(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon elevation="0">
                <v-icon color="error" @click="openDelete(item)">
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <question-create-question
        v-model="questionCreate"
        :icon="dialogConfirmDetail.image"
        :title="dialogConfirmDetail.title"
        :activities="itemActivity"
        :question="editedItem"
        @submit="handleCreateOrUpdate"
      />

      <question-view-dialog
        v-model="dialogView"
        :activity-detail="items"
        :activity-id="selectedActivityId"
        :activity-name="activityName"
        @close-dialog="dialogView = false"
      />

      <DialogConfirm
        v-model="dialogConfirm"
        :image="dialogConfirmDetail.image"
        :title="dialogConfirmDetail.title"
        @submit="deleteItem()"
      />

      <SnackbarNotify
        v-model="snackbar"
        :title="snackbarNotify.title"
        :type="snackbarNotify.type"
      />
    </v-container>
  </ClientOnly>
</template>
