<script setup lang="ts">
import { VTextField } from 'vuetify/components'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/sponsors', title: 'System Sponsor' },
    { to: '/sponsors/settings', title: 'Sponsor Settings' },
  ],
})

// Injections
const { compare, fetch, toObject, update, toSettings } = useSetting('sponsor')
const snackbar = inject<Snackbar>('snackbar')

// Refs
const loading = ref(false)
const saving = ref(false)

interface SponsorSetting {
  ruleUses: {
    th: ArrayValue[]
    en: ArrayValue[]
  }
  ruleGets: {
    th: ArrayValue[]
    en: ArrayValue[]
  }
  note: {
    th: string
    en: string
  }
  dateTime: {
    start: { date?: Date | null | string; time?: string | null }
    end: { date?: Date | null | string; time?: string | null }
  }
}

const options: SettingOptions[] = [
  {
    key: 'howToGetVoucher:th',
    path: 'ruleGets.th',
    type: 'array',
  },
  {
    key: 'howToGetVoucher:en',
    path: 'ruleGets.en',
    type: 'array',
  },
  {
    key: 'howToUseVoucher:th',
    path: 'ruleUses.th',
    type: 'array',
  },
  {
    key: 'howToUseVoucher:en',
    path: 'ruleUses.en',
    type: 'array',
  },
  {
    key: 'note:th',
    path: 'note.th',
    type: 'text',
  },
  {
    key: 'note:en',
    path: 'note.en',
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

const setting = ref<SponsorSetting>({
  ruleGets: {
    th: [],
    en: [],
  },
  ruleUses: {
    th: [],
    en: [],
  },
  note: {
    th: '',
    en: '',
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
const settingBackup = ref<SponsorSetting>({
  ruleGets: {
    th: [],
    en: [],
  },
  ruleUses: {
    th: [],
    en: [],
  },
  note: {
    th: '',
    en: '',
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
    setting.value = toObject<SponsorSetting>(options)
    settingBackup.value = toObject<SponsorSetting>(options)
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
  setting.value = toObject<SponsorSetting>(options)
  settingBackup.value = toObject<SponsorSetting>(options)
  loading.value = false
}

onMounted(async () => {
  await fetchData()
})
</script>
<template>
  <v-container fluid>
    <v-row dene>
      <v-col cols="12" md="7" sm="6">
        <h2>Sponsor Setting</h2>
      </v-col>
      <v-col cols="12" md="5" sm="6" class="d-flex justify-end">
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
          <v-col cols="12">
            <v-card rounded="lg" variant="outlined" class="border">
              <v-card-title> Note </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-textarea
                      v-model="setting.note.th"
                      v-bind="inputProps"
                      label="Note scan [TH]"
                      rows="3"
                      auto-grow
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="setting.note.en"
                      v-bind="inputProps"
                      label="Note scan [EN]"
                      rows="3"
                      auto-grow
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            v-for="(rules, key) in [setting.ruleGets.th, setting.ruleGets.en]"
            :key="`rule-${key}`"
            cols="12"
          >
            <v-card rounded="lg" variant="outlined" class="border">
              <v-card-title>
                How to get Voucher {{ key === 0 ? 'TH' : 'EN' }}</v-card-title
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
          <v-col
            v-for="(rules, key) in [setting.ruleUses.th, setting.ruleUses.en]"
            :key="`rule-${key}`"
            cols="12"
          >
            <v-card rounded="lg" variant="outlined" class="border">
              <v-card-title>
                How to use Voucher {{ key === 0 ? 'TH' : 'EN' }}</v-card-title
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
