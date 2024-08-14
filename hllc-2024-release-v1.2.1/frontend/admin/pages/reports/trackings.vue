<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/reports', title: 'User Reports' },
    { to: '/reports/trackings', title: 'Report Trackings' },
  ],
})
interface Report {
  id: string
  category: {
    name: {
      en: string
      th: string
    }
  }
  message: string
  status: string
  reporter: {
    username: string
  }
}

const headers = ref([
  { title: 'Student ID', key: 'reporter.username', sortable: true },
  { title: 'Category', key: 'category.name.en', sortable: true },
  { title: 'Message', key: 'message', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Action', key: 'action', sortable: false },
])

const dialogEdit = ref(false)
const search = ref('')
const selectedChoice = ref('')
const reportsStorage = ref<Report[]>([])
const dialogConfirm = ref(false)
const responseBack = ref(false)
const { $api } = useNuxtApp()

async function fetchData() {
  try {
    const response = await $api.get<ApiResponse<Report[]>>('reports')
    reportsStorage.value = response.data
  } catch (error) {
    console.error(error)
  }
}

async function updateReportStatus(
  reportId: string,
  status: string
): Promise<Report> {
  try {
    const response = await $api.put<Report>(`reports/${reportId}`, {
      body: JSON.stringify({ status: status }),
    })
    responseBack.value = true
    fetchData()
    return response
  } catch (error) {
    console.error('Error updating report status:', error)
    throw error
  }
}

onMounted(() => {
  fetchData()
})

const filteredItems = computed(() => {
  if (!search.value) return reportsStorage.value
  return reportsStorage.value.filter((item) => {
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
  })
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'IN PROCESS':
      return 'warning'
    case 'DONE':
      return 'green'
    default:
      return 'error'
  }
}

const currentItem = ref<Report | null>(null)

const onChange = (item: Report) => {
  currentItem.value = item
  selectedChoice.value = item.status
  dialogEdit.value = true
}

const onCancel = () => {
  dialogEdit.value = false
  dialogConfirm.value = false
  responseBack.value = false
}

const editStatus = () => {
  dialogEdit.value = false
  dialogConfirm.value = true
}

const choiceDropDown = ref(['IN PROCESS', 'DONE'])

const confirmEdit = async () => {
  if (currentItem.value) {
    try {
      const updatedReport = await updateReportStatus(
        currentItem.value.id,
        selectedChoice.value
      )
      currentItem.value.status = updatedReport.status
    } catch (error) {
      console.error('Error updating report:', error)
    }
  } else {
    console.error('No item selected for editing')
  }

  dialogConfirm.value = false
  selectedChoice.value = ''
}
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="8">
        <h1>Reports</h1>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          variant="outlined"
          hide-details
          rounded
          density="compact"
        />
      </v-col>
    </v-row>
    <v-card class="mt-4" rounded variant="text" border>
      <v-data-table :headers="headers" :items="filteredItems">
        <template #[`item.status`]="{ item }">
          <v-chip
            variant="flat"
            class="ma-2"
            :color="getStatusClass(item.status)"
          >
            <p class="white--text">{{ item.status }}</p>
          </v-chip>
        </template>
        <template #[`item.action`]="{ item }">
          <v-btn variant="text" icon @click="onChange(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template #no-data>
          <v-chip variant="outlined" rounded="lg" color="error">
            Not have data available
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <!-- dialog edit -->
    <v-dialog
      v-model="dialogEdit"
      max-width="30rem"
      persistent
      content-class="elevation-0"
    >
      <v-card class="rounded-xl">
        <v-card-title> Which choice do you choose? </v-card-title>
        <v-divider />
        <div class="mr-3 ml-3 mt-3">
          <v-select
            v-model="selectedChoice"
            :items="choiceDropDown"
            label="Selected choice"
            variant="underlined"
            :rules="[(v: string) => !!v || 'Selection is required']"
          />
        </div>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            rounded
            class="pa-2"
            variant="flat"
            color="red"
            @click="onCancel()"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="selectedChoice == ''"
            class="pa-2"
            rounded="xl"
            variant="flat"
            color="success"
            @click="editStatus()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ConfirmDialogReports
      :open-dialog="dialogConfirm"
      title="Confirm to Edit?"
      @update:open-dialog="dialogConfirm = $event"
      @close="onCancel"
    >
      <template #actions>
        <v-btn
          rounded="xl"
          class="pa-2"
          variant="flat"
          color="red"
          @click="onCancel"
          >Cancel</v-btn
        >
        <v-btn
          class="pa-2"
          rounded="xl"
          variant="flat"
          color="success"
          @click="confirmEdit"
          >Confirm</v-btn
        >
      </template>
    </ConfirmDialogReports>
    <!-- Response dialog -->
    <ConfirmDialogReports
      :open-dialog="responseBack"
      title="Your change was successful"
      @update:open-dialog="responseBack = $event"
      @close="onCancel"
    >
      <template #actions>
        <v-btn
          rounded="xl"
          class="pa-2"
          variant="flat"
          color="red"
          @click="onCancel"
          >Close</v-btn
        >
      </template>
    </ConfirmDialogReports>
  </v-container>
</template>

<style scoped></style>
