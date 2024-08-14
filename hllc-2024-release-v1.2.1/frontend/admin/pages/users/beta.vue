<template>
  <v-container v-if="checkFetchData">
    <v-row class="my-4">
      <v-col cols="12" class="d-flex justify-space-between">
        <h1>All Users</h1>
      </v-col>
    </v-row>
    <TableTemplate
      :headers="TableData.headers"
      :items="TableData.items"
      :group-by="TableData.groupBy"
      @select-watcher="handleSelected"
    >
      <template #header-actions-left>
        <v-btn variant="tonal" color="success" prepend-icon="mdi-plus" rounded>
          Add
          <v-menu activator="parent" content-class="rounded-xl">
            <v-list>
              <v-list-item @click="openDialog('userFormDialog')">
                <v-list-item-title>
                  <v-icon>mdi-plus</v-icon>
                  Add one
                </v-list-item-title>
              </v-list-item>
              <!-- Import User Button List -->
              <v-list-item @click="openUpload()">
                <v-list-item-title>
                  <v-icon>mdi-import</v-icon>
                  Import .xlsx file
                </v-list-item-title>
              </v-list-item>
              <UserHeaderToExcel />
              <!-- Hidden file upload anchor -->
              <input
                ref="fileUpload"
                type="file"
                style="display: none"
                accept=".xlsx"
                @change="onUpload"
              />
            </v-list>
          </v-menu>
        </v-btn>

        <v-btn
          variant="tonal"
          color="error"
          text="Delete"
          prepend-icon="mdi-trash-can"
          rounded
          :disabled="(selectedUserIds = [])"
          @click="deleteUserForm = true"
        />
      </template>
      <template #header-actions-right>
        <v-btn
          variant="text"
          color="grey"
          text="Filters"
          prepend-icon="mdi-filter-outline"
          rounded
        />
      </template>
      <template #actions="{ item }">
        <VerticalMenu :items="getActions(item)" />
      </template>
    </TableTemplate>
    <DialogConfirm
      v-model="deleteUserDialog"
      image="../../icons/delete.png"
      title="Do you want to delete this user?"
      @submit="postDeleteUser"
    />
    <UserFormDialog
      v-model="userFormDialog"
      :selected-user="selectedUser"
      :school-data="schools"
      @save="saveUser"
    />
    <UserListDelete v-model="deleteUserForm" />
    <FormDialog
      v-model="uploadDialog"
      icon="mdi-account-plus-outline"
      :max-width="hasMajor ? '70rem' : '50rem'"
      header="Upload users"
      sub-header="Uploaded User Information"
    >
      <template #content>
        <v-select
          v-model="upload.type"
          v-bind="textField"
          :items="types"
          item-title="text"
          item-value="value"
          label="Type"
          placeholder="User type"
          variant="outlined"
          density="compact"
          rounded
          clearable
          required
          autofocus
        />

        <v-select
          v-model="upload.round"
          v-bind="textField"
          :items="rounds"
          item-title="text"
          item-value="value"
          label="Round"
          placeholder="User round activity"
          variant="outlined"
          density="compact"
          rounded
          clearable
          required
          autofocus
        />

        <v-autocomplete
          v-if="!hasMajor"
          v-model="upload.school"
          v-bind="textField"
          :items="schools"
          item-title="name.en"
          item-value="name.en"
          label="School name"
          placeholder="Input students school"
          variant="outlined"
          density="compact"
          rounded
          clearable
          required
          autofocus
        />

        <v-autocomplete
          v-if="upload.school && !hasMajor"
          v-model="upload.major"
          v-bind="textField"
          :items="majors"
          item-title="name.en"
          item-value="id"
          label="Major name"
          placeholder="Input students major"
          variant="outlined"
          density="compact"
          rounded
          clearable
          required
          autofocus
        />

        <v-data-table
          v-model="selectedImportUser"
          :headers="importHeaders"
          :items="upload.users"
          :items-per-page="userPerPage[0].value"
          :items-per-page-options="userPerPage"
          show-select
        >
          <template #top>
            <v-toolbar class="px-3 bg-white" style="height: 48px">
              <v-btn
                variant="tonal"
                color="error"
                text="Delete"
                prepend-icon="mdi-trash-can"
                rounded
                :disabled="selectedImportUser.length === 0"
                @click="deleteUploadDialog = true"
              />
            </v-toolbar>
            <DialogConfirm
              v-model="deleteUploadDialog"
              image="../../icons/delete.png"
              title="Do you want to delete selected user?"
              @submit="deleteSelectedUsers"
            />
          </template>

          <template #item.actions="{ item: user }">
            <v-btn
              prepend-icon="mdi-pencil"
              text="edit"
              density="comfortable"
              style="font-size: small"
              color="blue-darken-1"
              rounded
              slim
              @click="openEditUpload(user)"
            />
          </template>
        </v-data-table>

        <!-- Edit Upload Dialog -->
        <FormDialog
          v-model="editUploadDialog"
          icon="mdi-account-edit-outline"
          header="Edit User"
          sub-header="Edit User Information"
          :max-width="hasMajor ? '40rem' : '30rem'"
        >
          <template #content>
            <v-card-text>
              <v-row dense>
                <v-col col="12" sm="12">
                  <v-text-field
                    v-model="editUploadUser.studentId"
                    v-bind="textField"
                    label="Student ID"
                    @input="checkChanges"
                  />
                </v-col>

                <v-col col="12" sm="12">
                  <v-text-field
                    v-model="editUploadUser.name.first"
                    v-bind="textField"
                    label="First Name"
                    @input="checkChanges"
                  />

                  <v-text-field
                    v-model="editUploadUser.name.last"
                    v-bind="textField"
                    label="Last Name"
                    @input="checkChanges"
                  />

                  <v-autocomplete
                    v-if="hasMajor"
                    v-model="editUploadUser.school"
                    v-bind="textField"
                    :items="schools"
                    item-title="name.en"
                    item-value="name.en"
                    label="School name"
                    placeholder="Input students school"
                  />

                  <v-autocomplete
                    v-if="hasMajor && editUploadUser.school"
                    v-model="editUploadUser.major"
                    v-bind="textField"
                    :items="majors"
                    item-title="name.en"
                    item-value="id"
                    label="Major name"
                    placeholder="Input students major"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
              <v-btn variant="text" rounded @click="editUploadDialog = false"
                >Cancel
              </v-btn>

              <v-btn
                :disabled="!isEditChanges"
                variant="flat"
                rounded
                color="primary"
                @click="confirmEdit"
              >
                Confirm
              </v-btn>
            </v-card-actions>
          </template>
        </FormDialog>

        <SnackbarNotify
          v-model="snackbar"
          :title="snackbarNotify.title"
          :type="snackbarNotify.type"
        />
        <v-card-actions class="d-flex justify-center">
          <v-btn variant="text" rounded @click="uploadDialog = false"
            >Cancel
          </v-btn>

          <v-btn
            :disabled="!isFormComplete"
            variant="flat"
            rounded
            color="primary"
            @click="submitImport"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </template>
    </FormDialog>
  </v-container>
  <v-container v-else class="d-flex justify-center align-center h-100">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>
<script setup lang="ts">
import type { VTextField, VForm } from 'vuetify/components'
import * as XLSX from 'xlsx'
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/users', title: 'Users' },
  ],
})
const { $api } = useNuxtApp()
const checkFetchData = ref(false)
const snackbar = ref(false)
const deleteUserDialog = ref(false)
const deleteUserForm = ref(false)
const selectedUserId = ref('')
const selectedUser = ref<IUser | null>(null)
const userFormDialog = ref(false)
const deleteUploadDialog = ref(false)
const uploadDialog = ref(false)
const hasMajor = ref(false)
const editUploadDialog = ref(false)
const fileUpload = ref<HTMLInputElement | null>(null)
const isEditChanges = ref(false)
const MajorIdMap: Ref<Record<string, { id: string; school: string }>> = ref({})
const form = ref<VForm | null>(null)
const selectedImportUser = ref<number[]>([])
const selectedUserIds: Ref<string[]> = ref([])
const types = reactive([
  { text: 'Normal', value: 'NORMAL' },
  { text: 'Tester', value: 'TESTER' },
  { text: 'Other', value: 'OTHER' },
])
const rounds = reactive([
  { text: 'Normal', value: 'NORMAL' },
  { text: 'Other', value: 'OTHER' },
])

interface IMajor {
  id: string
  name: {
    th: string
    en: string
  }
  acronym: string
  detail: {
    th: string
    en: string
  }
  school: Partial<ISchool>
}
interface ISchool {
  id: string
  name: {
    th: string
    en: string
  }
  acronym: string
  detail: {
    th: string
    en: string
  }
  majors: [IMajor]
}
interface IUserIncludeInfo {
  name: {
    first: string
    last: string
  }
  username: string
  major: Partial<IMajor>
  school?: string
  type: string
  round: string
  id: string
  fullName: string
}
interface IUser {
  username: string
  name: {
    first: string
    last: string
  }
  major?: string | undefined
  school?: string
  id?: string | undefined
  type: string
  round: string
}

const UserForm = ref({
  id: '',
  username: '',
  name: {
    first: '',
    last: '',
  },
  major: '',
  school: '',
  type: 'NORMAL',
  round: 'NORMAL',
})

interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}
const initialData: {
  user: IUserIncludeInfo
  usersData: IUserIncludeInfo[]
  userForm: IUser
} = {
  user: {
    name: {
      first: '',
      last: '',
    },
    username: '',
    major: {
      school: {},
    },
    type: '',
    round: '',
    id: '',
    fullName: '',
  },
  usersData: [],
  userForm: {
    username: '',
    name: {
      first: '',
      last: '',
    },
    major: '',
    school: '',
    type: 'NORMAL',
    round: 'NORMAL',
  },
}
const schools = ref<ISchool[]>([])
// const User = ref<IUser>({ ...initialData.user });
const UsersData = ref<IUserIncludeInfo[]>(initialData.usersData)
//--Snackbar--//
interface ISnackbarNotify {
  title: string
  type: string
}
const snackbarNotify = reactive<ISnackbarNotify>({
  title: '',
  type: '',
})
interface ISnackbarTemplates {
  success: string
  error: string
}

//--Snackbar--//

const SnackbarTemplate: ISnackbarTemplates = {
  success: `Successfully`,
  error: `Oops! Something went wrong. We couldn't complete your request at this time. Please try again later. If the problem persists, please contact our support team for assistance.`,
}

const onSnackbar = (title: string, type: keyof ISnackbarTemplates) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  snackbar.value = true
}

const TableData = reactive({
  headers: [
    { title: 'Student ID', align: 'start', value: 'username' },
    { title: 'Name', align: 'start', value: 'fullName' },
    { title: 'School', align: 'start', value: 'schoolName' },
    { title: 'Major', align: 'start', value: 'majorName' },
    { title: 'Status', align: 'start', value: 'type' },
    { title: 'Round', align: 'start', value: 'round' },
    { title: 'Actions', align: 'start', value: 'actions' },
  ],
  items: [] as {
    id: string
    username: string
    fullName: string
    schoolName: string
    majorName: string
    type: string
    round: string
    actions: unknown[]
  }[],
  groupBy: [
    {
      key: 'schoolName',
    },
  ],
})

const textField: VTextField['$props'] = {
  variant: 'outlined',
  persistentPlaceholder: true,
}

const upload = reactive({
  users: [] as IUser[],
  school: '',
  major: '',
  type: 'NORMAL',
  round: 'NORMAL',
})

const majors = computed(() => {
  if (UserForm.value.school) {
    const schoolName = UserForm.value.school
    const school = schools.value.find((school) => school.name.en === schoolName)
    return school ? school.majors : []
  }
  if (upload.school || (upload.users.length > 0 && upload.users[0]?.school)) {
    const schoolName = upload.school || upload.users[0]?.school
    const school = schools.value.find((school) => school.name.en === schoolName)
    return school ? school.majors : []
  }
  return []
})

const checkChanges = () => {
  isEditChanges.value =
    editUploadUser.studentId !== originalUser.studentId ||
    editUploadUser.name.first !== originalUser.name.first ||
    editUploadUser.name.last !== originalUser.name.last ||
    editUploadUser.school !== originalUser.school ||
    editUploadUser.major !== originalUser.major
}
const editedIndex = ref(-1)
const originalUser = reactive({
  studentId: '',
  name: { first: '', last: '' },
  school: '',
  major: '',
})

const editUploadUser = reactive({
  studentId: '',
  name: { first: '', last: '' },
  school: '',
  major: '',
})
const openEditUpload = (user: IUser) => {
  editedIndex.value = upload.users.indexOf(user)
  Object.assign(originalUser, JSON.parse(JSON.stringify(user)))
  Object.assign(editUploadUser, JSON.parse(JSON.stringify(user)))
  editUploadDialog.value = true
}
const confirmEdit = () => {
  Object.assign(upload.users[editedIndex.value], editUploadUser)
  editUploadDialog.value = false
  isEditChanges.value = false
}

const handleSelected = (selectedItems: string[]) => {
  selectedUserIds.value = selectedItems
}

const openUpload = () => {
  fileUpload.value?.click()
}

async function refreshData() {
  await clearFormData()
  checkFetchData.value = true
  try {
    const response = await $api.get<ApiResponse<IUserIncludeInfo[]>>(
      'users?includes=major'
    )
    UsersData.value = response.data
    updateTableItems()
    checkFetchData.value = true
    resetData()
  } catch (error) {
    onSnackbar(SnackbarTemplate.error, 'error')
  }
}

const fetchSchools = async () => {
  try {
    const response = await $api.get<{ data: ISchool[] }>(
      `/schools?includes=majors`
    )
    schools.value = response.data

    response.data.forEach((school) => {
      school.majors.forEach((major) => {
        MajorIdMap.value[major.name.en] = {
          id: major.id,
          school: school.name.en,
        }
      })
    })
  } catch (error) {
    console.error('Error fetching schools:', error)
  }
}

function updateTableItems() {
  TableData.items = UsersData.value.map((user) => ({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    schoolName: user.major.school?.name?.en || '',
    majorName: user.major.name?.en || '',
    type: user.type,
    round: user.round,
    actions: [],
  }))
}

function getActions(user: IUserIncludeInfo) {
  return [
    {
      icon: 'mdi-pencil',
      title: 'Edit',
      click: () => openDialog('userFormDialog', user.id),
    },
    {
      icon: 'mdi-delete',
      title: 'Delete',
      click: () => {
        selectedUserId.value = user.id
        deleteUserDialog.value = true
      },
    },
  ]
}

const onUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const file = input.files[0]
  const reader = new FileReader()
  reader.onload = (event) => {
    const data = new Uint8Array(event.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    hasMajor.value = 'major' in jsonData[0]

    try {
      upload.users = jsonData.map((user: any, index) => {
        const majorName = String(user['major'])
        const majorInfo = hasMajor.value
          ? MajorIdMap.value[majorName]
          : undefined

        if (hasMajor.value && !majorInfo) {
          throw new Error(
            `Major name "${majorName}" does not match any known major.`
          )
        }

        return {
          name: {
            first: String(user['first']),
            last: String(user['last']),
          },
          studentId: String(user['studentId']),
          major: hasMajor.value ? majorName : undefined,
          school: hasMajor.value ? majorInfo?.school : undefined,
          id: index,
        }
      })

      uploadDialog.value = true
    } catch (error: any) {
      alert(error.message)
    }
  }
  reader.readAsArrayBuffer(file)
}

const userPerPage = ref([
  { value: 20, title: '20' },
  { value: 50, title: '50' },
  { value: 100, title: '100' },
  { value: 200, title: '200' },
  { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
])

const importHeaders = computed(() => [
  { title: 'Student ID', key: 'studentId' },
  {
    title: 'Name',
    key: 'name',
    value: (item: IUser) => `${item.name.first} ${item.name.last}`,
  },
  ...(hasMajor.value
    ? [
        { title: 'School', key: 'school' },
        { title: 'Major', key: 'major' },
      ]
    : []),
  { title: 'Actions', key: 'actions' },
])

const submitImport = async () => {
  try {
    const userDtos = upload.users.map((user) => ({
      ...user,
      major: hasMajor.value
        ? MajorIdMap.value[user.major as string].id
        : undefined,
    }))

    const uploadData = {
      ...upload,
      users: userDtos,
    }

    await $api.post('users/upload', { body: uploadData })
  } catch (error) {
    console.log('Error occur while upload: ', error)
  }
  uploadDialog.value = false
}

const isFormComplete = computed(() => {
  if (hasMajor.value) {
    return (
      !!upload?.users &&
      upload.users.every((user) => !!user.major) &&
      !!upload?.type &&
      !!upload?.round
    )
  } else {
    return (
      !!upload?.users &&
      !!upload?.type &&
      !!upload?.round &&
      !!upload?.school &&
      !!upload?.major
    )
  }
})

const dialogs = {
  userFormDialog,
  deleteUploadDialog,
  deleteUserDialog,
}

const openDialog = (dialogName: keyof typeof dialogs, userId?: string) => {
  if (userId) {
    selectedUserId.value = userId
  }
  dialogs[dialogName].value = true
}

const closeDialog = (dialogName: keyof typeof dialogs) => {
  resetData()
  dialogs[dialogName].value = false
}

const resetData = () => {
  form.value?.reset()
  selectedUserId.value = ''
}

const saveUser = async (formData: IUser) => {
  try {
    let url = 'users/'
    let method = $api.post
    if (selectedUserId.value !== '') {
      url += selectedUserId.value
      method = $api.put
    }
    const response = await method<ApiResponse<IUser>>(url, {
      body: formData,
    })
    onSnackbar(`${response.data.username} added successfully`, 'success')
    closeDialog('userFormDialog')
  } catch (error) {
    console.error(error)
  }
}

const deleteSelectedUsers = () => {
  upload.users = upload.users.filter(
    (user) => !selectedImportUser.value.includes(user.id)
  )
  selectedImportUser.value = []
}

const postDeleteUser = async () => {
  try {
    const response = await $api.delete<ApiResponse<IUser>>(
      `users/${selectedUserId.value}`
    )
    refreshData()
    onSnackbar(`${response.data.username} deleted successfully`, 'success')
  } catch (error) {
    onSnackbar(SnackbarTemplate.error, 'error')
  }
}

async function clearFormData() {
  // UsersData.value = initialData.usersData
  selectedUser.value = null
  selectedUserId.value = ''
}

watch(selectedUserId, (newVal) => {
  selectedUser.value = UsersData.value?.find((user) => user.id === newVal)
})

onMounted(() => {
  refreshData()
  fetchSchools()
})
</script>
<style></style>
