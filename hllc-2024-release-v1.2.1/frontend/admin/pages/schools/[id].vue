<template>
  <v-container v-if="checkFetchData" fluid class="my-2">
    <v-row>
      <v-col col="12" md="8" class="main-content">
        <h1 class="mb-4">
          {{ SchoolWithMajorData.name.en }} ({{ SchoolWithMajorData.acronym }})
        </h1>
        <v-card class="border border-grey rounded-lg bg-white" variant="flat">
          <v-row class="ma-4">
            <v-carousel height="300" class="rounded-lg">
              <v-carousel-item
                v-for="(photo, index) in SchoolWithMajorData.photos"
                :key="index"
              >
                <v-img :src="photo || undefined" />
              </v-carousel-item>
            </v-carousel>
            <v-row class="py-4">
              <v-col cols="12" class="text-grey-darker-1">
                <div
                  class="border rounded-lg pa-2 d-flex ga-2 mb-4 align-end"
                  style="width: 100%"
                >
                  <p class="font-weight-bold h-full">Name</p>
                </div>
                <div cols="12" class="pl-2">
                  <p>ภาษาไทย: สำนักวิชา {{ SchoolWithMajorData.name.th }}</p>
                  <p>English: School of {{ SchoolWithMajorData.name.en }}</p>
                </div>
              </v-col>
              <v-col class="text-grey-darker-1">
                <div
                  class="border rounded-lg pa-2 d-flex ga-2 mb-4 align-end"
                  style="width: 100%"
                >
                  <p class="font-weight-bold h-full">Information</p>
                </div>
                <div class="pl-2">
                  <p class="mb-1 font-weight-bold">ภาษาไทย:</p>
                  <p style="text-indent: 40px; text-align: justify">
                    {{ SchoolWithMajorData.detail.th }}
                  </p>
                  <p class="mb-1 mt-2 font-weight-bold">English:</p>
                  <p style="text-indent: 40px; text-align: justify">
                    {{ SchoolWithMajorData.detail.en }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-row>
        </v-card>
      </v-col>
      <v-divider vertical />
      <v-col cols="12" md="4" class="sub-content">
        <v-row class="ml-2">
          <v-col cols="12" class="d-flex justify-space-between align-center">
            <div class="d-flex flex-column">
              <h2>All Majors</h2>
            </div>
            <v-btn
              class="text-none px-6 font-weight-bold rounded-pill"
              icon="mdi-plus"
              variant="elevated"
              color="black"
              size="large"
              @click="openMajorFormDialog()"
            />
          </v-col>
        </v-row>
        <v-row class="ml-2">
          <v-col
            v-for="major in SchoolWithMajorData.majors"
            :key="major.id"
            cols="12"
          >
            <ListCardTemplate
              :menu-items="menuItems(major.id)"
              @click="openMajorDetailDialog(major.id)"
            >
              <template #contents>
                <h3>Major of {{ major.name['en'] }} ({{ major.acronym }})</h3>
                <p>สาขาวิชา {{ major.name['th'] }}</p>
              </template>
            </ListCardTemplate>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="MajorFormDialog" max-width="800" persistent>
      <v-card rounded="lg" class="pa-2">
        <v-card-text>
          <v-form ref="form">
          <v-row dense>
            <v-col cols="12" class="d-flex justify-space-between w-100">
              <div
                class="border rounded-lg ml-2"
                style="width: 50px; height: 50px"
              >
                <v-icon v-if="selectedMajorId" class="pa-6 text-grey-darker-1"
                  >mdi-home-edit-outline</v-icon
                >
                <v-icon v-else class="pa-6 text-grey-darker-1"
                  >mdi-home-plus-outline</v-icon
                >
              </div>
              <v-icon
                class="pa-6 text-red"
                @click="closeDialog('MajorFormDialog')"
                >mdi-close</v-icon
              >
            </v-col>
            <v-row class="px-4">
              <v-col cols="12" class="my-4 mx-1">
                <h3 v-if="selectedMajorId">Edit Major detail</h3>
                <h3 v-else>Add Major detail</h3>
                <p class="font-weight-regular text-grey">
                  Enter Major Information
                </p>
              </v-col>
              <v-col cols="12" md="6" class="py-0 px-1">
                <v-text-field
                  v-model="Major.name.th"
                  density="compact"
                  hide-details="auto"
                  label="ชื่อสาขาวิชา (ภาษาไทย)"
                  variant="outlined"
                  :rules="[requiredRule]"
                  required
                  rounded
                  clearable
                  class="mb-1"
                />
              </v-col>
              <v-col cols="12" md="6" class="py-0 px-1">
                <v-text-field
                  v-model="Major.name.en"
                  density="compact"
                  hide-details="auto"
                  label="Major Name (English)"
                  variant="outlined"
                  :rules="[requiredRule]"
                  required
                  rounded
                  clearable
                  class="mb-1"
                />
              </v-col>
              <v-col cols="12" md="6" class="py-0 my-2 px-1">
                <v-text-field
                  v-model="Major.acronym"
                  density="compact"
                  hide-details="auto"
                  label="Major Acronym"
                  variant="outlined"
                  :rules="[requiredRule]"
                  required
                  rounded
                  clearable
                  class="mb-1"
                />
              </v-col>
              <v-col cols="12" class="py-0 px-1">
                <v-textarea
                  v-model="Major.detail.th"
                  class="mb-1"
                  rows="7"
                  hide-details="auto"
                  label="รายละเอียดสาขาวิชา (ภาษาไทย)"
                  variant="outlined"
                  :rules="[requiredRule]"
                  required
                  rounded
                  clearable
                />
              </v-col>
              <v-col cols="12" class="py-0 px-1 my-2">
                <v-textarea
                  v-model="Major.detail.en"
                  class="mb-1"
                  rows="7"
                  hide-details="auto"
                  label="Major Detail (English)"
                  variant="outlined"
                  :rules="[requiredRule]"
                  required
                  rounded
                  clearable
                />
              </v-col>
            </v-row>
          </v-row>
        </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn variant="text" rounded @click="closeDialog('MajorFormDialog')"
            >Cancel</v-btn
          >
          <v-btn
            variant="flat"
            rounded
            color="primary"
            class="mr-2"
            :disabled="!isFormValid"
            @click="
              selectedMajorId
                ? openDialog('editMajorDialog')
                : openDialog('createMajorDialog')
            "
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="MajorDetailDialog" max-width="800">
      <v-card class="rounded-lg text-left">
        <v-row class="ma-4">
          <v-col cols="12" class="d-flex w-100 ga-4 align-center">
            <div class="border rounded-lg" style="height: 50px">
              <v-icon class="pa-6 text-grey-darker-1">mdi-home-outline</v-icon>
            </div>
            <h2>Major {{ Major.name.en }}</h2>
            <v-spacer />
            <v-icon class="text-red" @click="closeDialog('MajorDetailDialog')"
              >mdi-close</v-icon
            >
          </v-col>
          <v-col cols="12" class="text-grey-darker-1">
            <div
              class="border rounded-lg pa-2 d-flex ga-2 mb-4 align-end"
              style="width: 100%"
            >
              <p class="font-weight-bold h-full">Name</p>
            </div>
            <div cols="12" class="pl-2">
              <p>
                <span class="font-weight-bold">ภาษาไทย:</span> สำนักวิชา
                {{ Major.name.th }}
              </p>
              <p>
                <span class="font-weight-bold">English:</span> School of
                {{ Major.name.en }}
              </p>
            </div>
          </v-col>
          <v-col class="text-grey-darker-1">
            <div
              class="border rounded-lg pa-2 d-flex ga-2 mb-4 align-end"
              style="width: 100%"
            >
              <p class="font-weight-bold h-full">Information</p>
            </div>
            <div class="pl-2">
              <div class="d-flex flex-column">
                <p class="mb-1 font-weight-bold">ภาษาไทย:</p>
                <p style="text-indent: 40px; text-align: justify">
                  {{ Major.detail.th }}
                </p>
              </div>
              <p class="mb-1 mt-2 font-weight-bold">English:</p>
              <p style="text-indent: 40px; text-align: justify">
                {{ Major.detail.en }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />

    <DialogConfirm
      v-model="deleteMajorDialog"
      image="../../icons/delete.png"
      title="Do you want to delete this major?"
      @submit="deleteMajor(selectedMajorId)"
    />
    <DialogConfirm
      v-model="editMajorDialog"
      image="../../icons/question-mark.png"
      title="Do you want to edit major?"
      @submit="saveMajor(selectedMajorId)"
    />
    <DialogConfirm
      v-model="createMajorDialog"
      image="../../icons/question-mark.png"
      title="Do you want to create new major?"
      @submit="saveMajor()"
    />
  </v-container>
  <v-container v-else class="d-flex justify-center align-center">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components'
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/schools', title: 'All Schools' },
    { to: '', title: 'School' },
  ],
})

const SchoolId = useRoute().params.id
const { $api } = useNuxtApp()
const selectedMajorId = ref('')
const MajorFormDialog = ref(false)
const deleteMajorDialog = ref(false)
const editMajorDialog = ref(false)
const createMajorDialog = ref(false)
const MajorDetailDialog = ref(false)
const checkFetchData = ref(false)
const form = ref<VForm | null>(null)

const menuItems = (majorId: string) => [
  {
    title: 'More Detail',
    icon: 'mdi-eye',
    click: () => {
      openMajorDetailDialog(majorId)
    },
  },
  {
    title: 'Edit',
    icon: 'mdi-pencil',
    click: () => {
      fetchMajorById(majorId)
      selectedMajorId.value = majorId
      MajorFormDialog.value = true
    },
  },
  {
    title: 'Delete',
    icon: 'mdi-delete',
    click: () => {
      selectedMajorId.value = majorId
      deleteMajorDialog.value = true
    },
  },
]
interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
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
  color: {
    primary: string
    secondary: string
    accent: string
  }
  photos: {
    first?: string | null
    second?: string | null
    third?: string | null
    fourth?: string | null
  }
  majors: IMajor[]
}
// *Dialog* //

// <-- *SnackBar* --> //

// *SnackBar* //
const snackbar = ref(false)
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

const SnackbarTemplate: ISnackbarTemplates = {
  success: `Successfully`,
  error: `Oops! Something went wrong. We couldn't complete your request at this time. Please try again later. If the problem persists, please contact our support team for assistance.`,
}

const onSnackbar = (title: string, type: keyof ISnackbarTemplates) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  snackbar.value = true
}
// <-- *SnackBar* --> //

// *Major* //
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
  school: string
}
const initialData: { major: IMajor; schoolWithMajorData: ISchool } = {
  major: {
    id: '',
    name: {
      th: '',
      en: '',
    },
    acronym: '',
    detail: {
      th: '',
      en: '',
    },
    school: '',
  },
  schoolWithMajorData: {
    id: '',
    name: {
      th: '',
      en: '',
    },
    acronym: '',
    detail: {
      th: '',
      en: '',
    },
    color: {
      primary: '',
      secondary: '',
      accent: '',
    },
    photos: {
      first: undefined,
      second: undefined,
      third: undefined,
      fourth: undefined,
    },
    majors: [],
  },
}

const Major = ref<IMajor>({ ...initialData.major })
// <-- *Major* --> //

const resetMajorForm = () => {
  form.value?.reset()
}

const SchoolWithMajorData = ref<ISchool>({ ...initialData.schoolWithMajorData })

const openMajorFormDialog = () => {
  MajorFormDialog.value = true
}

// Function for close dialog
const dialogs = {
  MajorFormDialog,
  deleteMajorDialog,
  MajorDetailDialog,
  editMajorDialog,
  createMajorDialog,
}

const closeDialog = (dialogName: keyof typeof dialogs) => {
  resetMajorForm()
  dialogs[dialogName].value = false
  refreshData()
}

const openDialog = (dialogName: keyof typeof dialogs) => {
  dialogs[dialogName].value = true
}

const openMajorDetailDialog = (majorId: string) => {
  fetchMajorById(majorId)
  selectedMajorId.value = majorId
  MajorDetailDialog.value = true
}

const fetchMajorById = async (majorId: string) => {
  try {
    const response = await $api.get<ApiResponse<IMajor>>(`majors/${majorId}`)
    Major.value = response.data
  } catch (error) {
    onSnackbar(SnackbarTemplate.error, 'error')
  }
}

const saveMajor = async (majorId?: string) => {
  try {
    Major.value.school = SchoolWithMajorData.value.id
    if (majorId) {
      const response = await $api.put<ApiResponse<IMajor>>(
        `majors/${majorId}`,
        { body: Major.value }
      )
      onSnackbar(`${response.data.name.en} updated successfully`, 'success')
    } else {
      await $api.post<ApiResponse<IMajor>>(`majors`, { body: Major.value })
      onSnackbar(`Created major successfully`, 'success')
    }

    closeDialog('MajorFormDialog')
  } catch (error) {
    onSnackbar(SnackbarTemplate.error, 'error')
  }
}

const deleteMajor = async (majorId: string) => {
  try {
    const response = await $api.delete<ApiResponse<IMajor>>(`majors/${majorId}`)
    closeDialog('deleteMajorDialog')
    onSnackbar(`${response.data.name.en} deleted successfully`, 'success')
  } catch (error) {
    onSnackbar(SnackbarTemplate.error, 'error')
  }
}

// <----- Helper Function -----> //
async function refreshData() {
  try {
    const response = await $api.get<ApiResponse<ISchool>>(
      `/schools/${SchoolId}`,
      { params: { includes: ['majors'] } }
    )
    if (response.statusCode === 200) {
      SchoolWithMajorData.value = response.data
      checkFetchData.value = true
    } else {
      onSnackbar(SnackbarTemplate.error, 'error')
    }
  } catch (error) {
    onSnackbar(SnackbarTemplate.error, 'error')
  }
  await clearFormData()
}

async function clearFormData() {
  Major.value = { ...initialData.major }
  selectedMajorId.value = ''
}

const requiredRule = (v: string) => !!v || 'This field is required'

const isFormValid = computed(() => {
  return [
    Major.value.name.th,
    Major.value.name.en,
    Major.value.acronym,
    Major.value.detail.th,
    Major.value.detail.en,
  ].every((field) => !!field)
})

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.main-content,
.sub-content {
  height: calc(100vh - 175px);
  overflow-y: scroll;
}

.main-content::-webkit-scrollbar,
.sub-content::-webkit-scrollbar {
  width: 8px;
}
</style>
