<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import type { ChartData } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  reportData: {
    type: Array as PropType<ReportData[]>,
    required: true,
  },
  colors: {
    type: String,
    required: true,
  },
})

const initialChartData: ChartData<'bar'> = {
  labels: [],
  datasets: [],
}

const loaded = ref(false)
const error = ref<string | null>(null)
const chartData = ref<ChartData<'bar'>>(initialChartData)

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
    }
  }
  status: string
}

// Function to map topics data to datasets
const mapStatus = (dataList: ReportData[]) => {
  const statusCounts: { [key: string]: number } = {}
  dataList.forEach((data) => {
    if (statusCounts[data.status]) {
      statusCounts[data.status]++
    } else {
      statusCounts[data.status] = 1
    }
  })

  const statuses = Object.keys(statusCounts)

  chartData.value = {
    labels: ['Status Counts'], // Use statuses as labels
    datasets: statuses.map((status) => ({
      label: status,
      data: [statusCounts[status]], // Array with count for this status
      backgroundColor: props.colors, // Generate a single color for each dataset
      borderWidth: 1,
    })),
  }
}

watch(
  () => props.reportData,
  (newVal) => {
    if (newVal && newVal.length) {
      try {
        mapStatus(newVal)
        loaded.value = true // Set loaded to true after processing data
      } catch (err) {
        error.value = (err as Error).message
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="container">
    <div v-if="!loaded">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <Bar v-if="loaded && !error" :data="chartData" />
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}
</style>
