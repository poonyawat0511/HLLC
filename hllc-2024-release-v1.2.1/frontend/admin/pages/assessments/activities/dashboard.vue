<script setup lang="ts">
import * as XLSX from 'xlsx'
import type { VDataTable, VListItem } from 'vuetify/components'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/assessments', title: 'Activity Assessments' },
    { to: '/assessments/activities/dashboard', title: 'Dashboard' },
  ],
})

type UserType = 'NORMAL' | 'OTHER' | 'TESTER'
interface Major {
  id: string
  name: { th: string; en: string }
  school: {
    id: string
    name: { th: string; en: string }
  }
}
interface User {
  id: string
  username: string
  name: { first: string; last: string }
  fullName: string
  major: Major
  type: UserType
  round: 'NORMAL' | 'OTHER'
  progress: number
}
type UserSummary = User & {
  [k: string]: { assessment: boolean } & {
    [K: string]: string | number | null | undefined
  }
}
type TabelHeader = {
  title: string
  value: string
  average?: number
}
type ActivityWithHeaders = Activity & { headers: TabelHeader[] }
type SchoolWithMajor = SchoolEntity & { majors: MajorEntity[] }

const { $api } = useApi()
const loading = ref(false)
const search = ref('')
const schools = ref<SchoolWithMajor[]>([])
const activities = ref<ActivityWithHeaders[]>([])
const users = ref<UserSummary[]>([])

const {
  filter: applyFilter,
  forward,
  components,
} = useFilter<UserSummary>([
  {
    key: 'activity',
    multiple: false,
    autoComplete: true,
    model: '',
    label: 'Activity',
    items() {
      return activities.value.map((activity) => ({
        title: activity.name.en,
        value: activity.id,
      }))
    },
    filter: () => true,
  },
  {
    key: 'type',
    multiple: true,
    model: ['NORMAL', 'OTHER'],
    label: 'User type',
    items: [
      { value: 'NORMAL', title: 'Freshmen' },
      { value: 'OTHER', title: 'Upperclassmen' },
      { value: 'TESTER', title: 'Tester' },
    ],
    filter(ctx, user) {
      const status = Array.from(ctx.value ?? {})
      if (!status.length) return true
      return status.includes(user.type)
    },
  },
  {
    key: 'school',
    multiple: false,
    autoComplete: true,
    model: '',
    label: 'School',
    items() {
      return schools.value.map((item) => ({
        title: item.name.en,
        value: item.id,
      }))
    },
    filter(ctx, user) {
      if (!ctx.value) return true
      return user.major.school.id === ctx.value
    },
  },
  {
    key: 'major',
    multiple: true,
    autoComplete: true,
    model: '',
    label: 'Major',
    items(ctx) {
      const schoolFilter = ctx.forward('school')
      const school = schools.value.find(
        (school) => school.id === schoolFilter?.model
      )
      if (!school) return []
      return school.majors.map((major) => ({
        title: major.name.en,
        value: major.id,
      }))
    },
    filter(ctx, user) {
      const majors = Array.from(ctx.value ?? {})
      if (!majors.length) return true
      return majors.includes(user.major.id)
    },
  },
])

watch(
  () => forward('school')!.model,
  () => {
    forward('major')!.model = undefined
  }
)

interface SummaryResponse {
  activities: ActivityWithHeaders[]
  values: UserSummary[]
}

async function fetchSummary() {
  const response = await $api.get<ApiResponse<SummaryResponse>>(
    '/dashboard/evaluations'
  )
  activities.value = response.data.activities
  users.value = response.data.values
}

async function fetchSchoolWithMajors() {
  const response = await $api.get<ApiResponse<SchoolWithMajor[]>>('/schools', {
    params: { includes: ['majors'] },
  })
  schools.value = response.data
}

async function init() {
  loading.value = true
  await fetchSchoolWithMajors()
  await fetchSummary()
  forward('activity')!.model = activities.value[0]?.id
  loading.value = false
}

const filterItems = computed(() => {
  return applyFilter(users.value)
})
const selectedActivity = computed(() => {
  const activityId = forward('activity')?.model
  if (!activityId) return
  return activities.value.find((activity) => activity.id === activityId)
})

const staticHeaders = [
  {
    title: 'Student ID',
    value: 'username',
    sortable: true,
  },
  {
    title: 'Name',
    value: 'fullName',
    sortable: true,
  },
  {
    title: 'School',
    value: 'major.school.name.en',
    sortable: true,
  },
  {
    title: 'Major',
    value: 'major.name.en',
    sortable: true,
  },
]

function getHeaders(activity: ActivityWithHeaders) {
  return [
    ...staticHeaders,
    { title: 'Submit', value: `${activity.id}.assessment` },
    ...activity.headers,
  ]
}

const headers = computed(() => {
  const activity = selectedActivity.value
  if (!activity) return staticHeaders
  return getHeaders(activity)
})

const average = computed(() => {
  const headers = [
    { title: 'Question', value: 'title' },
    { title: 'Average', value: 'average' },
  ]
  const activity = selectedActivity.value
  return { headers, items: activity?.headers ?? [] }
})

const statistics = computed(() => {
  const summary = [
    {
      title: 'All users',
      icon: 'mdi-account-group',
      color: 'primary',
      value: 0,
    },
    {
      title: 'Registered users',
      icon: 'mdi-account-key',
      color: 'secondary',
      value: 0,
    },
    {
      title: 'Submit Assessments',
      icon: 'mdi-file-document-check',
      color: 'success',
      value: 0,
    },
  ]
  if (!selectedActivity.value) return summary
  for (const user of filterItems.value) {
    summary[0].value++
    if (user.isLoggedIn) summary[1].value++
    if (user[selectedActivity.value.id!]?.assessment) {
      summary[2].value++
    }
  }
  return summary
})

function download(target: 'all' | 'current') {
  // Create workbooc
  const wb = XLSX.utils.book_new()

  // Prepare data
  if (target === 'current') {
    const data = filterItems.value
    const aoa = []
    aoa.push(headers.value.map((header) => header.title))
    aoa.push(
      ...data.map((value) =>
        headers.value.map((header) => getObjectValue(value, header.value))
      )
    )
    const ws = XLSX.utils.aoa_to_sheet(aoa)
    XLSX.utils.book_append_sheet(wb, ws, 'SUMMARY')
  }

  if (target === 'all') {
    for (const activity of activities.value) {
      const data = users.value
      const aoa = []
      const headers = getHeaders(activity)
      aoa.push(headers.map((header) => header.title))
      aoa.push(
        ...data.map((value) =>
          headers.map((header) => getObjectValue(value, header.value))
        )
      )
      const ws = XLSX.utils.aoa_to_sheet(aoa)
      XLSX.utils.book_append_sheet(wb, ws, activity.code.slice(0, 30))
    }
  }

  const date = new Date()
  XLSX.writeFileXLSX(
    wb,
    `HLLC_SUMMARY_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}.xlsx`
  )
}

const exportMenus: VListItem['$props'][] = [
  {
    title: 'Export All',
    prependIcon: 'mdi-content-save-all',
    onClick() {
      if (confirm('Are you sure you want to export all of the report')) {
        download('all')
      }
    },
  },
  {
    title: 'Export current filter',
    prependIcon: 'mdi-content-save',
    onClick() {
      if (confirm('Are you sure you want to export current filter report?')) {
        download('current')
      }
    },
  },
]

onMounted(() => {
  init()
})
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="8" class="d-flex align-center">
        <h1>Activity Dashboard</h1>
      </v-col>
      <v-col cols="12">
        <v-row dense>
          <v-col
            v-for="filter in components"
            :key="filter.key"
            cols="12"
            :md="filter.key === 'activity' ? 12 : 4"
          >
            <component :is="filter.component" v-bind="filter.props" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row dense>
          <v-col v-for="(summary, index) in statistics" :key="index">
            <v-list class="rounded-lg border">
              <v-list-item :title="summary.title" :subtitle="summary.value">
                <template #prepend>
                  <v-avatar :color="summary.color" tile class="rounded-lg">
                    <v-icon :icon="summary.icon" />
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-card
          variant="outlined"
          class="border"
          :loading="loading"
          rounded="lg"
        >
          <v-card-title class="d-flex align-center"> Summary </v-card-title>
          <v-divider />
          <v-data-table
            :headers="average.headers"
            :items="average.items"
            :items-per-page="-1"
            hide-default-footer
          >
            <template #[`item.average`]="{ value }">
              {{ value ?? 'non-numeric' }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
          variant="outlined"
          class="border"
          :loading="loading"
          rounded="lg"
        >
          <v-card-title class="d-flex align-center">
            Users
            <v-spacer />
            <v-menu>
              <template #activator="{ props }">
                <v-btn variant="outlined" v-bind="props">
                  <v-icon icon="mdi-upload" start /> Export
                  <v-icon icon="mdi-menu-down" end />
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(menu, i) in exportMenus"
                  :key="i"
                  v-bind="menu"
                />
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              placeholder="search"
              hide-details
            />
          </v-card-text>
          <v-divider />
          <v-data-table
            :search="search"
            :headers="headers"
            :items="filterItems"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
