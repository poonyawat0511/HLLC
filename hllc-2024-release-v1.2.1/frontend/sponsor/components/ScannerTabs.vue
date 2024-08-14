<script setup lang="ts">
import type { VTextField } from 'vuetify/components'
import type { CameraDevice } from 'html5-qrcode'

const tab = defineModel<'camera' | 'typing'>({
  default: 'camera',
})

const props = withDefaults(
  defineProps<{
    force?: boolean
    forceMessage?: string
    inputProps?: VTextField['$props']
  }>(),
  {
    force: false,
    forceMessage: 'Area is not visible',
    inputProps: () => ({}),
  }
)

const emit = defineEmits<{
  decode: [data?: string, next?: () => void]
}>()

// Refs
const selectedDeviceId = ref<string>()
const cameraDevices = ref<CameraDevice[]>([])
const cameraOpen = ref<boolean>(true)

/**
 * A function to setup all camera devices
 * @param devices camera devices
 */
function onInitCameras(devices: CameraDevice[], defaultDevice?: CameraDevice) {
  cameraDevices.value = devices
  selectedDeviceId.value = defaultDevice?.id
}

/**
 * A function to handle the decoded data
 * @param data decoded data
 * @param next a function to call for next reader
 */
async function onDecode(data?: string, next?: () => void) {
  emit('decode', data, next)
}

/**
 * computed prop for check cemera is open or not
 */
const isCameraOpen = computed(() => {
  return (
    !props.force && tab.value === 'camera' && cameraOpen.value && isFocus.value
  )
})

// Check is browser is focused
const isFocus = ref(true)
function handleBrowserTabChange() {
  isFocus.value = !document.hidden
}

onMounted(() => {
  // Watch browser tab change
  document.addEventListener('visibilitychange', handleBrowserTabChange)
})

onUnmounted(() => {
  // Remove browser tab watcher
  document.removeEventListener('visibilitychange', handleBrowserTabChange)
})
</script>

<template>
  <v-card
    class="mx-auto pa-2"
    max-width="45rem"
    rounded="lg"
    variant="outlined"
  >
          <v-card-title class="text-center">
            Scan Qr Code Voucher
          </v-card-title>
          <v-card-text>
            <!-- Camera input -->
            <v-select
              v-model="selectedDeviceId"
              v-bind="inputProps"
              variant="outlined"
              :items="cameraDevices"
              item-title="label"
              item-value="id"
              label="Select Camera"
            />
            <!-- Camera area -->
            <qr-reader
              :camera-id="selectedDeviceId"
              :close="!isCameraOpen"
              class="rounded-lg"
              @init:cameras="onInitCameras"
              @decode="onDecode"
            >
              <v-sheet
                :color="isCameraOpen ? 'transparent' : 'grey'"
                class="w-100 h-100 d-flex flex-row justify-end"
              >
                <div
                  v-if="!isCameraOpen"
                  style="position: absolute"
                  class="h-100 w-100 d-flex align-center justify-center"
                >
                  <v-icon start icon="mdi-camera-off" />
                  Camera is closing
                </div>
                <v-icon
                  size="30"
                  color="white"
                  :icon="cameraOpen ? 'mdi-camera' : 'mdi-camera-off'"
                  class="ma-3"
                  @click="cameraOpen = !cameraOpen"
                />
              </v-sheet>
            </qr-reader>
          </v-card-text>
  
  </v-card>
</template>
