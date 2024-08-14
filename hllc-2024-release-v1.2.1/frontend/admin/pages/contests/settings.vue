<script setup lang="ts">
import { VTextField } from 'vuetify/components'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/contests', title: 'Fresher Contest' },
    { to: '/contests/settings', title: 'Contest Settings' },
  ],
})

type TextFieldProps = VTextField['$props']

// Injections
const { compare, fetch, toObject, update, toSettings } = useSetting('contest')
const snackbar = inject<Snackbar>('snackbar')

// Refs
const loading = ref(false)
const saving = ref(false)

interface ContestSetting {
  banner: string
  details: {
    th: string
    en: string
  }
  final: {
    th: string
    en: string
  }
  rules: {
    th: ArrayValue[]
    en: ArrayValue[]
  }
  taglines: {
    th: ArrayValue[]
    en: ArrayValue[]
  }
  dateTime: {
    start: { date?: Date | null | string; time?: string | null }
    end: { date?: Date | null | string; time?: string | null }
  }
}

const options: SettingOptions[] = [
  { key: 'banner', path: 'banner', type: 'image' },
  {
    key: 'details:th',
    path: 'details.th',
    type: 'text',
  },
  {
    key: 'details:en',
    path: 'details.en',
    type: 'text',
  },
  {
    key: 'final:th',
    path: 'final.th',
    type: 'text',
  },
  {
    key: 'final:en',
    path: 'final.en',
    type: 'text',
  },
  {
    key: 'howToVote:th',
    path: 'rules.th',
    type: 'array',
  },
  {
    key: 'howToVote:en',
    path: 'rules.en',
    type: 'array',
  },
  {
    key: 'taglines:th',
    path: 'taglines.th',
    type: 'array',
  },
  {
    key: 'taglines:en',
    path: 'taglines.en',
    type: 'array',
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

const setting = ref<ContestSetting>({
  banner: '',
  details: {
    th: '',
    en: '',
  },
  final: {
    th: '',
    en: '',
  },
  rules: {
    th: [],
    en: [],
  },
  taglines: {
    th: [],
    en: [],
  },
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
const settingBackup = ref<ContestSetting>({
  banner: '',
  details: {
    th: '',
    en: '',
  },
  final: {
    th: '',
    en: '',
  },
  rules: {
    th: [],
    en: [],
  },
  taglines: {
    th: [],
    en: [],
  },
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

const inputProps = computed(() => {
  return {
    density: 'compact',
    variant: 'outlined',
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
    setting.value = toObject<ContestSetting>(options)
    settingBackup.value = toObject<ContestSetting>(options)
    snackbar?.open('Updated all setting successfully', 'success')
  } catch (error) {
    const message = getErrorMessage(error)
    snackbar?.open(message, 'error')
  }
}

function insertItemAt(array: ArrayValue[], index: number) {
  array.splice(index + 1, 0, { type: 'text', value: '' })
}

function removeItemAt(array: ArrayValue[], index: number) {
  array.splice(index, 1)
}

/**
 * Initial function to fetch all necessary data
 */
async function fetchData() {
  loading.value = true
  await fetch()
  setting.value = toObject<ContestSetting>(options)
  settingBackup.value = toObject<ContestSetting>(options)
  loading.value = false
}

onMounted(async () => {
  await fetchData()
})
</script>
<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" class="d-flex">
        <h2 class="text--text">Fresher Contest Setting</h2>
        <v-spacer />
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
              <v-card-title> First Page </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <base-image-upload
                      v-model="setting.banner"
                      class="border border-primary"
                      :aspect-ratio="16 / 9"
                    />
                  </v-col>
                  <v-col cols="8">
                    <v-row dense>
                      <v-col cols="12">
                        <v-textarea
                          v-model="setting.details.th"
                          v-bind="inputProps"
                          label="Details [TH]"
                          rows="3"
                          auto-grow
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="setting.details.en"
                          v-bind="inputProps"
                          label="Details [EN]"
                          rows="3"
                          auto-grow
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card rounded="lg" variant="outlined" class="border">
              <v-card-title> Final message </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-textarea
                      v-model="setting.final.th"
                      v-bind="inputProps"
                      label="Final message [TH]"
                      rows="3"
                      auto-grow
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="setting.final.en"
                      v-bind="inputProps"
                      label="Final message [EN]"
                      rows="3"
                      auto-grow
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
                      label="Vote date"
                    />
                  </v-col>
                  <v-col cols="12">
                    <time-input
                      v-model="setting.dateTime.start.time"
                      v-bind="inputProps"
                      label="Vote time"
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
          <v-col
            v-for="(taglines, key) in [
              setting.taglines.th,
              setting.taglines.en,
            ]"
            :key="`tagline-${key}`"
            cols="12"
          >
            <v-card rounded="lg" variant="outlined" class="border">
              <v-card-title>
                Tag lines {{ key === 0 ? 'TH' : 'EN' }}
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row dense>
                  <v-col
                    v-for="(tag, tagIndex) in taglines"
                    :key="tagIndex"
                    cols="12"
                  >
                    <v-text-field
                      v-model="tag.value"
                      v-bind="inputProps"
                      @click:append="() => {}"
                    >
                      <template #prepend>
                        <v-avatar> {{ tagIndex + 1 }} </v-avatar>
                      </template>
                      <template #append>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          :disabled="tagIndex === 0"
                          @click.stop="removeItemAt(taglines, tagIndex)"
                        >
                          <v-icon> mdi-minus </v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          @click.stop="insertItemAt(taglines, tagIndex)"
                        >
                          <v-icon> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            v-for="(rules, key) in [setting.rules.th, setting.rules.en]"
            :key="`rule-${key}`"
            cols="12"
          >
            <v-card rounded="lg" variant="outlined" class="border">
              <v-card-title>
                How to Vote {{ key === 0 ? 'TH' : 'EN' }}</v-card-title
              >
              <v-divider />
              <v-card-text>
                <v-row dense>
                  <v-col
                    v-for="(rule, ruleIndex) in rules"
                    :key="ruleIndex"
                    cols="12"
                  >
                    <v-text-field
                      v-model="rule.value"
                      v-bind="inputProps"
                      @click:append="() => {}"
                    >
                      <template #prepend>
                        <v-avatar> {{ ruleIndex + 1 }} </v-avatar>
                      </template>
                      <template #append>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          :disabled="ruleIndex === 0"
                          @click.stop="removeItemAt(rules, ruleIndex)"
                        >
                          <v-icon> mdi-minus </v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          @click.stop="insertItemAt(rules, ruleIndex)"
                        >
                          <v-icon> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
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
