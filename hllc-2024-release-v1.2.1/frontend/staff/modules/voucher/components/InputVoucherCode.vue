<script setup lang="ts">
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'

const props = defineProps({
  item: {
    type: String,
    default: null,
  },
})

/**
 * * tap switch
 */
const router = useRouter()
const route = useRoute()
const dialog = ref(false)
const studentData = ref<User>()
const studentId = ref<User | null>(null)
interface TabItem {
  value: string
  title: string
}

const tabs = reactive<TabItem[]>([
  { value: 'Scan', title: 'Scan' },
  { value: 'Typing', title: 'Typing' },
])

function changeTab(value: string) {
  tab.value = value
}

const tab = computed<string>({
  get() {
    return route.query.view ? String(route.query.view) : tabs[0]?.value
  },
  set(value) {
    router.push({ query: { view: value } })
  },
})

/**
 * * user
 */
const { $api } = useNuxtApp()
const verifyUser = async (decodedText: string) => {
  try {
    const res = await $api.get<{ data: User }>(`/users/search/${decodedText}`)
    studentData.value = res.data
    dialog.value = true
  } catch (error) {
    console.error('Error fetching user:', error)
    onSnackbar({
        title: 'No user',
        type: 'warning',
        icon: 'mdi-alert-circle-outline',
      })
  }
}

const verifyStudnetId = async (studentId : string) => {
  try {
    const res = await $api.get<{ data: User }>(`/users/search/${studentId}`)
    studentData.value = res.data
  } catch (error) {
    console.error('Error fetching user:', error)
    onSnackbar({
        title: 'No user',
        type: 'warning',
        icon: 'mdi-alert-circle-outline',
      })
  }
}

watch(studentId, (newStudentId) => {
  if (newStudentId && newStudentId.length === 10) {
    verifyStudnetId(newStudentId)
  }
})

/**
 * * camera
 */
let html5Qrcode: Html5Qrcode | null = null
const selectedDeviceId = ref<string | null>(null)
const videoDevices = ref<Array<{ id: string; label: string }>>([])
const cameraOpen = ref<boolean>(true)

onMounted(() => {
  getVideoDevices()
})

const getVideoDevices = async () => {
  try {
    const devices = await Html5Qrcode.getCameras()
    videoDevices.value = devices.map((device) => ({
      id: device.id,
      label: device.label,
    }))
    if (videoDevices.value.length > 0) {
      selectedDeviceId.value = videoDevices.value[0].id
      if (cameraOpen.value && tab.value === 'Scan') {
        startCamera(selectedDeviceId.value)
      }
    }
  } catch (error) {
    console.error('Error getting video devices:', error)
  }
}

const switchCamera = async () => {
  if (
    html5Qrcode &&
    html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING
  ) {
    await html5Qrcode.stop()
  }

  if (selectedDeviceId.value && cameraOpen.value) {
    startCamera(selectedDeviceId.value)
  }
}

const startCamera = async (deviceId: string) => {
  await nextTick() // Ensure DOM is updated before starting the camera
  if (!html5Qrcode) {
    html5Qrcode = new Html5Qrcode('reader')
  }
  try {
    await html5Qrcode.start(
      deviceId,
      {
        fps: 10,
        qrbox: 250,
      },
      verifyUser,
      onError
    )
    cameraOpen.value = true
  } catch (error) {
    console.error('Error starting Html5Qrcode:', error)
  }
}

watch(selectedDeviceId, (newDeviceId) => {
  if (newDeviceId && cameraOpen.value && tab.value === 'Scan') {
    switchCamera()
  }
})

watch(tab, () => {
  if (tab.value === 'Typing' && html5Qrcode) {
    if (html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING) {
      html5Qrcode.stop().then(() => {
        html5Qrcode?.clear()
      })
    }
  } else if (
    tab.value === 'Scan' &&
    selectedDeviceId.value &&
    cameraOpen.value
  ) {
    startCamera(selectedDeviceId.value)
  }
})

onBeforeUnmount(() => {
  if (
    html5Qrcode &&
    html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING
  ) {
    html5Qrcode.stop().then(() => {
      html5Qrcode?.clear()
    })
  }
})

watch(cameraOpen, (newValue) => {
  if (newValue && tab.value === 'Scan' && selectedDeviceId.value) {
    startCamera(selectedDeviceId.value)
  } else if (
    html5Qrcode &&
    html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING
  ) {
    html5Qrcode.stop().then(() => {
      html5Qrcode?.clear()
    })
  }
})

watch(
  () => props.item,
  async (newValue) => {
    if (newValue && newValue.length > 0 && selectedDeviceId.value) {
      if (cameraOpen.value && tab.value === 'Scan') {
        await startCamera(selectedDeviceId.value)
      }
    } else if (
      html5Qrcode &&
      html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      await html5Qrcode.stop()
      html5Qrcode.clear()
    }
  }
)

const onError = (errorMessage: string) => {
  if (errorMessage.includes('NotFoundException')) {
    return
  }
  console.error('QR-Code not found', errorMessage)
}

/**
 * * update user to voucher code
 */
const voucherCodes = ref<VoucherCode[]>([])
const onConfirm = async () => {
  try {
    const response = await $api.get<{ data: VoucherCode[] }>(
      `/voucher-codes/${props.item}/voucher`
    )
    voucherCodes.value = response.data

    try {
      await $api.put<{data: VoucherCode}>(`/voucher-codes/${voucherCodes.value.id}`, {
        body: JSON.stringify({ user: studentData.value?.id }),
      })
      dialog.value = false
      onSnackbar({
        title: 'Sucess add user to voucher',
        type: 'success',
        icon: 'mdi-check-circle-outline',
      })
    } catch (error) {
      console.error('Error updating voucher:', error)
      onSnackbar({
        title: 'Error add user voucher',
        type: 'warning',
        icon: 'mdi-alert-circle-outline',
      })
    }
  } catch (error) {
    console.error('Error fetching voucherCode id', error)
    onSnackbar({
      title: 'Voucher no has code',
      type: 'warning',
      icon: 'mdi-alert-circle-outline',
    })
  }
}

/**
 * * snankbar
 */
const snackbar = ref<boolean>(false)
interface CreateSnackbarNotify {
  icon: string
  title: string
  type: string
}

const snackbarNotify = reactive<CreateSnackbarNotify>({
  icon: '',
  title: '',
  type: '',
})

const onSnackbar = (data: { icon: string; type: string; title: string }) => {
  snackbarNotify.icon = data.icon
  snackbarNotify.title = data.title
  snackbarNotify.type = data.type
  snackbar.value = true
}
</script>

<template>
  <v-card
    class="mx-auto pa-2 mt-4"
    rounded="xl"
    variant="outlined"
    max-width="40rem"
  >
    <tab-switch :tabs="tabs" :active-tab="tab" @change-tab="changeTab" />
    <v-window v-model="tab">
      <v-window-item value="Scan">
        <div v-if="props.item?.length > 0">
          <v-card-text>
            <div class="d-flex flex-row align-center pa-0">
              <v-spacer />
              <v-switch v-model="cameraOpen" color="black" hide-details="auto">
                <template #label>
                  <span>Camera : {{ cameraOpen ? 'On' : 'Close' }}</span>
                </template>
              </v-switch>
            </div>
            <v-select
              v-model="selectedDeviceId"
              class="pa-4"
              variant="outlined"
              rounded="lg"
              :items="videoDevices"
              item-title="label"
              item-value="id"
              label="Select Camera"
            />
            <v-responsive width="100%" height="auto">
              <div
                v-if="cameraOpen && props.item"
                id="reader"
                class="camera-inner camera"
              />
              <div
                v-else
                class="d-flex flex-column justify-center align-center camera-inner"
              >
                <div>
                  <v-icon size="60">mdi-camera</v-icon>
                </div>
                <span> Loading... </span>
              </div>
            </v-responsive>
          </v-card-text>
        </div>
        <div v-else>
          <v-card-text>
            <span>No sponsor & voucher selected</span>
          </v-card-text>
        </div>
      </v-window-item>
      <v-window-item value="Typing">
        <div v-if="props.item?.length > 0">
          <v-card-text>
            <span class="ml-2">Student ID</span>
            <v-text-field
              v-model="studentId"
              rounded="lg"
              variant="outlined"
              class="text-field"
              hide-details
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              dark
              large
              rounded="xl"
              color="black"
              class="px-6"
              variant="flat"
              @click="dialog = true"
            >
              Submit
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </div>
        <div v-else>
          <v-card-text>
            <span>No sponsor & voucher selected</span>
          </v-card-text>
        </div>
      </v-window-item>
    </v-window>
    <confirm-voucher-code
      v-model="dialog"
      :student="studentData"
      @submit="onConfirm()"
    />
    <SnackBar
      v-model="snackbar"
      :title="snackbarNotify.title"
      :icon="snackbarNotify.icon"
      :type="snackbarNotify.type"
    />
  </v-card>
</template>

<style scoped>
.camera-inner {
  height: inherit;
  width: inherit;
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