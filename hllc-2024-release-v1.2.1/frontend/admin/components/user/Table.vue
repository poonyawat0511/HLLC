<template>
  <TableTemplate
    :headers="Template.headers"
    :items="formattedUserData"
    :group-by="Template.groupBy"
    @select-watcher="handleSelected"
  >
    <template #header-actions-left>
      <v-btn-group rounded="pill" compact density="comfortable">
        <v-btn variant="tonal" color="success" :style="{ width: '50%' }">
          <v-icon>mdi-plus</v-icon>
          <span>Add</span>
          <v-menu activator="parent" content-class="rounded-xl">
            <v-list>
              <v-list-item @click="createUser()">
                <v-list-item-title>
                  <v-icon>mdi-plus</v-icon>
                  Add one
                </v-list-item-title>
              </v-list-item>
              <!-- Import User Button List -->
              <v-list-item @click="uploadUsers()">
                <v-list-item-title>
                  <v-icon>mdi-import</v-icon>
                  Import .xlsx file
                </v-list-item-title>
              </v-list-item>
              <UserHeaderToExcel />
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn
          variant="tonal"
          color="error"
          :style="{ width: '50%' }"
          :disabled="selectedUserIds.length === 0"
          @click="deleteUser(selectedUserIds)"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
          <span>Delete</span>
        </v-btn>
      </v-btn-group>
    </template>
    <template #actions="{ item }">
      <VerticalMenu :items="getActions(item)" />
    </template>
  </TableTemplate>
</template>

<script setup lang="ts">
const selectedUserIds = ref<string[]>([])

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

interface IUserInfo {
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
  userdata: IUserInfo[]
}>()

const Template = reactive({
  headers: [
    { title: 'Student ID', align: 'start', value: 'username' },
    { title: 'Name', align: 'start', value: 'fullName' },
    { title: 'School', align: 'start', value: 'schoolName' },
    { title: 'Major', align: 'start', value: 'majorName' },
    { title: 'Type', align: 'start', value: 'type' },
    { title: 'Round', align: 'start', value: 'round' },
    { title: 'Actions', align: 'start', value: 'actions' },
  ],
  groupBy: [
    {
      key: 'schoolName',
    },
  ],
})

const formattedUserData = computed(() =>
  props.userdata.map((user) => ({
    ...user,
    fullName: `${user.name.first} ${user.name.last}`,
    schoolName: user.major.school.name.en,
    majorName: user.major.name.en,
  }))
)

const handleSelected = (selectedItems: string[]) => {
  selectedUserIds.value = selectedItems
}

function getActions(item: IUserInfo) {
  return [
    {
      icon: 'mdi-pencil',
      title: 'Edit',
      // click: () => {},
      click: () => {emits('edit', item.id)},
    },
    {
      icon: 'mdi-delete',
      title: 'Delete',
      //   click: () => {},
      click: () => {
        emits('delete', item.id)
      },
    },
  ]
}

const emits = defineEmits(['delete', 'create', 'upload', 'edit'])
const deleteUser = (Userid: string | string[]) => {
  emits('delete', Userid)
}
const createUser = () => {
  emits('create')
}
const uploadUsers = () => {
  emits('upload')
}
</script>
