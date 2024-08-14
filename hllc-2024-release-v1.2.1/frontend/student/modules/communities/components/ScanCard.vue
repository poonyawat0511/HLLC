<script setup lang="ts">
import type { VTextField } from 'vuetify/components'
import type { CameraDevice } from 'html5-qrcode'
const { $api } = useNuxtApp()
const dialogAddfriend = ref(false)

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

// Refs
const selectedDeviceId = ref<string>()
const cameraDevices = ref<CameraDevice[]>([])
const cameraOpen = ref<boolean>(true)
const dataFriend = ref<User>()
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
async function onDecode(data?: string) {
  try {
    const res = await $api.get<{ data: User }>(`/users/search/${data}`)
    dataFriend.value = res.data
    dialogAddfriend.value = true
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

/**
 * computed prop for check cemera is open or not
 */
const isCameraOpen = computed(() => {
  return !props.force && cameraOpen.value && isFocus.value
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
  <!-- Camera select -->
  <v-card>
    <v-card-text>
      <v-select
        v-model="selectedDeviceId"
        v-bind="inputProps"
        variant="outlined"
        :items="cameraDevices"
        item-title="label"
        item-value="id"
        label="Select Camera"
      />
      <!-- Camera -->
      <qr-reader
        :camera-id="selectedDeviceId"
        :close="!isCameraOpen"
        class="rounded-lg"
        @init:cameras="onInitCameras"
        @decode="onDecode"
      />
    </v-card-text>
  </v-card>
  <!-- Form dialog -->
  <FormDialog v-model="dialogAddfriend" :data-friend="dataFriend" />
</template>
