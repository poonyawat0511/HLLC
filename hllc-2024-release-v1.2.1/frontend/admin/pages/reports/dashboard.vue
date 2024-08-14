<script setup lang="ts">
const { $api } = useNuxtApp()
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/reports', title: 'User Reports' },
    { to: '/reports/dashboard', title: 'Report Dashboard' },
  ],
})
interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}
interface ReportData {
  category: {
    name: {
      th: string
      en: string
    }
  }
  message: string
  reporter: {
    fullname: string
    major: {
      acronym: string
      detail: string
      name: {
        th: string
        en: string
      }
      school: {
        name: {
          th: string
          en: string
        }
      }
    }
  }
  status: string
}

const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF'

  const isGray = (color: string): boolean => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return r === g && g === b
  }

  const isDark = (color: string): boolean => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 128
  }

  let color: string
  do {
    color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 8)]
    }
  } while (isGray(color) || !isDark(color))

  return color
}

const totalDash = ref<ReportData[]>([])
const fetchTotal = async () => {
  try {
    const response = await $api.get<ApiResponse<ReportData[]>>('reports')
    totalDash.value = response.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchTotal()
})
</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" align="center">
        <div class="dashboard-section">
          <span class="dashboard-title">Total Dashboard</span>
          <Report-TotalDashboard
            :report-data="totalDash"
            :colors="getRandomColor()"
          />
        </div>
      </v-col>
      <v-col cols="12" md="6" align="center">
        <div class="dashboard-section">
          <span class="dashboard-title">Status Dashboard</span>
          <Report-StatusDashboard
            :report-data="totalDash"
            :colors="getRandomColor()"
          />
        </div>
      </v-col>
      <v-col cols="12" md="6" align="center">
        <div class="dashboard-section">
          <span class="dashboard-title">Schools Dashboard</span>
          <Report-SchoolsDasboard
            :report-data="totalDash"
            :colors="getRandomColor()"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.dashboard-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dashboard-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
