<template>
  <FormDialog
    v-model="dialog"
    icon="mdi-account-plus-outline"
    max-width="1200px"
    header="Import Users"
    sub-header="List of imported users."
  >
    <template #content>
      <!-- <v-select
        v-model="uploadData.role"
        :items="roles"
        item-title="text"
        item-value="value"
        label="Round"
        placeholder="User round activity"
        density="compact"
        hide-details="auto"
        variant="outlined"
        rounded
        clearable
        required
        class="py-2"
      /> -->
      <v-data-table
        :headers="Table.headers"
        :items="uploadData.users"
        item-value="id"
        height="auto"
      />
      <v-col class="d-flex justify-center">
        <v-btn variant="text" rounded @click="dialog=false">Cancel</v-btn>
        <v-btn variant="flat" rounded color="primary" @click="saveUser"
          >Confirm</v-btn
        >
      </v-col>
    </template>
  </FormDialog>
  <input
    ref="fileUpload"
    type="file"
    style="display: none"
    accept=".xlsx"
    @change="onUpload"
  >
</template>
<script setup lang="ts">
import * as XLSX from 'xlsx'
const dialog = defineModel<boolean>({ default: false })
const Table = reactive({
  headers: [
    { title: 'Username', align: 'start', value: 'username' },
    { title: 'Password', align: 'start', value: 'password' },
    { title: 'Name', align: 'start', value: 'fullName' },
    { title: 'School', align: 'start', value: 'schoolName' },
    { title: 'Major', align: 'start', value: 'majorName' },
    { title: 'Role', align: 'start', value: 'role' },
    { title: 'Actions', align: 'start', value: 'actions' },
  ],
})
interface IUploadUser {
  username: string
  password: string
  fullName: string
  name: {
    first: string
    last: string
  }
  major?: string
  majorName?: string;
  role?: string
}


const props = defineProps<{
  selectedUser?: IUser
  schoolData?: Array<{
    name: { en: string }
    majors: Array<{ id: string; name: { en: string } }>
  }>
}>()
const emit = defineEmits(['save','close'])

const roles = [
  { text: 'AE', value: 'AE' },
  { text: 'Admin', value: 'ADMIN' },
  { text: 'Staff', value: 'STAFF' },
  { text: 'Sponsor', value: 'SPONSOR' },
  { text: 'Lecturer', value: 'LECTURER' },
]

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

interface IUser {
  id: string
  name: {
    first: string
    last: string
  }
  username: string
  password: string
  major?: IMajor
  role?: string
  fullName: string
}

const fileUpload = ref<HTMLInputElement | null>(null)
const openUpload = () => {
  fileUpload.value?.click()
}
const onUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0) {
    const file = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      const rows: IUploadUser[] = jsonData.slice(1).map((row) => {
        return {
          username: String(row[0]),
          password: row[1],
          name: {
            first: row[2] as string,
            last: row[3] as string
          },
          fullName: `${row[2] as string} ${row[3] as string}`,
          role: row[4] as string,
          majorName: row[5] as string,
          major: findMajorIdByName(row[5] as string),
        }
      })
      uploadData.value.users = rows.map((row) => ({
        ...row,
        schoolName: mapSchoolNameByMajor(row.majorName as string),
      }))      
      dialog.value = true
    }
    reader.readAsArrayBuffer(file)
  }
}

const mapSchoolNameByMajor = (majorName: string): string | undefined => {
  if (!props.schoolData) return undefined
  for (const school of props.schoolData) {
    const major = school.majors.find((m) => m.name.en === majorName)
    if (major) {
      return school.name.en
    }
  }
}
const findMajorIdByName = (majorName: string): string | undefined => {
  if (!props.schoolData) return undefined
  for (const school of props.schoolData) {
    const major = school.majors.find((m) => m.name.en === majorName)
    if (major) {
      return major.id
    }
  }
  return undefined
}
const uploadData = ref({
  users: [] as IUploadUser[],
})
const saveUser = () => {
  emit('save', uploadData.value)
  dialog.value = false
}
const close = () => {
  emit('close')
}
defineExpose({ openUpload })
</script>
