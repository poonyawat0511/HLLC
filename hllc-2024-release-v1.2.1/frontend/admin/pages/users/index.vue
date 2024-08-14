<template>
  <v-container v-if="checkFetchData" fluid>
    <div class="d-flex justify-space-between">
      <h1>All Users</h1>
    </div>
    <UserTable
      :userdata="UsersData"
      @create="openDialog('userFormDialog')"
      @delete="handleDelete"
      @upload="fileUploadRef?.openUpload()"
      @edit="handleEdit"
    />
    <UserFormDialog
      v-model="userFormDialog"
      :selected-user="selectUsers"
      :school-data="SchoolsData"
      @save="saveUser"
    />
    <UserImport
      ref="fileUploadRef"
      :school-data="SchoolsData"
      @save="uploadUsers"
    />
    <UserListDelete
      v-model="userDeleteForm"
      :selected-user="selectUsers"
      @cancle="closeDialog('userDeleteForm')"
      @delete="handleConfirmDelete"
    />
    <DialogConfirm
      v-model="userDeleteDialog"
      image="../../icons/delete.png"
      title="Do you want to delete this user?"
      @submit="executeUserDeletion"
    />
  </v-container>
  <v-container v-else class="d-flex justify-center align-center h-100">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>
<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/users', title: 'Users' },
  ],
})
const { $api } = useNuxtApp()
const checkFetchData = ref(false)
const userFormDialog = ref(false)
const userDeleteForm = ref(false)
const userDeleteDialog = ref(false)
const selectedUserIds: Ref<string | string[]> = ref('')
const fileUploadRef = ref<{ openUpload: () => void }>()
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
  school: SchoolEntity
}
interface ISchool extends SchoolEntity {
  majors: Array<{
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
    school: string
  }>
}
interface IUserInfo {
  id: string
  name: {
    first: string
    last: string
  }
  username: string
  major: IMajor
  type: string
  round: string
  fullName: string
}

const UsersData = ref<IUserInfo[]>([])
const SchoolsData = ref<ISchool[]>([])
const selectUsers = ref<IUserInfo[]>([])
const dialogs = {
  userFormDialog,
  userDeleteForm,
  userDeleteDialog,
}

const openDialog = async (
  dialogName: keyof typeof dialogs,
  userIds?: string | string[]
) => {
  if (userIds) {
    selectedUserIds.value = userIds
  }
  dialogs[dialogName].value = true
}

const closeDialog = (...dialogNames: (keyof typeof dialogs)[]) => {
  dialogNames.forEach((dialogName) => {
    dialogs[dialogName].value = false
  })
  clearData()
}

const handleDelete = async (userid: string | string[]) => {
  selectUsers.value = filterUsersByIds(UsersData.value, userid)
  openDialog('userDeleteForm', userid)
}

const handleEdit = async (userid: string) => {
  selectedUserIds.value = userid
  selectUsers.value = filterUsersByIds(UsersData.value, userid)
  openDialog('userFormDialog')
}

const handleConfirmDelete = () => {
  openDialog('userDeleteDialog')
}

const filterUsersByIds = (
  usersData: IUserInfo[],
  userIds: string | string[]
): IUserInfo[] => {
  const idsToFilter = Array.isArray(userIds) ? userIds : [userIds]
  return usersData.filter((user) => idsToFilter.includes(user.id))
}

async function clearData() {
  selectedUserIds.value = ''
  selectUsers.value = []
}

const saveUser = async (formData: IUserInfo) => {
  try {
    let url = 'users/'
    let method = $api.post
    if (selectedUserIds.value !== '') {
      url += selectedUserIds.value
      method = $api.put
    }
    const response = await method<ApiResponse<IUserInfo>>(url, {
      body: formData,
    })
    closeDialog('userFormDialog')
    alert(response.message)
  } catch (error) {
    console.error(error)
  }
}

const uploadUsers = async (data: IUserInfo) => {
  const jsonData = JSON.stringify(data)

  try {
    const response = await $api.post<ApiResponse<IUserInfo>>('users/upload', {
      body: jsonData,
    })
    alert(response.message)
  } catch (error) {
    console.error(error)
  }
}

const executeUserDeletion = async () => {
  try {
    let ids: string[] = []
    if (typeof selectedUserIds.value === 'string') {
      ids.push(selectedUserIds.value as string)
    } else if (Array.isArray(selectedUserIds.value)) {
      ids = selectedUserIds.value as string[]
    }
    const response = await $api.delete<ApiResponse<IUserInfo>>(
      `users/multiple`,
      { body: JSON.stringify(ids) }
    )
    closeDialog('userDeleteForm')
    alert(response.message)
  } catch (error) {
    console.error(error)
  }
}

async function fetchUsers() {
  try {
    const response = await $api.get<ApiResponse<IUserInfo[]>>(
      'users?includes=major'
    )
    UsersData.value = response.data
    if (response.statusCode === 200) {
      checkFetchData.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

async function fetchSchools() {
  try {
    const response = await $api.get<ApiResponse<ISchool[]>>(
      'schools?includes=majors'
    )
    SchoolsData.value = response.data
    if (response.statusCode === 200) {
      checkFetchData.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchUsers()
  fetchSchools()
})
</script>
<style></style>
