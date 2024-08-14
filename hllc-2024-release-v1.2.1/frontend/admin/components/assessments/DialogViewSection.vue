<script setup lang="ts">
import { ref } from 'vue'
const dialogViewSection = defineModel<boolean>({ default: false })
const dialogEditSection = ref(false)
const dialogConfirmSection = ref(false)

const { $api } = useNuxtApp()
const emit = defineEmits(['submit', 'snackbar'])
const openEditSection = (item: SectionModel) => {
  actions.value.title = 'Edit section details'
  actions.value.icon = 'mdi-pencil'
  actions.value.type = 'update'
  sectionDetails.value = JSON.parse(JSON.stringify(item))
  dialogEditSection.value = true
}

const openDeleteSection = (item: SectionModel) => {
  actions.value.type = 'delete'
  sectionDetails.value = JSON.parse(JSON.stringify(item))
  onDialogConfirmSection('Confirm delete section?', '../../icons/delete.png')
}

const onDialogConfirmSection = (title: string, image: string) => {
  dialogConfirmDetail.title = title
  dialogConfirmDetail.image = image
  dialogConfirmSection.value = true
}

const headerSections = ref<DataTable['headers']>([
  {
    title: 'Order',
    align: 'center',
    sortable: true,
    key: 'order',
  },
  {
    title: 'Title (TH)',
    align: 'start',
    sortable: true,
    key: 'title.th',
    width: '100rem',
  },
  {
    title: 'Title (EN)',
    align: 'start',
    sortable: true,
    key: 'title.en',
    width: '100rem',
  },
  {
    title: 'Details (TH)',
    align: 'start',
    sortable: true,
    key: 'details.th',
    width: '100rem',
  },
  {
    title: 'Details (EN)',
    align: 'start',
    sortable: true,
    key: 'details.en',
    width: '100rem',
  },
  {
    title: 'Actions',
    align: 'center',
    sortable: false,
    key: 'actions',
    width: '10',
  },
])

interface SectionModel {
  id: string
  title: {
    th: string
    en: string
  }
  details: {
    th: string
    en: string
  }
  order: number
}

const actions = ref({
  title: '',
  icon: '',
  type: 'create',
})

const sectionDetails = ref<SectionModel>({
  id: '',
  title: {
    th: '',
    en: '',
  },
  details: {
    th: '',
    en: '',
  },
  order: 0,
})

interface CreateDialogConfirm {
  image: string
  title: string
}
const dialogConfirmDetail = reactive<CreateDialogConfirm>({
  image: '',
  title: '',
})
const resetFormSection = () => {
  sectionDetails.value = {
    id: '',
    title: {
      th: '',
      en: '',
    },
    details: {
      th: '',
      en: '',
    },
    order: 0,
  }
}
const dialogCreateSection = ref(false)
const closeDialogSection = () => {
  switch (actions.value.type) {
    case 'create':
      resetFormSection()
      dialogCreateSection.value = false
      dialogViewSection.value = false
      break
    case 'update':
      resetFormSection()
      dialogCreateSection.value = false
      dialogViewSection.value = false
      break
    case 'delete':
      dialogCreateSection.value = false
      dialogViewSection.value = false
      break
    default:
      dialogViewSection.value = false
      break
  }
}
const closeDialogEditSection = () => {
  switch (actions.value.type) {
    case 'create':
      resetFormSection()
      dialogEditSection.value = false
      break
    case 'update':
      resetFormSection()
      dialogEditSection.value = false
      break
    case 'delete':
      dialogEditSection.value = false
      break
  }
}

const openDialogSectionConfirm = () => {
  switch (actions.value.type) {
    case 'create':
      onDialogConfirmSection(
        'Confirm section creation?',
        '../../icons/error.png'
      )
      break
    case 'update':
      onDialogConfirmSection(
        'Confirm editing of section?',
        '../../icons/error.png'
      )
      break
  }
}

const editSection = async (item: SectionModel) => {
  try {
    await $api.put(`/assessment-sections/${item.id}`, {
      body: {
        title: {
          th: sectionDetails.value.title.th,
          en: sectionDetails.value.title.en,
        },
        details: {
          th: sectionDetails.value.details.th,
          en: sectionDetails.value.details.en,
        },
        order: Number(sectionDetails.value.order),
      },
    })
    onSnackbar('update section successfully', 'success')
    fetchSections()
  } catch (error) {
    if (error.statusCode === 409) {
      onSnackbar('Section order is already have', 'error')
    } else {
      closeDialogSection()
      onSnackbar('Error creating section', 'error')
    }
  }
}
const snackbarNotify = reactive<CreateSnackbarNotify>({
  title: '',
  type: '',
})
interface CreateSnackbarNotify {
  title: string
  type: string
}
const onSnackbar = (title: string, type: string) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  if (title.value === 'Error creating section') {
    emit('snackbar', { title, type })
  }
  snackbar.value = true
}
const snackbar = ref(false)

const deleteSection = async (item: SectionModel) => {
  try {
    await $api.delete(`/assessment-sections/${item.id}`)
    onSnackbar('delete question successfully', 'success')
    fetchSections()
  } catch (error) {
    console.error(`Error : ${error}`)
  }
}

const sections = ref<SectionModel>()

const fetchSections = async () => {
  try {
    const response = await $api.get<{ data: SectionModel[] }>(
      '/assessment-sections'
    )
    sections.value = response.data
  } catch (error) {
    console.error('Error fetching sections:', error)
  }
}

onMounted(() => {
  fetchSections()
})

async function confirmActionSection() {
  switch (actions.value.type) {
    case 'update':
      await editSection(sectionDetails.value)
      dialogEditSection.value = false
      emit('submit')
      resetFormSection()
      break
    case 'delete':
      await deleteSection(sectionDetails.value)
      emit('submit')
      break
  }
}
</script>

<template>
  <v-dialog
    v-model="dialogViewSection"
    class="d-flex align-center justify-center"
    max-width="700px"
  >
    <v-card class="rounded-xl pa-4 text-center">
      <v-card-title>
        <span class="text-black font-weight-medium">Sections</span>
        <v-divider class="mt-2" />
      </v-card-title>
      <v-data-table :headers="headerSections" :items="sections">
        <template #[`item.actions`]="{ item }">
          <v-btn icon elevation="0" @click="openEditSection(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon elevation="0">
            <v-icon color="error" @click="openDeleteSection(item)">
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <template #no-data>
          <v-btn color="error" variant="outlined" readonly rounded-lg>
            No Section in here
          </v-btn>
        </template>
      </v-data-table>
      <v-card-action>
        <v-spacer />
        <v-btn
          class="text-center"
          rounded="lg"
          variant="flat"
          color="error"
          @click="closeDialogSection()"
        >
          Cancel
        </v-btn>
        <v-spacer />
      </v-card-action>
    </v-card>

    <v-dialog v-model="dialogEditSection" persistent max-width="600px">
      <v-card class="rounded-xl pa-4" elevation="5">
        <v-card-title>
          <span class="text-black font-weight-medium">{{ actions.title }}</span>
          <v-divider class="mt-2 mb-2" />
        </v-card-title>
        <v-card-text class="py-0">
          <v-text-field
            v-model="sectionDetails.order"
            type="number"
            label="Order"
            variant="outlined"
            rounded
          />
          <v-textarea
            v-model="sectionDetails.title.th"
            rows="1"
            label="Title Thai"
            variant="outlined"
            rounded
          />
          <v-textarea
            v-model="sectionDetails.title.en"
            rows="1"
            label="Title English"
            variant="outlined"
            rounded
          />
          <v-textarea
            v-model="sectionDetails.details.th"
            label="Detail Thai"
            variant="outlined"
            rounded
          />
          <v-textarea
            v-model="sectionDetails.details.en"
            label="Detail English"
            variant="outlined"
            rounded
          />
        </v-card-text>
        <v-card-actions class="d-flex justify-center py-0 mt-3">
          <v-btn
            rounded="xl"
            variant="text"
            color="error"
            @click="closeDialogEditSection()"
          >
            Cancel
          </v-btn>
          <v-btn
            rounded="lg"
            variant="flat"
            color="black"
            @click="openDialogSectionConfirm()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <DialogConfirm
      v-model="dialogConfirmSection"
      :image="dialogConfirmDetail.image"
      :title="dialogConfirmDetail.title"
      @submit="confirmActionSection()"
    />

    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
  </v-dialog>
</template>
