<template>
  <FormDialog
    v-model="dialog"
    icon="mdi-account-plus-outline"
    max-width="40rem"
    header="Add User detail"
    sub-header="Enter User Information"
    persistent
  >
    <template #content>
      <v-form ref="formRef" class="py-2">
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
              :rules="[(v:any) => !!v || 'Student ID is required']"
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
              :rules="[(v:any) => !!v || 'Firstname is required']"
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
              :rules="[(v:any) => !!v || 'Lastname is required']"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="form.school"
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
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.round"
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
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #actions>
      <div class="d-flex justify-center">
        <v-btn variant="text" rounded @click="closeDialog">Cancel</v-btn>
        <v-btn
          variant="flat"
          rounded
          color="primary"
          :disabled="!isFormValid"
          @click="saveUser"
        >
          Confirm
        </v-btn>
      </div>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components'

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
const schools = ref(props.schoolData || [])

const form = ref({
  username: '',
  name: { first: '', last: '' },
  major: '',
  school: '',
  type: 'NORMAL',
  round: 'NORMAL',
})
const majors = computed(() => {
  const school = schools.value.find((s) => s.name.en === form.value.school)
  return school ? school.majors : []
})

const types = [
  { text: 'Normal', value: 'NORMAL' },
  { text: 'Tester', value: 'TESTER' },
  { text: 'Other', value: 'OTHER' },
]

const rounds = [
  { text: 'Normal', value: 'NORMAL' },
  { text: 'Other', value: 'OTHER' },
]

const isFormValid = computed(() => {
  const { username, name, school, major, type, round } = form.value
  return (
    !!username &&
    !!name.first &&
    !!name.last &&
    !!school &&
    !!major &&
    !!type &&
    !!round
  )
})

const saveUser = () => {
  emit('save', form.value)
}

const closeDialog = () => {
  dialog.value = false
  formRef.value?.reset()
}

watch(
  () => props.schoolData,
  (newVal) => {
    schools.value = newVal || []
  },
  { immediate: true }
)

watch(
  () => props.selectedUser,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      form.value = {
        username: newVal[0].username,
        name: {
          first: newVal[0].name.first || '',
          last: newVal[0].name.last || '',
        },
        school: newVal[0].major?.school?.name?.en || '',
        major: newVal[0].major?.id || '',
        type: newVal[0].type || 'NORMAL',
        round: newVal[0].round || 'NORMAL',
      }
    }
  }
)

watch(
  () => form.value.school,
  (newVal) => {
    if (newVal === null) {
      form.value.major = ''
    }
  },
  {deep: true}
)
</script>
