<template>
  <FormDialog
    v-model="dialog"
    icon="mdi-account-remove-outline"
    max-width="1200px"
    header="Delete User"
    sub-header="List of users for deletion."
  >
    <template #content>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded
        hide-details="auto"
        density="compact"
        single-line
        max-width="300"
        class="pb-2"
      />
      <div class="border rounded-lg">
        <v-data-table
          :headers="TableData.headers"
          :items="props.selectedUser"
          :search="search"
          item-value="id"
          height="auto"
        />
      </div>
      <v-col class="d-flex justify-center">
        <v-btn variant="text" rounded @click="cancle">Cancel</v-btn>
        <v-btn variant="flat" rounded color="primary" @click="deleteUser">Confirm</v-btn>
      </v-col>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
interface Major {
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
  major: Major
  type: string
  round: string
  fullName: string
}

const props = defineProps<{
  selectedUser: IUser[]
}>()

const dialog = defineModel<boolean>({ default: false })
const search = ref('')

const TableData = reactive({
  headers: [
    { title: 'Student ID', align: 'start', value: 'username' },
    { title: 'Name', align: 'start', value: 'fullName' },
    { title: 'School', align: 'start', value: 'major.school.name.en' },
    { title: 'Major', align: 'start', value: 'major.name.en' },
  ],
})
const emit = defineEmits(['delete','cancle'])
const deleteUser = () => {
  emit('delete')
}
const cancle = () => {
  emit('cancle')
}
</script>
