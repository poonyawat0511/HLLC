<template>
  <div class="w-100 d-flex justify-space-between align-start">
    <template v-for="(tab, index) in labels" :key="index">
      <div class="d-flex flex-column align-center">
        <v-btn
          variant="flat"
          rounded-pill
          :color="properties.color[index]"
          density="comfortable"
          class="mx-1"
          icon=""
          @click="updateWindow(tab)"
        >
          <v-icon :color="properties.iconsColor[index]">{{
            properties.icons[index]
          }}</v-icon>
        </v-btn>
        <div
          class="text-center text-caption"
          style="position: relative; width: 100%; height: 100%"
        >
          <p
            style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 300%;
              transform: translateX(-50%);
            "
          >
            <slot :name="`title.${tab}`">
              {{ title[tab][lang] }}
            </slot>
          </p>
        </div>
        <v-divider
          v-if="showWindow"
          :thickness="4"
          class="border-opacity-100 rounded w-100 mt-5"
          :color="tab === windowState ? properties.color[index] : 'transparent'"
        />
      </div>
      <div
        v-if="index < labels.length - 1"
        class="d-flex flex-column justify-start w-100"
      >
        <v-progress-linear
          :model-value="properties.modelValue[index]"
          height="5"
          :color="properties.color[index]"
          class="rounded mt-4"
          :class="{ loader: properties.loader[index] }"
        />
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
const { current } = useLocale()
type Locales = 'th' | 'en'
const lang = computed(() => current.value as Locales)

const props = defineProps<{
  activity: IActivity
  showWindow?: boolean
}>()

const labels = ['start', 'checkin', 'end', 'assessment'] as const

type WindowState = (typeof labels)[number]
const windowState = defineModel<WindowState>({ default: 'start' })
const updateWindow = (window: WindowState) => {
  windowState.value = window
}

const title: Record<WindowState, Record<Locales, string>> = {
  start: { th: 'เริ่ม', en: 'Start' },
  checkin: { th: 'ลงทะเบียน', en: 'CheckIn' },
  end: { th: 'สิ้นสุด', en: 'End' },
  assessment: { th: 'แบบประเมิน', en: 'Evaluation' },
}

const stepProgress = computed(() => {
  const progress = props.activity.status
  if (progress.step === 0) {
    return 'Closed'
  } else if (progress.step === 1 && progress.message === 'waiting') {
    return 'Start'
  } else if (progress.step === 1 && progress.message === 'failed') {
    return 'Failed'
  } else if (progress.step === 2) {
    return 'Ongoing'
  } else if (progress.step === 3 && progress.message === 'waiting') {
    return 'End'
  } else if (progress.step === 3 && progress.message === 'success') {
    return 'Done'
  } else {
    return null
  }
})

const properties = computed(() => {
  switch (stepProgress.value) {
    case 'Failed':
      return {
        color: Array(4).fill('red'),
        iconsColor: Array(4).fill('white'),
        icons: ['mdi-check', 'mdi-close', 'mdi-check', 'mdi-close'],
        modelValue: ['100', '0', '0'],
        loader: [false, false, false],
      }
    case 'Closed':
      return {
        color: Array(4).fill('var(--wait-color)'),
        iconsColor: Array(4).fill('white'),
        icons: [
          'mdi-timer-sand',
          'mdi-timer-sand',
          'mdi-timer-sand',
          'mdi-timer-sand',
        ],
        modelValue: ['0', '0', '0'],
        loader: [false, false, false],
      }
    case 'Start':
      return {
        color: [
          'var(--success-color)',
          'var(--wait-color)',
          'var(--wait-color)',
          'var(--wait-color)',
        ],
        iconsColor: Array(4).fill('white'),
        icons: [
          'mdi-check',
          'mdi-timer-sand',
          'mdi-timer-sand',
          'mdi-timer-sand',
        ],
        modelValue: ['0', '0', '0'],
        loader: [true, false, false],
      }
    case 'Ongoing':
      return {
        color: [
          'var(--success-color)',
          'var(--success-color)',
          'var(--wait-color)',
          'var(--wait-color)',
        ],
        iconsColor: Array(4).fill('white'),
        icons: ['mdi-check', 'mdi-check', 'mdi-timer-sand', 'mdi-timer-sand'],
        modelValue: ['100', '0', '0'],
        loader: [false, true, false],
      }
    case 'End':
      return {
        color: [
          'var(--success-color)',
          'var(--success-color)',
          'var(--success-color)',
          'var(--wait-color)',
        ],
        iconsColor: Array(4).fill('white'),
        icons: ['mdi-check', 'mdi-check', 'mdi-check', 'mdi-timer-sand'],
        modelValue: ['100', '100', '0'],
        loader: [false, false, true],
      }
    case 'Done':
      return {
        color: [
          'var(--success-color)',
          'var(--success-color)',
          'var(--success-color)',
          'var(--success-color)',
        ],
        iconsColor: Array(4).fill('white'),
        icons: ['mdi-check', 'mdi-check', 'mdi-check', 'mdi-check'],
        modelValue: ['100', '100', '100'],
        loader: [false, false, false],
      }
    default:
      return {
        color: Array(4).fill('var(--wait-color)'),
        icons: Array(4).fill(''),
        iconsColor: Array(4).fill('white'),
        modelValue: Array(3).fill(''),
        loader: Array(3).fill(false),
      }
  }
})
</script>
<style scope>
:root {
  --wait-color: rgb(100, 100, 100);
  --success-color: rgb(76, 175, 80);
}

.text-overflow {
  white-space: nowrap;
  overflow: auto;
  text-overflow: clip clip;
}

.loader {
  height: 24px;
  --c: var(--success-color) 0 15px, #0000 0 20px;
  background: repeating-linear-gradient(45deg, var(--c)) right top,
    repeating-linear-gradient(135deg, var(--c)) right bottom;
  background-size: 200% 50%;
  background-repeat: no-repeat;
  animation: animation 5s infinite linear;
}

.custom-divider {
  transform: translateY(24px);
  position: relative;
}

@keyframes animation {
  100% {
    background-position: left top, left bottom;
  }
}
</style>
