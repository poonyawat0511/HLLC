<script setup lang="ts">
import { ref, watch } from 'vue'
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

const initialChartData: ChartData<'bar'> = {
  labels: [],
  datasets: [],
}

const loaded = ref(false)
const error = ref<string | null>(null)
const chartData = ref<ChartData<'bar'>>(initialChartData)

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

const mapSchoolData = (dataList: ReportData[]) => {
  const schoolCounts: { [key: string]: number } = {}

  // Count occurrences of each school
  dataList.forEach((data) => {
    if (schoolCounts[data.reporter.major.school.name.en]) {
      schoolCounts[data.reporter.major.school.name.en]++
    } else {
      schoolCounts[data.reporter.major.school.name.en] = 1
    }
  })

  const locations = Object.keys(schoolCounts)

  // Prepare chartData with appropriate labels and datasets
  chartData.value = {
    labels: ['Schools with issues'],
    datasets: locations.map((school) => ({
      label: school,
      data: [schoolCounts[school]], // Array of data corresponding to each label
      backgroundColor: props.colors,
      borderWidth: 1,
    })),
  }
}

watch(
  () => props.reportData,
  (newVal) => {
    if (newVal && newVal.length) {
      try {
        mapSchoolData(newVal)
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
    <div v-if="!loaded && !error">Loading...</div>
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
