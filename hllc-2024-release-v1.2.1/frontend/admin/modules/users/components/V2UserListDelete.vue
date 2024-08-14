<template>
  <FormDialog
    v-model="dialog"
    icon="mdi-account-remove-outline"
    max-width="1200px"
    header="Delete User"
    sub-header="List of users for deletion."
  >
    <template #content>
      <div class="w-100">
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
          class="pt-2"
        />
      </div>
      <TableTemplate
        :headers="TableData.headers"
        :items="users"
        item-value="id"
        height="auto"
        :search-bar="false"
        :show-select="false"
      >
        <template #actions="{ item }">
          <v-btn
            icon="mdi-trash-can"
            density="comfortable"
            variant="text"
            color="red-accent-2"
            @click="getActions(item)"
          />
        </template>
      </TableTemplate>
      <DialogConfirm
        v-model="confirmDialog"
        image="../../icons/delete.png"
        title="Do you want to delete this user?"
        @submit="deleteUser()"
      />
    </template>
    <template #actions>
      <div class="d-flex justify-center">
        <v-btn variant="text" rounded @click="cancle">Cancel</v-btn>
        <v-btn
          variant="flat"
          rounded
          color="primary"
          @click="confirmDialog = true"
          >Confirm</v-btn
        >
      </div>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
function getActions(item: IUser) {
  const index = users.value.findIndex(
    (user: { id: string }) => user.id === item.id
  )
  if (index !== -1) {
    users.value.splice(index, 1)
  }
}
const props = defineProps<{
  selectedUser: IUser[]
}>()

const dialog = defineModel<boolean>({ default: false })
const confirmDialog = ref(false)
const search = ref('')
const users = ref()
const TableData = reactive({
  headers: [
    { title: 'Student ID', align: 'start', value: 'username' },
    { title: 'Name', align: 'start', value: 'fullName' },
    { title: 'School', align: 'start', value: 'major.school.name.en' },
    { title: 'Major', align: 'start', value: 'major.name.en' },
    { title: '', align: 'start', value: 'actions' },
  ],
})
const emit = defineEmits(['delete', 'cancle'])
const deleteUser = () => {
  emit('delete', targetIds.value)
}
const cancle = () => {
  emit('cancle')
}
const firstTime = ref(false)
const targetIds = computed(() => {
  return users.value.map((user: { id: string }) => user.id)
})
watch(
  () => props.selectedUser,
  (newUsers) => {
    if (!firstTime.value) {
      users.value = newUsers
      firstTime.value = true
    }
  },
  { deep: true }
)
</script>
