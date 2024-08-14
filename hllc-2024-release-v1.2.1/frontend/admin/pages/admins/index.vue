<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/admins', title: 'Admin Management' },
  ],
})
const { $api } = useNuxtApp()
const checkFetchData = ref(false)
const adminFormDialog = ref(false)
const adminDeleteForm = ref(false)
const adminDeleteDialog = ref(false)
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
interface IAdminInfo {
  id: string
  name: {
    first: string
    last: string
  }
  username: string
  password: string
  major?: IMajor
  role: string
  fullName: string
}

const UsersData = ref<IAdminInfo[]>([])
const SchoolsData = ref<ISchool[]>([])
const selectUsers = ref<IAdminInfo[]>([])
const dialogs = {
    adminFormDialog,
    adminDeleteForm,
    adminDeleteDialog,
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
    openDialog('adminDeleteForm', userid)
}

const handleEdit = async (userid: string) => {
    selectedUserIds.value = userid
    selectUsers.value = filterUsersByIds(UsersData.value, userid)
    openDialog('adminFormDialog')
}

const handleConfirmDelete = () => {
    openDialog('adminDeleteDialog')
}

const filterUsersByIds = (
  usersData: IAdminInfo[],
  userIds: string | string[]
): IAdminInfo[] => {
  const idsToFilter = Array.isArray(userIds) ? userIds : [userIds]
  return usersData.filter((user) => idsToFilter.includes(user.id))
}

async function clearData() {
  selectedUserIds.value = ''
  selectUsers.value = []
}

const saveUser = async (formData: IAdminInfo) => {
    try {
        let url = 'admins/'
        let method = $api.post
        if (selectedUserIds.value !== '') {
            url += selectedUserIds.value
            method = $api.put
        }
        const response = await method<ApiResponse<IAdminInfo>>(url, {
            body: formData,
        })
        closeDialog('adminFormDialog')
        alert(response.message)
        UsersData.value.push(response.data)
    } catch (error) {
        console.error(error)
    }
}

const uploadUsers = async (data: IAdminInfo) => {
  const jsonData = JSON.stringify(data)
  try {
    const response = await $api.post<ApiResponse<IAdminInfo>>('admins/upload', {
      body: jsonData,
    })
    alert(response.message)
    if (response.data && Array.isArray(response.data)) {
      for (const user of response.data) {
        UsersData.value.push(user)
      }
    }
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
        const response = await $api.delete<ApiResponse<IAdminInfo>>(
            `admins/multiple`,
            { body: JSON.stringify(ids) }
        )
        closeDialog('adminDeleteForm')
        UsersData.value = UsersData.value.filter(user => !ids.includes(user.id));
        alert(response.message)
    } catch (error) {
        console.error(error)
    }
}

async function fetchUsers() {
  try {
    const response = await $api.get<ApiResponse<IAdminInfo[]>>('admins')
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

<template>
    <v-container v-if="checkFetchData" fluid>
        <div class="d-flex justify-space-between">
            <h1>Admin Management</h1>
        </div>
        <AdminTable 
            :userdata="UsersData" 
            @create="openDialog('adminFormDialog')" 
            @delete="handleDelete"
            @upload="fileUploadRef?.openUpload()" 
            @edit="handleEdit" 
        />
        <AdminFormDialog 
            v-model="adminFormDialog" 
            :selected-user="selectUsers" 
            :school-data="SchoolsData"
            @save="saveUser" 
        />
        <AdminImport 
            ref="fileUploadRef" 
            :school-data="SchoolsData" 
            @save="uploadUsers" 
        />
        <AdminListDelete 
            v-model="adminDeleteForm" 
            :selected-user="selectUsers" 
            @cancle="closeDialog('adminDeleteForm')"
            @delete="handleConfirmDelete" 
        />
        <DialogConfirm 
            v-model="adminDeleteDialog" 
            image="../../icons/delete.png"
            title="Do you want to delete this user?" 
            @submit="executeUserDeletion" 
        />
    </v-container>
    <v-container v-else class="d-flex justify-center align-center h-100">
        <v-progress-circular indeterminate color="primary" />
    </v-container>
</template>
