<script setup lang="ts">
import { VTextField } from 'vuetify/components'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/lamduans', title: 'Lamduan Flowers' },
    { to: '/lamduans/settings', title: 'Lamduan Flower Settings' },
  ],
})
// Injections
const { compare, fetch, toObject, update, toSettings } = useSetting('lamduan')
const snackbar = inject<Snackbar>('snackbar')

// Refs
const loading = ref(false)
const saving = ref(false)

interface LamduanSetting {
  tutorial: string
  youtube: string
  dateTime: {
    start: { date?: Date | null | string; time?: string | null }
    end: { date?: Date | null | string; time?: string | null }
  }
}

const options: SettingOptions[] = [
  {
    key: 'tutorial',
    path: 'tutorial',
    type: 'image',
  },
  {
    key: 'youtube',
    path: 'youtube',
    type: 'text',
  },

  {
    key: 'open',
    path: 'dateTime.start',
    type: 'timestamp',
  },
  {
    key: 'close',
    path: 'dateTime.end',
    type: 'timestamp',
  },
]

const setting = ref<LamduanSetting>({
  tutorial: '',
  youtube: '',
  dateTime: {
    start: {
      date: undefined,
      time: undefined,
    },
    end: {
      date: undefined,
      time: undefined,
    },
  },
})
const settingBackup = ref<LamduanSetting>({
  tutorial: '',
  youtube: '',
  dateTime: {
    start: {
      date: undefined,
      time: undefined,
    },
    end: {
      date: undefined,
      time: undefined,
    },
  },
})
// v-text-field
type TextFieldProps = VTextField['$props']
const inputProps = computed(() => {
  return {
    density: 'compact',
    variant: 'outlined',
    rounded: 'lg',
  } satisfies TextFieldProps
})

const contentUpdate = computed(
  () => !compare(options, setting.value, settingBackup.value)
)

function discardChanges() {
  setting.value = JSON.parse(JSON.stringify(settingBackup.value))
}

async function saveSetting() {
  try {
    await update(toSettings(setting.value, options))
    setting.value = toObject<LamduanSetting>(options)
    settingBackup.value = toObject<LamduanSetting>(options)
    snackbar?.open('Updated all setting successfully', 'success')
  } catch (error) {
    const message = getErrorMessage(error)
    snackbar?.open(message, 'error')
  }
}
/**
 * Initial function to fetch all necessary data
 */
async function fetchData() {
  loading.value = true
  await fetch()
  setting.value = toObject<LamduanSetting>(options)
  settingBackup.value = toObject<LamduanSetting>(options)
  loading.value = false
}

onMounted(async () => {
  await fetchData()
})
</script>
<template>
  <v-container fluid>
    <v-row dene>
      <v-col cols="12" md="8" sm="8">
        <h2 class="text--text">Lamduan Flower Settings</h2>
      </v-col>
      <v-col cols="12" md="4" sm="4" class="d-flex justify-end">
        <v-btn
          variant="text"
          color="error"
          :disabled="saving || !contentUpdate"
          @click="discardChanges()"
        >
          <v-icon icon="mdi-cancel" start />
          Discard Changes
        </v-btn>
        <v-btn
          variant="text"
          :disabled="!contentUpdate"
          :loading="saving"
          color="success"
          @click="saveSetting()"
        >
          <v-icon icon="mdi-content-save" start /> Save
        </v-btn>
      </v-col>
      <v-col cols="12">
        <div v-if="loading">
          <v-card rounded="lg" class="border" variant="outlined">
            <v-card-text>
              <v-progress-circular indeterminate />
              Loading...
            </v-card-text>
          </v-card>
        </div>
        <v-row v-else dense>
          <v-col cols="12">
            <v-card rounded="lg" variant="outlined" class="border">
              <v-card-title> Dowload </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <base-image-upload
                      v-model="setting.tutorial"
                      class="border border-primary"
                      :aspect-ratio="16 / 9"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card rounded="lg" variant="outlined" class="border">
              <v-card-title> Youtube </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model="setting.youtube"
                      v-bind="inputProps"
                      label="Youtube"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card rounded="lg" variant="outlined" class="border">
              <v-card-title> Date Time </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <date-input
                      v-model="setting.dateTime.start.date"
                      v-bind="inputProps"
                      label="Open date"
                    />
                  </v-col>
                  <v-col cols="12">
                    <time-input
                      v-model="setting.dateTime.start.time"
                      v-bind="inputProps"
                      label="Open time"
                    />
                  </v-col>
                  <v-col cols="12">
                    <date-input
                      v-model="setting.dateTime.end.date"
                      v-bind="inputProps"
                      label="Close date"
                    />
                  </v-col>
                  <v-col cols="12">
                    <time-input
                      v-model="setting.dateTime.end.time"
                      v-bind="inputProps"
                      label="Close time"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
