<template>
  <ClientOnly>
    <Bar
      v-if="rendered"
      :chart-options="chartOptions"
      :data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import colors from 'vuetify/lib/util/colors.mjs'
import type { Plugin } from 'chart.js'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Item {
  label: string
  values: number[]
  color?: string
}

const props = defineProps<{
  theme?: string
  labels: string[]
  items: Item[]
  label?: string
  chartId?: string
  datasetIdKey?: string
  width?: number
  height?: number
  cssClasses?: string
  styles?: Record<string, unknown>
  plugins?: Plugin<'bar', object>[]
}>()

const rendered = ref(true)
const timer = ref<NodeJS.Timeout>()
const currentWidth = ref(0)

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },
  scales: {
    y: {
      ticks: {
        color: '#b6baca',
      },
      grid: {
        drawTicks: false,
      },
      border: {
        dash: [5, 60],
      },
      suggestedMin: 0,
      suggestedMax: 10,
    },
    x: {
      ticks: {
        color: '#b6baca',
      },
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
  },
})

const colorsList = Object.keys(colors).filter(
  (key) => key !== 'grey' && key !== 'shades'
)

const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: props.items.map((item) => ({
      label: item.label,
      backgroundColor: getColor(item.color),
      data: item.values,
    })),
  }
})

const { themes, name } = useTheme()

const getColor = (color?: string) => {
  const theme = props.theme || name.value
  const colorScheme = themes.value[theme].colors
  if (!color) {
    return randomColor()
  }
  if (color.startsWith('#')) return color
  const [key, variant] = color.split(' ')
  const colorKey = convertToCamelCase(key) as keyof typeof colors
  const shade = (variant?.split('-').join('') ||
    'base') as keyof (typeof colors)[typeof colorKey]
  return colorScheme[colorKey] || colors[colorKey]?.[shade]
}

const randomColor = () => {
  const colorIndex = Math.floor(Math.random() * colorsList.length)
  const color = colorsList[colorIndex] as keyof typeof colors
  const variantKeys = Object.keys(colors[color]).filter((key) =>
    key.startsWith('darken')
  )
  const variantIndex = Math.floor(Math.random() * variantKeys.length)
  const variant = variantKeys[
    variantIndex
  ] as keyof (typeof colors)[typeof color]
  return colors[color][variant]
}

const convertToCamelCase = (str: string) => {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

const handleResize = () => {
  if (currentWidth.value !== window.innerWidth) {
    clearTimeout(timer.value)
    rendered.value = false
    timer.value = setTimeout(() => {
      rendered.value = true
      currentWidth.value = window.innerWidth
    }, 500)
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
