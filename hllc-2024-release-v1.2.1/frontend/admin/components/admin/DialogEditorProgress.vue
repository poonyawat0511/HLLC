<script setup lang="ts">
const { $api } = useNuxtApp()

const dialog = defineModel<boolean>({ default: false })
const emit = defineEmits(['submit'])
const props = defineProps<{
  actData:
    | Record<
        string,
        | string
        | {
            value: string
            checkInId: string
          }
      >
    | undefined
  dynamicHeaders: DynamicHeader[]
  studentId: StudentModel
  staff: StaffModel
}>()

interface StaffModel {
  id: string
}

interface StudentModel {
  id: string
  username: string
}

interface DynamicHeader {
  title: string
  key: string
}

interface editCheckInInputModel {
  student: string
  activity: string
  title: string
  value: string
  checkInId: string
}

interface deleteCheckInInputModel {
  student: string
  activity: string
  title: string
  value: string
  checkInId: string
}

const mapData = computed(() => {
  return props.dynamicHeaders.map((header) => {
    const item = props.actData ? props.actData[header.key] : undefined

    // Check if item is an object with 'value' and 'checkInId' properties
    const value = typeof item === 'object' ? item.value : ''
    const checkInId = typeof item === 'object' ? item.checkInId : ''

    return {
      student: props.studentId.username,
      title: header.title,
      activity: header.key,
      value: value,
      checkInId: checkInId,
    } as editCheckInInputModel
  })
})

const dialogConfirm = ref(false)
const checkInData = ref<editCheckInInputModel | deleteCheckInInputModel>()
const dialogTitle = ref('')
const actionType = ref<'edit' | 'delete'>('edit') // Track action type

const editCheckIn = (item: editCheckInInputModel) => {
  checkInData.value = item
  dialogTitle.value = `Do you want to check in ${item.title} ?`
  actionType.value = 'edit'
  dialogConfirm.value = true
}

const deleteCheckIn = (item: deleteCheckInInputModel) => {
  checkInData.value = item
  dialogTitle.value = `Do you want to uncheck in ${item.title} ?`
  actionType.value = 'delete'
  dialogConfirm.value = true
}

const onConfirm = async () => {
  if (actionType.value === 'edit') {
    if (checkInData.value?.student && checkInData.value?.activity) {
      await $api.post('/check-ins', {
        body: {
          user: props.studentId.id,
          staff: props.staff.id,
          activity: checkInData.value.activity,
        },
      })
    } else {
      console.error('Missing student or activity data')
    }
  } else if (actionType.value === 'delete') {
    // Handle uncheck-in logic

    if (checkInData.value?.checkInId) {
      await $api.delete(`/check-ins/${checkInData.value.checkInId}`)
    } else {
      console.error('Missing activity data')
    }
  }
  emit('submit')
  dialogConfirm.value = false
  dialog.value = false
}
</script>

<template>
  <div>
    <v-row align="center" justify="center" class="fill-height">
      <v-dialog v-model="dialog" persistent max-width="600px" rounded="lg">
        <v-card>
          <v-card-title>Edit Progress student</v-card-title>
          <v-divider class="mb-3" />
          <v-card-text>
            <div v-for="item in mapData" :key="item.title">
              <span v-if="item.title !== 'Actions'">
                {{ item.title }}:
                <template v-if="item.title === 'Student ID'">
                  {{ props.studentId.username }}
                </template>
                <template v-else>
                  {{ item.value }}
                </template>
              </span>
              <v-btn
                v-if="item.title !== 'Actions' && item.title !== 'Student ID'"
                variant="text"
              >
                <v-icon>mdi-dots-vertical</v-icon>
                <v-menu
                  activator="parent"
                  location="bottom end"
                  transition="fade-transition"
                >
                  <v-list dense min-width="250" rounded="lg" slim>
                    <v-list-item @click="editCheckIn(item)">
                      <v-list-item-title>Check in</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteCheckIn(item)">
                      <v-list-item-title>Uncheck in</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn class="text-error" @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Confirm dialog -->
    <v-dialog v-model="dialogConfirm" persistent max-width="600px">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-divider class="mb-3" />
        <v-card-actions>
          <v-btn class="text-error" @click="dialogConfirm = false"
            >Cancel</v-btn
          >
          <v-btn class="text-black" @click="onConfirm">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
