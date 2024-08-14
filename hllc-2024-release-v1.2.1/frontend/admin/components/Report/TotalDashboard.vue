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

const initialChartData: ChartData<'bar'> = {
  labels: [],
  datasets: [],
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
    }
  }
  status: string
}

const loaded = ref(false)
const error = ref<string | null>(null)
const chartData = ref<ChartData<'bar'>>(initialChartData)
const topicsCategory = ref<string[]>([])

const props = defineProps({
  reportData: {
    type: Array as PropType<ReportData[]>,
    required: true,
  },
  colors: {
    type: String,
    required: true,
  }
})

// Function to map topics data to datasets
const mapTopics = (dataList: ReportData[]) => {
  const topicCounts: { [key: string]: number } = {}

  dataList.forEach((data) => {
    if (!topicCounts[data.category.name.en]) {
      topicCounts[data.category.name.en] = 1
    } else {
      topicCounts[data.category.name.en] += 1
    }
  })

  // Set the topicsCategory ref with the keys of topicCounts
  topicsCategory.value = Object.keys(topicCounts)

  chartData.value = {
    labels: ['Topics that have in reports'],
    datasets: topicsCategory.value.map((topic) => ({
      label: topic,
      data: [topicCounts[topic]],
      backgroundColor: props.colors,
      borderWidth: 1,
    })),
  }
  loaded.value = true
}

watch(
  () => props.reportData,
  (newVal) => {
    if (newVal && newVal.length) {
      try {
        mapTopics(newVal)
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
