<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/lamduans/management', title: 'Lamduan Flowers Management' },
  ],
})

const { $api } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const apiBaseUrl = runtimeConfig.public.baseURL
const items = ref<Lamduan[]>([])
const dialogError = ref(false)
const search = ref('')
const deleteDialogs = ref<boolean>(false)

const headers = ref<Header[]>([
  { title: 'User', align: 'center', key: 'user.username', sortable: true },
  { title: 'Text', align: 'center', key: 'text', sortable: true },
  {
    title: 'LamduanImage',
    align: 'center',
    key: 'lamduanImage',
    sortable: true,
  },
  { title: 'Actions', align: 'center', key: 'actions', sortable: false },
])

interface Header {
  title: string
  align: 'center'
  key: string
  sortable: boolean
}

interface Lamduan {
  id: string
  user: IUser
  text: string
  lamduanImage: string
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

const selectedlamduan = ref<Lamduan | null>(null)
const editedIndex = ref(-1)
const deleteDialog = (item: Lamduan, index: number) => {
  deleteDialogs.value = true
  editedIndex.value = index
  selectedlamduan.value = item
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

const deleteItem = async () => {
  const id = selectedlamduan.value?.id
  const index = editedIndex.value

  if (!id) {
    console.error('Item does not have a valid id')
    return
  }

  try {
    await $api.delete(`${apiBaseUrl}/lamduans/${id}`)

    items.value.splice(index, 1)
    deleteDialogs.value = false
    onSnackbar('Deletion successful', 'success')
  } catch (error) {
    console.error('Error deleting item:', error)
    onSnackbar('Error deleting item', 'error')
  }
}

const filteredItems = computed(() => {
  if (!search.value) return items.value
  return items.value.filter((item) =>
    item.user.username.toLowerCase().includes(search.value.toLowerCase())
  )
})

const fetchData = async () => {
  try {
    const response = await $api.get<{ data: Lamduan[] }>(
      `${apiBaseUrl}/lamduans`
    )
    items.value = response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="8" sm="6">
        <span class="text-h4 font-weight-medium text-black"
          >Manage Lamduan</span
        >
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search"
          variant="outlined"
          density="compact"
          color="black"
          hide-details
          rounded
        />
      </v-col>
    </v-row>
    <v-card class="mt-4" rounded="lg" variant="text" border>
      <v-data-table :headers="headers" :items="filteredItems">
        <template #[`item.lamduanImage`]="{ item }">
          <div class="p-2">
            <v-img :src="item.lamduanImage" :alt="item.name" height="100px" />
          </div>
        </template>
        <template #[`item.actions`]="{ item, index }">
          <v-btn variant="text" icon @click="deleteDialog(item, index)">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

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
