<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/contests', title: 'Fresher Contest' },
    { to: '/contests/contents', title: 'Content Management' },
  ],
})

interface Contest {
  id: string
  team: string
  category: {
    th: string
    en: string
  }
  title: {
    th: string
    en: string
  }
  description: {
    th: string
    en: string
  }
  coverImage: string
  url: string
  members: [
    {
      name: string
      studentId: string
    }
  ]
}

const items = ref<Contest[]>([])
const { $api } = useApi()

const fetchData = async () => {
  checkFetchData.value = false
  try {
    const response = await $api.get<ApiResponse<Contest[]>>(`/contests`)
    items.value = response.data
    checkFetchData.value = true
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const openEditDialog = (data: Contest) => {
  editedIndex.value = 0
  editedItem.value = data
  createDialog.value = true
}
const openCreateDialog = () => {
  editedIndex.value = -1
  editedItem.value = {
    id: '',
    team: '',
    category: {
      th: '',
      en: '',
    },
    title: {
      th: '',
      en: '',
    },
    description: {
      th: '',
      en: '',
    },
    coverImage: '',
    url: '',
    members: [{ name: '', studentId: '' }],
  }
  createDialog.value = true
}

const deleteItem = async (item: string) => {
  try {
    await $api.delete(`/contests/${item}`)
    fetchData()
  } catch (error) {
    console.error('Error deleting item:', error)
    onSnackbar('Error deleting item', 'error')
  }
}

interface EditedItem {
  id: string
  team: string
  category: {
    th: string
    en: string
  }
  title: {
    th: string
    en: string
  }
  description: {
    th: string
    en: string
  }
  coverImage: string
  url: string
  members: Array<{
    name: string
    studentId: string
  }>
}

const editedItem = ref<EditedItem>({
  id: '',
  team: '',
  category: {
    th: '',
    en: '',
  },
  title: {
    th: '',
    en: '',
  },
  description: {
    th: '',
    en: '',
  },
  coverImage: '',
  url: '',
  members: [{ name: '', studentId: '' }],
})

const dialogConfirmAction = ref(false)
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

const editedIndex = ref(-1)
const createDialog = ref(false)
const formTitle = computed(() =>
  editedIndex.value === -1 ? 'Insert new Content contest' : 'Edit Contest'
)

const checkFetchData = ref(false)
const contestId = ref('')
const showDetails = ref(false)

function openDeleteContestDialog(contests: string) {
  contestId.value = contests
  actions.value.type = 'delete'
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
  dialogConfirmAction.value = true
}

const menuItems = (contests: Contest) => [
  {
    title: 'Edit',
    icon: 'mdi-pencil',
    click: () => openEditDialog(contests),
  },
  {
    title: 'Delete',
    icon: 'mdi-delete',
    click: () => openDeleteContestDialog(contests.id),
  },
]
const selectedContest = ref<Contest>()

const openDetailsDialog = (contest: Contest) => {
  selectedContest.value = contest
  showDetails.value = true
}

const actions = ref({
  type: 'create',
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <v-container v-if="checkFetchData" fluid>
    <div class="d-flex mb-2">
      <h2>All Contest</h2>
      <v-spacer />
      <v-btn
        rounded
        color="black"
        dark
        variant="flat"
        @click="openCreateDialog"
      >
        <v-icon icon="mdi-table-plus" start /> Add
      </v-btn>
    </div>
    <v-row dense>
      <v-col
        v-for="contests in items"
        :key="contests.id"
        cols="12"
        sm="6"
        md="3"
      >
        <ListCardTemplate
          :menu-items="menuItems(contests)"
          :photo="contests.coverImage"
        >
          <template #contents>
            <h3>Team: {{ contests.team }}</h3>
          </template>
          <template #actions>
            <v-row justify="end">
              <v-col cols="auto">
                <v-btn
                  class="mt-1 text-none rounded-pill font-weight-bold"
                  color="black"
                  variant="flat"
                  @click="openDetailsDialog(contests)"
                >
                  See details
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </ListCardTemplate>
      </v-col>
    </v-row>

    <ShowDetailContest
      v-model="showDetails"
      :selected-contest="selectedContest"
    />

    <CreateContestDialog
      v-model="createDialog"
      :form-title="formTitle"
      :identify="editedItem"
      @submit="fetchData"
    />

    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />

    <DialogConfirm
      v-model="dialogConfirmAction"
      :image="dialogConfirmDetail.image"
      :title="dialogConfirmDetail.title"
      @submit="deleteItem(contestId)"
    />
  </v-container>
  <v-container v-else class="d-flex justify-center align-center h-100" fluid>
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>

<style scoped></style>
