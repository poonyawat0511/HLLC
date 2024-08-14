<script setup lang="ts">
import * as XLSX from 'xlsx'
import type { Reactive } from 'vue'
import type { VDataTable, VSelect, VListItem } from 'vuetify/components'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/dashboard', title: 'Dashboard' },
  ],
})

const { getColor } = useColors()
const { data: user } = useAuth()

interface ActivityProgress {
  id: string
  name: { th: string; en: string }
  code: string
  status: 0 | 1 | 2
  open: boolean
  progress: boolean
}

interface Filter {
  multiple?: boolean
  model: VSelect['$props']['modelValue']
  autoComplete?: boolean
  key: string
  label: string
  items: ComputedRef<VSelect['$props']['items']>
  filter: (item: UserProgress) => boolean
}

const filters: Reactive<Filter[]> = reactive<Filter[]>([
  {
    key: 'type',
    multiple: true,
    model: ['NORMAL', 'OTHER'],
    label: 'User type',
    items: computed(() => [
      { value: 'NORMAL', title: 'Freshmen' },
      { value: 'OTHER', title: 'Upperclassmen' },
      { value: 'TESTER', title: 'Tester' },
    ]),
    filter(user: UserProgress) {
      const status = Array.from(this.model ?? {})
      if (!status.length) return true
      return status.includes(user.type)
    },
  },
  {
    key: 'major',
    multiple: true,
    autoComplete: true,
    model: [],
    label: 'Majors',
    items: computed(() =>
      majors.value.map((item) => ({ title: item.name.en, value: item.id }))
    ),
    filter(user: UserProgress) {
      if (!this.model.length) return true
      return this.model.includes(user.major.id)
    },
  },
])

watch(
  () => filters[1].model,
  () => {
    if (filters[2]) {
      filters[2].model = []
    }
  }
)

interface Major {
  id: string
  name: { th: string; en: string }
  school: {
    id: string
    name: { th: string; en: string }
  }
}

type UserType = 'NORMAL' | 'OTHER' | 'TESTER'

interface UserProgress {
  id: string
  username: string
  name: { first: string; last: string }
  fullName: string
  major: Major
  type: UserType
  round: 'NORMAL' | 'OTHER'
  progress: number
  isLoggedIn: boolean
  activities: ActivityProgress[]
}

type SchoolWithMajor = SchoolEntity & { majors: MajorEntity[] }

const { $api } = useApi()
const loading = ref(false)
const search = ref('')
const items = ref<UserProgress[]>([])
const majors = ref<SchoolWithMajor[]>([])
const activities = ref<Activity[]>([])

async function fetchProgress() {
  const response = await $api.get<ApiResponse<UserProgress[]>>(
    '/dashboard/progress',
    { params: { school: user.value.major?.school?.id } }
  )
  items.value = response.data
}

async function fetchActivities() {
  const response = await $api.get<ApiResponse<Activity[]>>('/activities')
  activities.value = response.data
}

async function fetchMajors() {
  const response = await $api.get<ApiResponse<SchoolWithMajor[]>>(
    `/schools/${user.value.major?.school?.id}/majors`
  )
  majors.value = response.data
}

async function init() {
  loading.value = true
  await fetchActivities()
  await fetchMajors()
  await fetchProgress()
  loading.value = false
}

const displayItems = computed(() => {
  return items.value.filter((user) => {
    return filters.every((filter) => filter.filter(user))
  })
})

const activityReport = computed(() => {
  // Labels
  const labels = activities.value.map((activity) => activity.code)

  // Prepare data
  const entries = activities.value.map((activity) => [activity.id, 0])
  const evaluations = Object.fromEntries(entries)
  const checkins = Object.fromEntries(entries)

  // Calculate data
  displayItems.value.forEach((user) => {
    user.activities.forEach((activity) => {
      if (activity.status === 2) evaluations[activity.id] += 1
      if (activity.status >= 1) checkins[activity.id] += 1
    })
  })

  return {
    labels,
    datasets: [
      {
        label: 'Check-ins',
        color: getColor('primary'),
        values: Object.values(checkins) as number[],
      },
      {
        label: 'Evaluations',
        color: getColor('secondary'),
        values: Object.values(evaluations) as number[],
      },
    ],
  }
})

function filterItems(items: UserProgress[]) {
  return items
    .map((user) => {
      return {
        name: user.fullName,
        studentId: user.username,
        school: user.major?.school?.name?.en ?? 'Unknown',
        major: user.major?.name?.en ?? 'Unknown',
        ...Object.fromEntries(
          user.activities.map((activity) => [activity.code, activity.status])
        ),
        progress: user.progress.toFixed(2),
      }
    })
    .sort((a, b) => `${a.major}`.localeCompare(`${b.major}`))
}

const tableHeaders = computed(() => {
  const headers: VDataTable['$props']['headers'] = [
    {
      title: 'Student ID',
      value: 'studentId',
      width: '10%',
      minWidth: '120px',
      maxWidth: '120px',
    },
    {
      title: 'Name',
      value: 'name',
      width: '20%',
      minWidth: '180px',
      maxWidth: '180px',
    },
    {
      title: 'School',
      value: 'school',
      width: '15%',
      minWidth: '150px',
      maxWidth: '150px',
    },
    {
      title: 'Major',
      value: 'major',
      width: '15%',
      minWidth: '150px',
      maxWidth: '150px',
    },
    {
      title: 'Progress',
      value: 'progress',
      width: '10%',
      minWidth: '120px',
      maxWidth: '120px',
      align: 'center',
      cellProps: (data: UserProgress) => {
        if (data.progress >= 80) {
          return { class: 'text-success' }
        }
        if (data.progress >= 50) {
          return { class: 'text-warning' }
        }
        return { class: 'text-error' }
      },
    },
    ...activities.value.map((activity) => ({
      title: activity.code,
      value: activity.code,
      width: '8%',
      minWidth: '100px',
      maxWidth: '100px',
      align: 'center' as const,
    })),
  ]
  return headers
})

const userReports = computed(() => {
  return filterItems(displayItems.value)
})

function download(data: UserProgress[]) {
  const values = filterItems(data)
  const aoa = []
  aoa.push(tableHeaders.value.map((header) => header.title))
  aoa.push(
    ...values.map((value) =>
      tableHeaders.value.map(
        (header) => value[header.value as keyof typeof value]
      )
    )
  )
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'REPORT')
  const date = new Date()
  XLSX.writeFileXLSX(
    wb,
    `HLLC_REPORT_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}.xlsx`
  )
}

const exportMenus: VListItem['$props'][] = [
  {
    title: 'Export All',
    prependIcon: 'mdi-content-save-all',
    onClick() {
      if (confirm('Are you sure you want to export all of the report')) {
        download(displayItems.value)
      }
    },
  },
  {
    title: 'Export current filter',
    prependIcon: 'mdi-content-save',
    onClick() {
      if (confirm('Are you sure you want to export current filter report?')) {
        download(displayItems.value)
      }
    },
  },
]

const populations = computed(() => {
  const items: Population[] = [
    {
      title: 'All users',
      value: 0,
      icon: 'mdi-account-group',
      color: 'primary',
    },
    {
      title: 'Registerd users',
      value: 0,
      icon: 'mdi-account-key',
      color: 'secondary',
    },
    {
      title: 'Progress > 80%',
      value: 0,
      icon: 'mdi-account-check',
      color: 'success',
    },
  ]
  for (const user of displayItems.value) {
    items[0].value += 1
    if (user.isLoggedIn) items[1].value += 1
    if (user.progress >= 80) items[2].value += 1
  }
  return items
})

onMounted(() => {
  init()
})
</script>

<template>
  <client-only>
    <v-container>
      <v-row dense>
        <v-col cols="12" md="8" class="d-flex align-center">
          <h1>Dashboard</h1>
        </v-col>
        <v-col cols="12">
          <v-row dense>
            <v-col v-for="filter in filters" :key="filter.key" cols="12" md="4">
              <template v-if="filter.autoComplete">
                <v-autocomplete
                  v-model="filter.model"
                  persistent
                  clearable
                  variant="outlined"
                  hide-details
                  :multiple="filter.multiple"
                  :label="filter.label"
                  :items="filter.items"
                />
              </template>
              <template v-else>
                <v-select
                  v-model="filter.model"
                  persistent
                  clearable
                  variant="outlined"
                  hide-details
                  :multiple="filter.multiple"
                  :label="filter.label"
                  :items="filter.items!"
                />
              </template>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row dense>
            <v-col v-for="(population, index) in populations" :key="index">
              <v-list class="rounded-lg border">
                <v-list-item
                  :title="population.title"
                  :subtitle="population.value"
                >
                  <template #prepend>
                    <v-avatar :color="population.color" tile class="rounded-lg">
                      <v-icon :icon="population.icon" />
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
            <v-card-title> Activity </v-card-title>
            <v-divider />
            <v-card-text>
              <bar-chart
                :labels="activityReport.labels"
                :items="activityReport.datasets"
              />
            </v-card-text>
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
              User Progress
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
              :headers="tableHeaders"
              :items="userReports"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </client-only>
</template>
