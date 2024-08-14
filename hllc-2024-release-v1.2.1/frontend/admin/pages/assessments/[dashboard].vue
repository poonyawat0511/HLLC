<script setup lang="ts">
import * as XLSX from 'xlsx'
import type { VDataTable, VListItem } from 'vuetify/components'

const route = useRoute()

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/assessments', title: 'Assessments' },
  ],
  validate: async (route) => {
    return (
      typeof route.params.dashboard === 'string' &&
      ['pretest', 'posttest'].includes(route.params.dashboard)
    )
  },
})

nextTick(() => {
  route.meta.breadcrumbs = [
    { to: '/', title: 'Home' },
    { to: '/assessments', title: 'Assessments' },
    {
      to: `${route.params.dashboard}`,
      title: `${route.params.dashboard}`.toUpperCase(),
    },
  ]
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
  assessment: boolean
} & {
  [K: string]: string | number | null | undefined
}
type SchoolWithMajor = SchoolEntity & { majors: MajorEntity[] }

const { $api } = useApi()
const loading = ref(false)
const search = ref('')
const schools = ref<SchoolWithMajor[]>([])
const headers = ref<Header[]>([])
const users = ref<UserSummary[]>([])

const {
  filter: applyFilter,
  forward,
  components,
} = useFilter<UserSummary>([
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

interface Header {
  title: string
  children: { title: string; value: string; average: string }[]
}

interface SummaryResponse {
  headers: Header[]
  values: UserSummary[]
}

async function fetchSummary() {
  const response = await $api.get<ApiResponse<SummaryResponse>>(
    `/dashboard/${route.params.dashboard}`
  )
  headers.value = response.data.headers
  users.value = response.data.values.sort((a, b) =>
    `${a.major?.school?.name.en}:${a.major?.name.en}:${a.username}`.localeCompare(
      `${b.major?.school?.name.en}:${b.major?.name.en}:${a.username}`
    )
  )
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
  loading.value = false
}

const filterItems = computed(() => {
  return applyFilter(users.value)
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
  {
    title: 'Submit',
    value: 'assessment',
    sortable: true,
  },
]

const average = computed(() => {
  const averageHeaders = [
    { title: 'Question', value: 'title' },
    { title: 'Value', value: 'average' },
  ]
  const items = headers.value.map((header) => ({
    title: header.title,
    children: header.children.map((child) => ({
      title: child.title,
      value: child.value,
      average: child.average
        ? filterItems.value
            .filter((user) => user[child.value])
            .reduce((acc, curr, i) => {
              const value = curr[child.value] as number
              if (i === 0) return value
              return (acc + value) / 2
            }, 0)
        : undefined,
    })),
  }))
  return { headers: averageHeaders, items }
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
  for (const user of filterItems.value) {
    summary[0].value++
    if (user.isLoggedIn) summary[1].value++
    if (user.assessment) {
      summary[2].value++
    }
  }
  return summary
})

function download(target: 'all' | 'current') {
  // Create workbooc
  const filterHeaders = [...staticHeaders, ...headers.value]
  let col = 0
  const merge = []
  const cellHeaders: string[][] = [[], []]
  for (const column in filterHeaders) {
    const header = filterHeaders[column]
    if ('children' in header) {
      if (header.children.length === 0) continue
      const currCol = col
      col += header.children.length - 1
      cellHeaders[0].push(...header.children.map((_) => header.title))
      cellHeaders[1].push(...header.children.map((child) => child.title))
      merge.push({ s: { r: 0, c: currCol }, e: { r: 0, c: col } })
      col++
    } else {
      cellHeaders[0].push(header.title)
      cellHeaders[1].push(header.title)
      merge.push({ s: { r: 0, c: col }, e: { r: 1, c: col } })
      col++
    }
  }
  const values = target === 'all' ? users.value : filterItems.value

  const sheetsMap = new Map<string, { name: string; values: string[][] }>(
    schools.value.map((school) => [
      school.id,
      { name: school.acronym, values: [] },
    ])
  )

  for (const user of values) {
    const row = (() =>
      filterHeaders.flatMap((header) => {
        if ('children' in header) {
          return header.children.map(
            (child) => getObjectValue(user, child.value) ?? ''
          )
        }
        return [getObjectValue(user, header.value) ?? '']
      }))()
    const sheet = sheetsMap.get(user.major.school.id as string)
    if (!sheet) continue
    sheet.values.push(row)
  }

  const wb = XLSX.utils.book_new()
  const sheets = Array.from(sheetsMap.values())

  // Append all data
  const allDataWs = XLSX.utils.aoa_to_sheet([
    ...cellHeaders,
    ...sheets.flatMap((sheet) => sheet.values),
  ])
  allDataWs['!merges'] = merge
  XLSX.utils.book_append_sheet(wb, allDataWs, 'ALL')

  // Append each
  for (const sheet of sheets) {
    if (!sheet.values.length) continue
    const ws = XLSX.utils.aoa_to_sheet([...cellHeaders, ...sheet.values])
    ws['!merges'] = merge
    XLSX.utils.book_append_sheet(wb, ws, sheet.name)
  }

  const date = new Date()
  XLSX.writeFileXLSX(
    wb,
    `HLLC_${route.params.dashboard
      .toString()
      .toUpperCase()}_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}.xlsx`
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
        <h1>Posttest Dashboard</h1>
      </v-col>
      <v-col cols="12">
        <v-row dense>
          <v-col
            v-for="filter in components"
            :key="filter.key"
            cols="12"
            md="4"
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
            <template #body="{ items: sections }">
              <template v-for="section in sections" :key="section.id">
                <tr>
                  <td
                    class="bg-grey-lighten-2"
                    style="height: 40px !important"
                    :colspan="average.headers.length"
                  >
                    section: {{ section.title }}
                  </td>
                </tr>
                <tr v-for="child in section.children" :key="child.value">
                  <td v-for="header in average.headers" :key="header.value">
                    {{ getObjectValue(child, header.value) }}
                  </td>
                </tr>
              </template>
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
            :headers="[...staticHeaders, ...headers]"
            :items="filterItems"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
