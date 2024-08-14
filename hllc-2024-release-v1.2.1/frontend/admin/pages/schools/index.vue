<template>
  <v-container v-if="checkFetchData" fluid>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <h1>All Schools</h1>
        <v-btn
          class="text-none px-6 font-weight-bold rounded-pill"
          prepend-icon="mdi-plus"
          variant="elevated"
          color="black"
          size="large"
          @click="formHandler.openNewSchoolDialog()"
        >
          New School
        </v-btn>
      </v-col>
    </v-row>
    <!-- Card -->
    <v-row class="mt-0">
      <v-col v-for="school in schools" :key="school.id" cols="12" sm="6" md="3">
        <ListCardTemplate
          :menu-items="menuItems(school.id)"
          :photo="school.photos.fourth"
          @click="$router.push({ path: `/schools/${school.id}` })"
        >
          <template #contents>
            <h3>School of {{ school.name['en'] }} ({{ school.acronym }})</h3>
            <p>สำนักวิชา {{ school.name['th'] }}</p>
          </template>
          <template #actions>
            <v-row class="mt-6" align="center">
              <v-col>
                <p>Majors</p>
                <h1>{{ school.majors.length }}</h1>
              </v-col>
              <v-col cols="6">
                <v-btn
                  :disabled="loading"
                  :loading="loading"
                  class="text-none rounded-pill font-weight-bold"
                  color="primary"
                  variant="flat"
                  block
                  @click="loading = !loading"
                >
                  View
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </ListCardTemplate>
      </v-col>
    </v-row>

    <v-dialog v-model="schoolFormDialog" max-width="800" persistent>
      <v-card rounded="lg" class="pa-2">
        <v-form ref="form">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" class="d-flex justify-space-between w-100">
                <div
                  class="border rounded-lg ml-2"
                  style="width: 50px; height: 50px"
                >
                  <v-icon
                    v-if="selectedSchoolId"
                    class="pa-6 text-grey-darker-1"
                    >mdi-home-edit-outline</v-icon
                  >
                  <v-icon v-else class="pa-6 text-grey-darker-1"
                    >mdi-home-plus-outline</v-icon
                  >
                </div>
                <v-icon
                  class="pa-6 text-red"
                  @click="formHandler.resetFormDialog()"
                  >mdi-close</v-icon
                >
              </v-col>
              <v-col cols="12" md="6" class="px-2">
                <v-col cols="12" class="mb-2 mx-0">
                  <h3 v-if="selectedSchoolId">Edit school detail</h3>
                  <h3 v-else>Add school detail</h3>
                  <p class="font-weight-regular text-grey">
                    Enter School Information
                  </p>
                </v-col>
                <v-col
                  v-for="(field, index) in formFields.addSchool.TextFieldObject"
                  :key="index"
                  :cols="field.cols"
                  class="py-0 my-2 px-0"
                >
                  <v-text-field
                    v-model="
                      selectedSchool[field.model.parent][field.model.child]
                    "
                    density="compact"
                    hide-details="auto"
                    :label="field.label"
                    :rules="field.rules"
                    variant="outlined"
                    :required="field.required"
                    :autofocus="index === 0"
                    rounded
                    clearable
                    class="mb-1"
                  />
                </v-col>
                <v-col
                  v-for="(field, index) in formFields.addSchool.TextField"
                  :key="index"
                  :cols="field.cols"
                  class="py-0 my-2 px-0"
                >
                  <v-text-field
                    v-model="selectedSchool[field.model.parent]"
                    density="compact"
                    hide-details="auto"
                    :label="field.label"
                    :rules="field.rules"
                    variant="outlined"
                    :required="field.required"
                    rounded
                    clearable
                    class="mb-1"
                  />
                </v-col>
                <v-col
                  v-for="(field, index) in formFields.addSchool.TextArea"
                  :key="index"
                  :cols="field.cols"
                  class="py-0 my-2 px-0"
                >
                  <v-textarea
                    v-model="
                      selectedSchool[field.model.parent][field.model.child]
                    "
                    class="mb-1"
                    rows="7"
                    hide-details="auto"
                    :label="field.label"
                    :rules="field.rules"
                    variant="outlined"
                    :required="field.required"
                    rounded
                    clearable
                  />
                </v-col>
              </v-col>
              <v-col cols="12" md="6" class="px-2">
                <v-col cols="12" class="mb-2 mx-0 fill-height">
                  <h3>Avatars</h3>
                  <p class="font-weight-regular text-grey mb-4">
                    Upload Avartar Pictures
                  </p>
                  <div class="d-flex flex-column ga-4"><div>
                    <p>Step: 1</p>
                    <base-image-upload
                      v-model="selectedSchool.photos['first']"
                      class="border border-primary"
                      :aspect-ratio="16 / 9"
                    /></div><div>
                    <p>Step: 2</p>
                    <base-image-upload
                      v-model="selectedSchool.photos['second']"
                      class="border border-primary"
                      :aspect-ratio="16 / 9"
                    /></div><div>
                    <p>Step: 3</p>
                    <base-image-upload
                      v-model="selectedSchool.photos['third']"
                      class="border border-primary"
                      :aspect-ratio="16 / 9"
                    /></div><div>
                    <p>Step: 4</p>
                    <base-image-upload
                      v-model="selectedSchool.photos['fourth']"
                      class="border border-primary"
                      :aspect-ratio="16 / 9"
                    />
                  </div>
                </div>                </v-col>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn variant="text" rounded @click="formHandler.resetFormDialog()"
              >Cancel</v-btn
            >
            <v-btn
              variant="flat"
              rounded
              color="primary"
              class="mr-2"
              :disabled="!isFormValid"
              @click="
                selectedSchoolId
                  ? openDialog('editSchoolDialog')
                  : openDialog('createSchoolDialog')
              "
              >Confirm</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
    <DialogConfirm
      v-model="deleteSchoolDialog"
      image="../../icons/delete.png"
      title="Do you want to delete this school?"
      @submit="postDeleteSchool"
    />
    <DialogConfirm
      v-model="editSchoolDialog"
      image="../../icons/question-mark.png"
      title="Do you want to edit school?"
      @submit="saveSchool(selectedSchoolId)"
    />
    <DialogConfirm
      v-model="createSchoolDialog"
      image="../../icons/question-mark.png"
      title="Do you want to create new school?"
      @submit="saveSchool()"
    />
  </v-container>

  <v-container v-else class="d-flex justify-center align-center h-100" fluid>
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/schools', title: 'All Schools' },
  ],
})

// ---- FIRST TIME FETCHING DATA ----
// TODO: change to status
const loading = computed(() => false)
interface Major {}
type SchoolWithMajor = SchoolEntity & { majors: Major[] }

// ---- REF ----
const schoolFormDialog = ref(false)
const deleteSchoolDialog = ref(false)
const editSchoolDialog = ref(false)
const createSchoolDialog = ref(false)
const selectedSchoolId = ref('')
const snackbar = ref(false)
const form = ref<VForm | null>(null)
const checkFetchData = ref(false)
const schools = useState<SchoolWithMajor[]>('schools:major', () => [])

type InitialData = {
  school: SchoolEntity
  previews: SchoolEntity['photos']
  schoolWithMajorData: (SchoolEntity & { majors: Major[] })[]
}

const initialData: InitialData = {
  school: {
    id: '',
    name: { th: '', en: '' },
    acronym: '',
    detail: { th: '', en: '' },
    photos: {
      first: undefined,
      second: undefined,
      third: undefined,
      fourth: undefined,
    },
  },
  previews: {
    first: undefined,
    second: undefined,
    third: undefined,
    fourth: undefined,
  },
  schoolWithMajorData: [],
}
const selectedSchool = ref<SchoolEntity>({ ...initialData.school })
const imagePreviews = ref<SchoolEntity['photos']>({ ...initialData.previews })

const menuItems = (schoolId: string) => [
  {
    title: 'Edit',
    icon: 'mdi-pencil',
    click: () => formHandler.openEditSchoolDialog(schoolId),
  },
  {
    title: 'Delete',
    icon: 'mdi-delete',
    click: () => formHandler.openDeleteSchoolDialog(schoolId),
  },
]

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

// ---- CRUD API SECTION ----
const postDeleteSchool = async () => {
  try {
    const response = await $api.delete<ApiResponse<SchoolWithMajor>>(
      `schools/${selectedSchoolId.value}`
    )
    const index = schools.value.findIndex(
      (school) => school.id == selectedSchoolId.value
    )
    if (index !== 1) {
      schools.value.splice(index, 1)
    }
    onSnackbar(`${response.data.name.en} deleted successfully`, 'success')
  } catch (error) {
    onSnackbar(SnackbarTemplate.error, 'error')
  }
}
const saveSchool = async (schoolId?: string) => {
  try {
    const formData = objectToFormData(selectedSchool.value)
    for (const [key, value] of formData.entries()) {
      console.log(`FormData Key: ${key}, Value: ${value}`)
    }
    if (schoolId) {
      const response = await $api.put<ApiResponse<SchoolWithMajor>>(
        `schools/${schoolId}`,
        { body: formData, params: { includes: ['majors'] } }
      )
      const index = schools.value.findIndex(
        (school) => school.id == selectedSchoolId.value
      )
      if (index !== 1) {
        schools.value.splice(index, 1, response.data)
      }
      onSnackbar(`${response.data.name.en} updated successfully`, 'success')
    } else {
      const response = await $api.post<ApiResponse<SchoolWithMajor>>(
        'schools',
        { body: formData, params: { includes: ['majors'] } }
      )
      schools.value.push(response.data)
      fetchSchoolsData()
      onSnackbar(`Created major successfully`, 'success')
    }
    schoolFormDialog.value = false
  } catch (error) {
    console.log(error)

    onSnackbar(SnackbarTemplate.error, 'error')
  }
}

type NestedSchoolField<T extends keyof SchoolEntity> =
  SchoolEntity[T] extends Record<string, unknown>
    ? keyof SchoolEntity[T]
    : never

interface InputOption<T extends keyof SchoolEntity, U extends boolean> {
  model: U extends true
    ? NestedSchoolField<T> extends never
      ? {
          parent: T
        }
      : {
          parent: T
          child: NestedSchoolField<T>
        }
    : NestedSchoolField<T>
  label: string
  required: boolean
  cols?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  rules: [(v: unknown) => string | boolean]
}

interface FormField {
  addSchool: {
    TextFieldObject: InputOption<'name', true>[]
    TextField: InputOption<'acronym', true>[]
    TextArea: InputOption<'detail', true>[]
    Image: InputOption<'photos', false>[]
  }
}

// ---- OOP SECTION ----
const formFields: FormField = {
  addSchool: {
    TextFieldObject: [
      {
        model: { parent: 'name', child: 'th' },
        label: 'ชื่อสำนักวิชา(ภาษาไทย)',
        required: true,
        cols: 12,
        rules: [(v: unknown) => !!v || 'Text fields is required'],
      },
      {
        model: { parent: 'name', child: 'en' },
        label: 'School Name (English)',
        required: true,
        cols: 12,
        rules: [(v: unknown) => !!v || 'Text fields is required'],
      },
    ],
    TextField: [
      {
        model: { parent: 'acronym' },
        label: 'School Acronym',
        required: true,
        cols: 12,
        rules: [(v: unknown) => !!v || 'Text fields is required'],
      },
    ],
    TextArea: [
      {
        model: { parent: 'detail', child: 'th' },
        label: 'รายละเอียดสำนักวิชา (ภาษาไทย)',
        required: true,
        cols: 12,
        rules: [(v: unknown) => !!v || 'Text fields is required'],
      },
      {
        model: { parent: 'detail', child: 'en' },
        label: 'School Information (English)',
        required: true,
        cols: 12,
        rules: [(v: unknown) => !!v || 'Text fields is required'],
      },
    ],
    Image: [
      {
        model: 'first',
        label: 'Evolution Step:1',
        required: true,
        cols: 12,
        md: 6,
        rules: [(v: unknown) => !!v || 'Text fields is required'],
      },
      {
        model: 'second',
        label: 'Evolution Step:2',
        required: true,
        cols: 12,
        md: 6,
        rules: [(v: unknown) => !!v || 'Text fields is required'],
      },
      {
        model: 'third',
        label: 'Evolution Step:3',
        required: true,
        cols: 12,
        md: 6,
        rules: [(v: unknown) => !!v || 'Text fields is required'],
      },
      {
        model: 'fourth',
        label: 'Evolution Step:4',
        required: true,
        cols: 12,
        md: 6,
        rules: [(v: unknown) => !!v || 'Text fields is required'],
      },
    ],
  },
}

class FormHandler {
  private temp: Ref<unknown>
  constructor(
    private selectedSchoolId: Ref<string | null>,
    private school: Ref<unknown>,
    private schoolFormDialog: Ref<boolean>,
    private deleteSchoolDialog: Ref<boolean>
  ) {
    this.temp = ref(Object.assign({}, school.value))
  }

  openNewSchoolDialog() {
    this.selectedSchoolId.value = ''
    this.schoolFormDialog.value = true
  }

  openEditSchoolDialog(schoolId: string) {
    this.selectedSchoolId.value = schoolId
    this.school.value = schools.value.find((school) => school.id === schoolId)
    this.schoolFormDialog.value = true
  }

  openDeleteSchoolDialog(schoolId: string) {
    this.selectedSchoolId.value = schoolId
    this.deleteSchoolDialog.value = true
  }

  resetFormDialog() {
    this.school.value = this.temp.value
    form.value?.reset()
    imagePreviews.value = { ...initialData.previews }
    selectedSchool.value.photos = {}
    schoolFormDialog.value = false
  }
}

const formHandler = new FormHandler(
  selectedSchoolId,
  selectedSchool,
  schoolFormDialog,
  deleteSchoolDialog
)

const dialogs = {
  createSchoolDialog,
  editSchoolDialog,
  deleteSchoolDialog,
  schoolFormDialog,
}

const openDialog = (dialogName: keyof typeof dialogs) => {
  dialogs[dialogName].value = true
}

// ---- FUNCTION SECTION ----
const { $api } = useApi()
async function fetchSchoolsData() {
  checkFetchData.value = false
  try {
    const response = await $api.get<ApiResponse<SchoolWithMajor[]>>('schools', {
      params: { includes: ['majors'] },
    })
    schools.value = response.data
    checkFetchData.value = true
  } catch (error) {
    onSnackbar(SnackbarTemplate.error, 'error')
  }
}

const isFormValid = computed(() => {
  const textFieldObjectValid = formFields.addSchool.TextFieldObject.every(
    (field) => selectedSchool.value[field.model.parent][field.model.child]
  )
  const textFieldValid = formFields.addSchool.TextField.every(
    (field) => selectedSchool.value[field.model.parent]
  )
  const textAreaValid = formFields.addSchool.TextArea.every(
    (field) => selectedSchool.value[field.model.parent][field.model.child]
  )
  const imageValid = formFields.addSchool.Image.every(
    (field) => selectedSchool.value.photos[field.model]
  )
  return textFieldObjectValid && textFieldValid && textAreaValid && imageValid
})

onMounted(() => {
  fetchSchoolsData()
})
</script>

<style scoped>
.image-placeholder {
  width: 100%;
  height: 200px;
  border: 1px dashed #ccc;
  border-radius: 1rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #aaa;
}
</style>
