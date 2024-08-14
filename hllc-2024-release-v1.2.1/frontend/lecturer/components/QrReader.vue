<script setup lang="ts">
import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  type CameraDevice,
  type Html5QrcodeCameraScanConfig,
  type QrcodeSuccessCallback,
} from 'html5-qrcode'
import { useDisplay } from 'vuetify'
import type { VResponsive } from 'vuetify/components'

const props = withDefaults(
  defineProps<{ close?: boolean; cameraId?: string; contentClass?: string }>(),
  {
    close: false,
    cameraId: undefined,
    contentClass: undefined,
  }
)

const minHeight = 200
const noCamera = ref(false)
const loading = ref(true)

const emit = defineEmits<{
  'init:cameras': [devices: CameraDevice[], defaultCamera: CameraDevice]
  decode: [result: string, next: () => void]
  error: [message: string]
}>()

const defaultCamera = ref<CameraDevice>()
const cameraDevices = ref<Array<CameraDevice>>([])

let html5Qrcode: Html5Qrcode | null = null
const camera = {
  getCamera() {
    if (cameraDevices.value.length === 0) return
    const camera = cameraDevices.value.find(
      (camera) => camera.id === props.cameraId
    )
    return camera ?? defaultCamera.value
  },

  async cleanup() {
    if (
      html5Qrcode &&
      html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      await html5Qrcode.stop()
      html5Qrcode.clear()
    }
  },

  async stop() {
    if (
      html5Qrcode &&
      html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      await html5Qrcode.stop()
    }
  },

  async start() {
    await nextTick() // Ensure DOM is updated before starting the camera
    if (!html5Qrcode) {
      html5Qrcode = new Html5Qrcode('reader')
    }
    try {
      await this.stop()
      const camera = this.getCamera()
      if (!camera) return
      const options: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: 250,
      }
      await html5Qrcode.start(camera.id, options, onDecode, onError)
    } catch (error) {
      console.error('Error starting Html5Qrcode:', error)
    }
  },

  async restart() {
    loading.value = true
    await this.stop()
    await this.start()
    loading.value = false
  },

  async pause() {
    if (
      html5Qrcode &&
      html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      html5Qrcode.pause()
    }
  },

  async resume() {
    if (
      html5Qrcode &&
      html5Qrcode.getState() === Html5QrcodeScannerState.PAUSED
    ) {
      html5Qrcode.resume()
    }
  },
}

async function getRearCameraId() {
  try {
    const camera = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'environment',
      },
    })
    if (!camera) return
    const videoTrack = camera.getVideoTracks()[0]
    const rearCameraId = videoTrack.getSettings().deviceId
    camera.getTracks().forEach((track) => track.stop())
    return rearCameraId
  } catch (error) {
    console.error('Fail get camera', error)
    return null
  }
}

async function getDefaultCamera(devices: CameraDevice[]) {
  try {
    const rearCameraId = await getRearCameraId()
    return devices.find((device) => device.id === rearCameraId) || devices[0]
  } catch (error) {
    return devices[0]
  }
}

const init = async () => {
  try {
    // Get camera devices
    cameraDevices.value = await Html5Qrcode.getCameras()
    defaultCamera.value = await getDefaultCamera(cameraDevices.value)

    emit('init:cameras', cameraDevices.value, defaultCamera.value)

    // No camera devices
    if (cameraDevices.value.length === 0) {
      noCamera.value = true
      return
    }

    // Try to open the first camera
    if (!props.close) {
      await camera.start()
    }

    loading.value = false
  } catch (error) {
    console.error('Error getting video devices:', error)
  }
}

const onError = (errorMessage: string) => {
  if (errorMessage.includes('NotFoundException')) {
    return
  }
  emit('error', errorMessage)
}

const onDecode: QrcodeSuccessCallback = async (value) => {
  await camera.pause()
  emit('decode', value, async () => {
    await camera.resume()
  })
}

const { width } = useDisplay()
const timer = ref<ReturnType<typeof setTimeout>>()

watch(
  () => [width.value],
  async () => {
    if (import.meta.server) return
    loading.value = true
    await camera.stop()
    // Clear timeout to enable render camera once
    clearTimeout(timer.value)
    // render camera again
    timer.value = setTimeout(async () => {
      await camera.start()
      loading.value = false
    }, 500)
  }
)

onMounted(async () => {
  await init()
})

onBeforeUnmount(async () => {
  await camera.cleanup()
})

// Immediately checkup camera when close status is changed
watch(
  () => props.close,
  async (isClosed) => {
    if (!isClosed) {
      loading.value = true
      await camera.start()
      loading.value = false
    } else {
      await camera.cleanup()
    }
  }
)

// Restart cemera when cemera id is changed
watch(
  () => props.cameraId,
  async () => {
    await camera.restart()
  }
)
</script>

<template>
  <v-responsive width="100%" height="auto" :min-height="minHeight">
    <div id="reader" ref="reader" class="camera-inner camera" />
    <div
      v-if="noCamera"
      class="d-flex flex-column align-center justify-center bg-grey camera-inner"
    >
      <v-icon size="50" icon="mdi-camera-off" />
      <div>No camera devices</div>
    </div>
    <div
      v-else-if="loading"
      class="d-flex flex-column align-center justify-center bg-grey camera-inner"
    >
      <v-icon size="50" icon="mdi-camera" />
      <div style="width: 100%; max-width: 10rem">
        <v-progress-linear color="primary" height="6" indeterminate rounded />
      </div>
    </div>
    <div v-else :class="['camera-inner', contentClass]">
      <slot />
    </div>
  </v-responsive>
</template>

<style scoped>
.camera-inner {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.camera {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
