<script setup lang="ts">
// data table
import type { VDataTable } from 'vuetify/components'
import type { AssessmentType } from '~/modules/assessment/components/AssessmentDialog.vue'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/assessments', title: 'Assessments' },
    { to: '/assessments/systems', title: 'Pretest & Posttest Questions' },
  ],
})

type DataTable = InstanceType<typeof VDataTable>['$props']
const snackbar = inject<Snackbar>('snackbar')!
const headers = ref<DataTable['headers']>([
  {
    title: 'Question Thai',
    align: 'start',
    sortable: true,
    key: 'question.th',
    width: '100rem',
  },
  {
    title: 'Question English',
    align: 'start',
    sortable: true,
    key: 'question.en',
    width: '100rem',
  },
  {
    title: 'Status',
    align: 'start',
    sortable: false,
    key: 'status',
    width: '100rem',
  },
  {
    title: 'Assessment Type',
    align: 'center',
    sortable: false,
    key: 'type',
    width: '10',
  },
  {
    title: 'Required',
    align: 'center',
    sortable: false,
    key: 'required',
    width: '10',
  },
  {
    title: 'Actions',
    align: 'center',
    sortable: false,
    key: 'actions',
    width: '10',
  },
])

// use assessment
const {
  assessments,
  fetchAssessment,
  fetchActivity,
  create,
  edit,
  deleteAssessment,
} = useAssessment()
onMounted(async () => {
  await fetchAssessment()
  await fetchActivity()
})

// set style
function wrapHeight(lines: number = 1): string {
  return `${lines * 1.5}rem`
}
function wrapStyle(lines: number = 1): Record<string, string | number> {
  return {
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    'white-space': 'normal',
    '-webkit-line-clamp': lines,
  }
}

//dialog
interface DialogReactive {
  value: boolean
  type?: AssessmentType
  action?: (type: AssessmentType, item: Assessment) => void
}
const dialog = reactive<DialogReactive>({ value: false, type: 'update' })
const dialogDelete = reactive<{ value: boolean; item?: Assessment }>({
  value: false,
})
const sectionDialog = ref(false)
const sectionDeleteDialog = ref(false)

const selectedAssessment = ref<Assessment | null>(null)

const openDialog = (type: AssessmentType, item?: Assessment) => {
  dialog.type = type
  if (item) {
    selectedAssessment.value = item
  } else {
    selectedAssessment.value = null
  }
  dialog.value = true
}

async function onConfirm(type: AssessmentType, item: Assessment) {
  if (type === 'update') {
    await edit(item)
    snackbar.open('updated assessment successfully', 'success')
    dialog.value = false
  } else if (type === 'delete') {
    await deleteAssessment(item)
    snackbar.open('delete assessment successfully', 'success')
    dialogDelete.value = false
  } else {
    await create(item)
    snackbar.open('Created assessment successfully', 'success')
    dialog.value = false
  }
}

const openDelete = (item: Assessment) => {
  dialogDelete.item = item
  dialogDelete.value = true
}
const groupBy = ref([
  {
    key: 'section.id',
    order: 'asc',
  },
])
const selectedStatus = ref<string | null>('ALL')
const statusOptions = ref(['PRETEST', 'POSTTEST', 'ALL'])
const filteredAssessments = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return assessments.value.filter((a) =>
      ['PRETEST', 'POSTTEST'].includes(a.status)
    )
  } else if (selectedStatus.value) {
    return assessments.value.filter((a) => a.status === selectedStatus.value)
  }
  return assessments.value
})
const { $api } = useApi()
const savesection = async (data: AssessmentSection) => {
  try {
    const response = $api.post<ApiResponse<AssessmentSection>>(
      'assessment-sections',
      { body: data }
    )
    if ((await response).statusCode == 201) {
      alert('Successfully created section')
    } else {
      throw new Error()
    }
  } catch (error) {
    alert(error)
  }
}
// Manage More Contained Question After Delete Section
const deleteSection = async (id: string) => {
  try {
    const response = $api.delete<ApiResponse<AssessmentSection>>(
      `assessment-sections/${id}`
    )
    console.log((await response).statusCode)
  } catch (error) {
    console.error(error)
  }
}

export interface AssessmentSection {
  id: string
  title: {
    th: string
    en: string
  }
  subtitle: {
    th: string
    en: string
  }
  order: number
}

const sectiondata = ref<AssessmentSection[]>()
const sectionTitles = ref<Map<string, string>>(new Map())
const fetchsection = async () => {
  const response = $api.get<ApiResponse<AssessmentSection[]>>(
    'assessment-sections'
  )
  sectiondata.value = (await response).data
  sectionTitles.value = new Map(
    sectiondata.value.map((section) => [section.id, section.title.en])
  )
}
function getGroupName(sectionId: string): string {
  return sectionTitles.value.get(sectionId) || sectionId
}

const selectedSectionId = ref('')
const selectedSection = computed(() => {
  if (sectiondata.value) {
    return sectiondata.value.find(
      (section) => section.id === selectedSectionId.value
    )
  }
  return null
})

const sectionItems = (item: string) => [
  {
    icon: 'mdi-pencil',
    title: 'Edit',
    click: () => {
      selectedSectionId.value = item
      sectionDialog.value = true
    },
  },
  {
    icon: 'mdi-delete',
    title: 'Delete',
    click: () => {
      selectedSectionId.value = item
      sectionDeleteDialog.value = true
    },
  },
]

watch(selectedStatus, async () => {
  if (selectedStatus.value === 'All') {
    await fetchAssessment(true)
  } else {
    await fetchAssessment(true)
  }
})
onMounted(() => {
  fetchsection()
})
</script>
<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="6" sm="6">
        <h1>Assessment</h1>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end align-center ga-2">
        <!-- Filter item Pretest & Posttest -->
        <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          variant="outlined"
          label="Filter by Status"
          density="compact"
          rounded
          hide-details
        />
        <v-btn
          variant="elevated"
          prepend-icon="mdi-plus"
          color="black"
          class="mx-1"
          @click="sectionDialog = true"
        >
          Section
        </v-btn>
        <v-btn
          variant="elevated"
          prepend-icon="mdi-plus"
          color="black"
          class="mx-1"
          @click="openDialog('post')"
        >
          Assessment
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="pa-4 mt-2" border rounded="lg" elevation="0">
      <v-data-table
        :headers="headers"
        :items="filteredAssessments"
        :group-by="groupBy"
      >
        <template #group-header="{ item, columns, toggleGroup, isGroupOpen }">
          <tr class="group-header">
            <td :colspan="columns.length">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <v-btn
                    :icon="isGroupOpen(item) ? '$expand' : '$next'"
                    size="small"
                    variant="text"
                    text="item"
                    @click="toggleGroup(item)"
                  />
                  <span class="ml-2">{{ getGroupName(item.value) }}</span>
                </div>
                <vertical-menu :items="sectionItems(item.value)" />
              </div>
            </td>
          </tr>
        </template>
        <template #[`item.question.th`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(2)">
            <td
              :style="{ ...wrapStyle(2), 'word-wrap': 'break-word' }"
              width="200px"
            >
              {{ item.question.th }}
            </td>
          </v-responsive>
        </template>
        <template #[`item.question.en`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(2)">
            <td
              :style="{ ...wrapStyle(2), 'word-wrap': 'break-word' }"
              width="200px"
            >
              {{ item.question.en }}
            </td>
          </v-responsive>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            icon
            color="primary"
            variant="flat"
            class="rounded-xl mx-2 my-2"
            @click="openDialog('update', item)"
            ><v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            variant="flat"
            class="rounded-xl my-2"
            @click="openDelete(item)"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </template>
      </v-data-table>
    </v-card>
    <assessment-dialog
      v-model="dialog.value"
      :type="dialog.type"
      :item="selectedAssessment"
      :section-data="sectiondata"
      @confirm="onConfirm"
    />
    <assessment-delete
      v-model="dialogDelete.value"
      :item="dialogDelete.item"
      @confirm="onConfirm"
    />
    <assessment-section-dialog
      v-model="sectionDialog"
      :data="selectedSection"
      @save="savesection"
    />
    <assessment-section-delete
      :id="selectedSectionId"
      v-model="sectionDeleteDialog"
      @submit="deleteSection"
    />
  </v-container>
</template>
<style scoped></style>
