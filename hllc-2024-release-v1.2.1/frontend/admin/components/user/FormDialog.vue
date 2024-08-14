<template>
  <FormDialog
    v-model="dialog"
    icon="mdi-account-plus-outline"
    max-width="40rem"
    header="Add User detail"
    sub-header="Enter User Information"
  >
    <template #content>
      <v-form ref="formRef">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.username"
              label="Student ID"
              density="compact"
              hide-details="auto"
              variant="outlined"
              maxlength="10"
              rounded
              clearable
              :rules="[(v: any) => !!v || 'Student ID is required']"
              required
              autofocus
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.name.first"
              label="Firstname"
              density="compact"
              hide-details="auto"
              variant="outlined"
              hide-spin-buttons
              rounded
              clearable
              :rules="[(v: any) => !!v || 'Firstname is required']"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.name.last"
              label="Lastname"
              density="compact"
              hide-details="auto"
              variant="outlined"
              hide-spin-buttons
              rounded
              clearable
              :rules="[(v: any) => !!v || 'Lastname is required']"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="form.school"
              v-bind="textField"
              :items="schools"
              item-title="name.en"
              item-value="name.en"
              label="School name"
              placeholder="Student's School"
              density="compact"
              hide-details="auto"
              variant="outlined"
              rounded
              clearable
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="form.major"
              v-bind="textField"
              :items="majors"
              item-title="name.en"
              item-value="id"
              label="Major name"
              placeholder="Input student's major"
              density="compact"
              hide-details="auto"
              variant="outlined"
              rounded
              clearable
              required
              :disabled="!form.school"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.type"
              v-bind="textField"
              :items="types"
              item-title="text"
              item-value="value"
              label="Type"
              placeholder="User type"
              density="compact"
              hide-details="auto"
              variant="outlined"
              rounded
              clearable
              required
              class="py-2"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.round"
              v-bind="textField"
              :items="rounds"
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
            />
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn variant="text" rounded @click="closeDialog">Cancel</v-btn>
            <v-btn variant="flat" rounded color="primary" @click="saveUser"
              >Confirm</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components'
interface IUser {
  id: string
  name: { first: string; last: string }
  username: string
  major?: IMajor
  type: string
  round: string
  fullName: string
}

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

const emit = defineEmits(['save'])
const dialog = defineModel<boolean>({ default: false })
const props = defineProps<{
  userId?: string
  selectedUser?: IUser[]
  schoolData?: Array<{
    name: { en: string }
    majors: Array<{ id: string; name: { en: string } }>
  }>
}>()

const formRef = ref<VForm | null>(null)
const schools = ref(props.schoolData)
const majors = computed(() => {
  if (form.value.school) {
    const schoolName = form.value.school
    const school = schools.value?.find((s) => s.name.en === schoolName)
    return school ? school.majors : []
  }
  return []
})

const textField = {
  variant: 'outlined',
  persistentPlaceholder: true,
}

const types = [
  { text: 'Normal', value: 'NORMAL' },
  { text: 'Tester', value: 'TESTER' },
  { text: 'Other', value: 'OTHER' },
]

const rounds = [
  { text: 'Normal', value: 'NORMAL' },
  { text: 'Other', value: 'OTHER' },
]

const saveUser = () => {
  emit('save', form.value)
}

const form = ref({
  username: '',
  name: { first: '', last: '' },
  major: '',
  school: '',
  type: 'NORMAL',
  round: 'NORMAL',
})

const closeDialog = () => {
  dialog.value = false
}

watch(
  () => props.schoolData,
  (newVal) => {
    schools.value = newVal
  },
  { immediate: true }
)

watch(
  () => props.selectedUser,
  (newVal: IUser[] | undefined) => {
    if (newVal) {
      form.value.username = newVal[0].username || ''
      form.value.name.first = newVal[0].name.first || ''
      form.value.name.last = newVal[0].name.last || ''
      form.value.school = newVal[0].major?.school?.name?.en || ''
      form.value.major = newVal[0].major?.id || ''
      form.value.type = newVal[0].type || 'NORMAL'
      form.value.round = newVal[0].round || 'NORMAL'
    }
  },
)

watch(dialog, (newVal) => {
  if (newVal === false) {
    formRef.value?.reset()
  }
})
</script>
