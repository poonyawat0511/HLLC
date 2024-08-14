<script setup lang="ts">
import type { VTextField, VDataTable } from 'vuetify/components'

// VModel
const dialog = defineModel({ type: Boolean, default: false })

// Props
interface Props {
  item?: Activity
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  item: undefined,
  title: 'Activity setting',
})

const roles = [
  { title: 'Admin', value: 'ADMIN' },
  { title: 'AE', value: 'AE' },
  { title: 'Lecturer', value: 'LECTURER' },
  { title: 'SMO', value: 'SMO' },
  { title: 'Sponsor', value: 'SPONSOR' },
  { title: 'Staff', value: 'STAFF' },
]

// Types
type TableProps = VDataTable['$props']
type TextFieldProps = VTextField['$props']
type MajorWithSetting = MajorEntity & { setting: ActivitySetting }

// Refs
// const form = ref<VForm | null>()
const loading = ref<boolean>(false)
const items = ref<MajorWithSetting[]>([])
const groupBy: TableProps['groupBy'] = [{ key: 'school.name.en' }]
const headers: TableProps['headers'] = [
  {
    title: '',
    key: 'data-table-group',
    width: '0px',
    align: 'center',

    sortable: false,
  },
  {
    title: 'Major',
    value: 'name.en',
    key: 'major',
    width: '30%',
    minWidth: '150px',
    maxWidth: '250px',
    cellProps: {
      class: 'text-truncate',
    },
  },
  {
    title: 'Scopes',
    value: 'setting.scopes',
    key: 'scopes',
    width: '30%',
    minWidth: '150px',
    maxWidth: '250px',
  },
  {
    title: 'Location',
    value: 'setting.location.en',
    key: 'location',
    width: '20%',
    sortable: false,
    align: 'start',
    maxWidth: '150px',
    cellProps: {
      class: 'text-truncate',
    },
  },
  {
    title: 'Activity date',
    value: 'setting.dateTime.start',
    key: 'date',
    width: '20%',
    sortable: false,
    align: 'center',
    minWidth: '150px',
  },
  {
    title: 'Period',
    value: 'setting.dateTime',
    key: 'period',
    width: '30%',
    sortable: false,
    align: 'center',
    minWidth: '200px',
  },
]

// Injects
const { $api } = useApi()
const adapter = useDate()

// Input props
const inputProps = computed(() => {
  return {
    variant: 'outlined',
    disabled: loading.value,
  } satisfies TextFieldProps
})

async function fetchMajors() {
  try {
    const response = await $api.get<ApiResponse<MajorEntity[]>>('/majors', {
      params: { includes: ['school'] },
    })
    return response.data
  } catch (error) {
    console.log('Error while getting schools', error)
  }
}

async function fetchSettings() {
  try {
    const response = await $api.get<ApiResponse<ActivitySetting[]>>(
      `/activities/${props.item?.id}/settings`
    )
    return response.data
  } catch (error) {
    console.log('Error while getting schools', error)
  }
}

async function setup() {
  loading.value = true
  form.items.value = []
  const majors = await fetchMajors()
  const settings = await fetchSettings()
  const settingMap = new Map(
    settings?.map((setting) => [setting.major, setting])
  )
  majors?.forEach((major) => {
    const setting = settingMap.get(major.id)
    if (setting) {
      Object.assign(major, { setting })
    }
  })
  items.value = majors as MajorWithSetting[]
  loading.value = false
}

watch(
  () => dialog.value,
  (value) => {
    if (value) setup()
  }
)

interface SettingModel {
  location: {
    th: string
    en: string
  }
  dateTime: {
    date?: string | Date
    start?: string
    end?: string
  }
  scopes: Roles[]
}

const MOCK_DATA: ActivitySetting = {
  location: {
    th: '',
    en: '',
  },
  dateTime: {
    start: '',
    end: '',
  },
  activity: null,
  major: null,
  scopes: ['STAFF', 'ADMIN', 'SMO'],
}

const snackbar = inject<Snackbar>('snackbar')!

const rules = {
  required(message?: string) {
    return (v: string) => !!v || message || 'Value is required'
  },
  endTime() {
    return (v: string) =>
      form.getMinutes(v) > form.getMinutes(form.model.value.dateTime.start) ||
      'End time must be after start time'
  },
  startTime() {
    return (v: string) =>
      form.getMinutes(v) < form.getMinutes(form.model.value.dateTime.end) ||
      'Start time must be before end time'
  },
}

const form = {
  dialog: ref<boolean>(false),
  model: ref<SettingModel>({
    location: {
      th: '',
      en: '',
    },
    dateTime: {
      date: undefined,
      start: undefined,
      end: undefined,
    },
    scopes: ['STAFF'],
  }),
  loading: ref<boolean>(false),
  items: ref<MajorWithSetting[]>([]),

  mockup(data?: ActivitySetting) {
    const target: SettingModel = {
      location: { th: data?.location.th ?? '', en: data?.location.en ?? '' },
      dateTime: {
        date: adapter.date(data?.dateTime.start) as Date,
        start: data?.dateTime.start
          ? adapter.format(data.dateTime.start, 'fullTime24h')
          : undefined,
        end: data?.dateTime.end
          ? adapter.format(data.dateTime.end, 'fullTime24h')
          : undefined,
      },
      scopes: data?.scopes || [],
    }
    return target
  },

  open() {
    if (this.items.value.length > 1) {
      const firstItem = this.items.value[0]
      if (
        this.items.value.every(
          (item) =>
            item.setting?.location.th === firstItem.setting?.location.th &&
            item.setting?.location.en === firstItem.setting?.location.en &&
            item.setting?.dateTime.start ===
              firstItem.setting?.dateTime.start &&
            item.setting?.dateTime.end === firstItem.setting?.dateTime.end
        )
      ) {
        this.model.value = this.mockup(firstItem.setting)
      } else {
        this.model.value = this.mockup(MOCK_DATA)
      }
    } else {
      const [major] = this.items.value
      this.model.value = this.mockup(major.setting || MOCK_DATA)
    }
    this.dialog.value = true
  },

  close() {
    this.dialog.value = false
  },

  getMinutes(time?: string) {
    if (!time || !time.includes(':')) return 0
    const [hour, minute] = time.split(':').map(Number)
    return hour * 60 + minute
  },

  getSeting() {
    const { location, dateTime, scopes } = this.model.value
    const date = adapter.date(adapter.format(dateTime.date, 'fullDate'))
    const start = adapter.setMinutes(date, this.getMinutes(dateTime.start))
    const end = adapter.setMinutes(date, this.getMinutes(dateTime.end))
    return {
      location,
      scopes,
      dateTime: {
        start: adapter.toJsDate(start).toISOString(),
        end: adapter.toJsDate(end).toISOString(),
      },
    }
  },

  async submit() {
    try {
      confirm.loading.value = true
      await Promise.all(
        form.items.value.map((major) => {
          if (!major.setting) {
            return form.create(major)
          } else {
            return form.update(major)
          }
        })
      )
      confirm.loading.value = false
      confirm.dialog.value = false
      this.dialog.value = false
    } catch (error) {
      snackbar.open((error as Error).message, 'error')
      confirm.loading.value = false
      confirm.dialog.value = false
    }
  },

  async create(major: MajorWithSetting) {
    try {
      const body: Partial<ActivitySetting> = {
        major: major.id,
        activity: props.item!.id,
        ...this.getSeting(),
      }
      const response = await $api.post<ApiResponse<ActivitySetting>>(
        '/activity-settings',
        { body }
      )
      Object.assign(major, { setting: response.data })
      return major
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(
        `Error creating a new activity setting for major "${major.name.en}", message: ${message}`
      )
    }
  },

  async update(major: MajorWithSetting) {
    try {
      const body: Partial<ActivitySetting> = this.getSeting()
      const response = await $api.put<ApiResponse<ActivitySetting>>(
        `/activity-settings/${major.setting.id}`,
        { body }
      )
      Object.assign(major, { setting: response.data })
      return major
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(
        `Error updating activity setting for major "${major.name.en}", message: ${message}`
      )
    }
  },
}

const confirm = {
  dialog: ref<boolean>(false),
  loading: ref<boolean>(false),
  message: ref<string>('Are you sure you want to save changes?'),

  open(valid: boolean) {
    if (!valid) {
      snackbar.open('Please input all valid data', 'error')
      return
    }
    this.dialog.value = true
  },

  cancel() {
    this.dialog.value = false
  },
}
</script>

<template>
  <div>
    <!-- Setting update dialog -->
    <base-form-dialog
      v-model="form.dialog.value"
      persistent
      max-width="40rem"
      scrollable
      :loading="form.loading.value"
      title="Update setting"
      @cancel="form.close()"
      @save="(valid) => confirm.open(valid)"
    >
      <v-row dense>
        <v-col cols="12">
          <v-select
            v-model="form.model.value.scopes"
            v-bind="inputProps"
            multiple
            :items="roles"
            label="Scopes"
            placeholder="Select scopes"
            hint="User roles who can scan"
            :rules="[rules.required('Scopes is required')]"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.model.value.location.th"
            v-bind="inputProps"
            label="Location (TH)"
            placeholder="Activity location in TH"
            :rules="[rules.required('Location is required')]"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.model.value.location.en"
            v-bind="inputProps"
            label="Location (EN)"
            placeholder="Activity location in EN"
            :rules="[rules.required('Location is required')]"
          />
        </v-col>
        <v-col cols="12">
          <date-input
            v-model="form.model.value.dateTime.date"
            v-bind="inputProps"
            label="Activity date"
            placeholder="Activity date"
            :rules="[rules.required('Date is required')]"
          />
        </v-col>
        <v-col cols="12" md="6">
          <time-input
            v-model="form.model.value.dateTime.start"
            v-bind="inputProps"
            label="Start time"
            :rules="[
              rules.required('Start time is required'),
              rules.startTime(),
            ]"
          />
        </v-col>
        <v-col cols="12" md="6">
          <time-input
            v-model="form.model.value.dateTime.end"
            v-bind="inputProps"
            label="End time"
            :rules="[rules.required('End time is required'), rules.endTime()]"
          />
        </v-col>
      </v-row>
    </base-form-dialog>

    <base-confirm-dialog
      v-model="confirm.dialog.value"
      :loading="confirm.loading.value"
      :title="confirm.message.value"
      @confirm="form.submit()"
      @cancel="confirm.cancel()"
    />

    <!-- Settings table dialog -->
    <v-dialog v-model="dialog" persistent scrollable max-width="60rem">
      <v-card rounded="lg" :loading="loading">
        <v-toolbar color="transparent">
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>
          <template #append>
            <v-btn
              variant="flat"
              class="mr-2"
              color="primary"
              :disabled="!form.items.value.length"
              @click="form.open()"
            >
              <v-icon icon="mdi-pencil" start /> Edit
            </v-btn>
          </template>
        </v-toolbar>
        <v-divider />
        <v-card-text class="pa-0">
          <!-- Table -->
          <v-data-table
            v-model="form.items.value"
            show-select
            return-object
            :group-by="groupBy"
            :items="items"
            :loading="loading"
            :headers="headers"
            :items-per-page="-1"
            hide-default-footer
          >
            <template
              #[`group-header`]="{
                item: group,
                toggleGroup,
                isGroupOpen,
                columns,
              }"
            >
              <tr class="bg-grey-lighten-2">
                <td :colspan="columns.length">
                  <v-btn
                    :icon="isGroupOpen(group) ? '$expand' : '$next'"
                    size="small"
                    variant="text"
                    @click="toggleGroup(group)"
                  />
                  {{ group.value }}
                </td>
              </tr>
            </template>
            <template #[`item.scopes`]="{ value: scopes }">
              <span v-for="scope in scopes" :key="scope"> {{ scope }}, </span>
            </template>
            <template #[`item.location`]="{ value }">
              <v-icon start icon="mdi-map-marker" /> {{ value ?? 'Not set' }}
            </template>
            <template #[`item.date`]="{ value }">
              <v-icon start icon="mdi-calendar" />
              <template v-if="value">
                {{ $vuetify.date.format(value, 'fullDate') }}
              </template>
              <template v-else> Not set </template>
            </template>
            <template #[`item.period`]="{ value }">
              <v-icon start icon="mdi-clock" />
              <template v-if="value">
                {{ $vuetify.date.format(value.start, 'fullTime24h') }} -
                {{ $vuetify.date.format(value.end, 'fullTime24h') }}
              </template>
              <template v-else> Not set </template>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :loading="loading" @click="dialog = false">
            Close
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
