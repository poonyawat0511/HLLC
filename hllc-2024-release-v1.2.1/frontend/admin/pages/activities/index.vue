<script setup lang="ts">
import type { VDataTable, VTextField } from 'vuetify/components'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/activities', title: 'Activities' },
  ],
})

// Injections
const { $api } = useApi()

// Type definitions
type TableProps = VDataTable['$props']

// References
const activities = ref<Activity[]>([])
const headers: TableProps['headers'] = [
  {
    title: 'Code',
    value: 'code',
    sortable: true,
    align: 'start',
    width: '10%',
    maxWidth: '100px',
    cellProps: { class: 'text-truncate' },
  },
  {
    title: 'Name',
    value: 'name.en',
    sortable: true,
    align: 'start',
    width: '30%',
    minWidth: '150px',
    maxWidth: '350px',
    cellProps: { class: 'text-truncate' },
  },
  {
    title: 'Open',
    value: 'open',
    sortable: false,
    align: 'center',
    width: '20%',
    minWidth: '180px',
  },
  {
    title: 'Progress counting',
    value: 'progress',
    sortable: false,
    align: 'center',
    width: '20%',
    minWidth: '180px',
  },
  {
    title: 'Visibility',
    value: 'show',
    sortable: false,
    align: 'center',
    width: '20%',
    minWidth: '180px',
  },
]
const loading = ref<boolean>(true)
const error = ref<boolean>(false)
const snackbar = inject<Snackbar>('snackbar')!

onMounted(async () => {
  loading.value = true
  await management.fetch()
  loading.value = false
})

// Form management
type DialogType = 'create' | 'update' | 'delete'

// Activity management object
const management = {
  async fetch() {
    try {
      const response = await $api.get<ApiResponse<Activity[]>>('/activities')
      activities.value = response.data
      return true
    } catch (err) {
      error.value = true
      console.error('Error fetching activities', err)
      return false
    }
  },
  async create(data: Activity) {
    try {
      const response = await $api.post<ApiResponse<Activity>>('/activities', {
        body: objectToFormData(data),
      })
      activities.value.push(response.data)
      snackbar.open('Created activity successfully', 'success')
      return true
    } catch (err) {
      snackbar.open(getErrorMessage(err), 'error')
      console.error('Error creating activity', err)
      return false
    }
  },
  async update(id: string, data: Partial<Activity>) {
    try {
      const response = await $api.put<ApiResponse<Activity>>(
        `/activities/${id}`,
        { body: objectToFormData(data) }
      )
      const index = activities.value.findIndex((activity) => activity.id === id)
      if (index !== -1) {
        activities.value?.splice(index, 1, response.data)
      }
      snackbar.open('Updated activity successfully', 'success')
      return true
    } catch (err) {
      snackbar.open(getErrorMessage(err), 'error')
      console.error('Error updating activity', err)
      return false
    }
  },
  async delete(data: Activity) {
    try {
      await $api.delete<ApiResponse<Activity>>(`/activities/${data.id}`)
      const index = activities.value.findIndex(
        (activity) => activity.id === data.id
      )
      if (index !== -1) {
        activities.value?.splice(index, 1)
      }
      snackbar.open('Deleted activity successfully', 'success')
      return true
    } catch (err) {
      snackbar.open(getErrorMessage(err), 'error')
      console.error('Error updating activity', err)
      return false
    }
  },
  async toggleOpen(activity: Activity) {
    return await this.update(activity.id!, { open: !activity.open })
  },
  async toggleProgress(activity: Activity) {
    return await this.update(activity.id!, { progress: !activity.progress })
  },
  async toggleShow(activity: Activity) {
    return await this.update(activity.id!, { show: !activity.show })
  },
}

const MOCK_DATA: Activity = {
  name: {
    th: '',
    en: '',
  },
  shortName: {
    th: '',
    en: '',
  },
  code: '',
  type: 0,
  description: {
    th: '',
    en: '',
  },
  shortDesc: {
    th: '',
    en: '',
  },
  banner: '',
  icon: '',
  open: true,
  progress: true,
  show: true,
}

type Locales = 'th' | 'en'
type LanguageSetting = { value: Locales; title: string }

// Form management object
const form = {
  /**
   * Binding input props for the form
   * @param initial - initial props
   */
  props(initial: VTextField['$props']) {
    return {
      density: 'compact',
      clearable: true,
      variant: 'outlined',
      rounded: 'lg',
      ...initial,
    } as Record<string, unknown>
  },

  isCompleted(lang: Locales) {
    const item = this.item.value
    return !!item.name[lang] && !!item.shortName[lang]
  },

  backup: ref<Activity>(),
  item: ref<Activity>(Object.assign({}, MOCK_DATA)),
  title: ref<string>(''),
  dialog: ref<boolean>(false),
  loading: ref<boolean>(false),
  action: ref<(valid: boolean) => void>(),
  languages: [
    { title: 'TH', value: 'th' },
    { title: 'EN', value: 'en' },
  ] as LanguageSetting[],
  tab: ref<Locales>('th'),

  open(type: DialogType, initialData?: Activity) {
    if (type == 'create') {
      this.title.value = 'Create new activity'
      this.tab.value = 'th'
      this.backup.value = JSON.parse(JSON.stringify(MOCK_DATA))
      this.item.value = JSON.parse(JSON.stringify(MOCK_DATA))
      this.action.value = (valid) => {
        if (!valid) {
          return snackbar.open('Please enter all valid information', 'error')
        }
        confirm.open('create')
      }
      this.dialog.value = true
      return
    } else if (type === 'update') {
      this.title.value = 'Update activity'
      this.tab.value = 'th'
      this.backup.value = initialData
      this.item.value = JSON.parse(JSON.stringify(initialData))
      this.action.value = (valid) => {
        if (!valid) {
          return snackbar.open('Please enter all valid information', 'error')
        }
        confirm.open('update')
      }
      this.dialog.value = true
      return
    } else {
      this.item.value = initialData!
      confirm.open('delete')
    }
  },

  close() {
    this.dialog.value = false
  },
}

const confirm = {
  dialog: ref<boolean>(false),
  loading: ref<boolean>(false),
  message: ref<string>(''),
  action: ref<() => void>(),
  open(type: DialogType) {
    if (type === 'create') {
      this.message.value = 'Are you sure you want to save the activity?'
      this.action.value = async () => {
        this.dialog.value = false
        form.loading.value = true
        const success = await management.create(form.item.value)
        form.loading.value = false
        if (success) form.close()
      }
      this.dialog.value = true
    } else if (type === 'update') {
      this.message.value = 'Are you sure you want to update the activity?'
      this.action.value = async () => {
        this.dialog.value = false
        form.loading.value = true
        const success = await management.update(
          form.backup.value?.id ?? '',
          form.item.value
        )
        form.loading.value = false
        if (success) form.close()
      }
      this.dialog.value = true
    } else {
      this.message.value = `Are you sure you want to delete the activity "${form.item.value?.name.en}"`
      this.action.value = async () => {
        this.loading.value = true
        await management.delete(form.item.value)
        this.dialog.value = false
        this.loading.value = false
      }
      this.dialog.value = true
    }
  },
  close() {
    this.dialog.value = false
  },

  toggle(type: 'show' | 'open' | 'progress', activity: Activity) {
    if (type == 'show') {
      const status = activity.show
        ? `hide activity "${activity.name.en}" from user view?`
        : `show activity "${activity.name.en}" from user view?`
      this.message.value = `Are you sure you want to ${status}`
      this.action.value = async () => {
        this.loading.value = true
        await management.toggleShow(activity)
        this.dialog.value = false
        this.loading.value = false
      }
      this.dialog.value = true
    } else if (type === 'open') {
      const status = activity.progress
        ? `disable check-in for activity "${activity.name.en}"?`
        : `allow check-in for activity "${activity.name.en}"?`
      this.message.value = `Are you sure you want to ${status}`
      this.action.value = async () => {
        this.loading.value = true
        await management.toggleOpen(activity)
        this.dialog.value = false
        this.loading.value = false
      }
      this.dialog.value = true
    } else {
      const status = activity.progress
        ? `disable progress couting for activity "${activity.name.en}"?`
        : `open progress couting for activity "${activity.name.en}"?`
      this.message.value = `Are you sure you want to ${status}`
      this.action.value = async () => {
        this.loading.value = true
        await management.toggleProgress(activity)
        this.dialog.value = false
        this.loading.value = false
      }
      this.dialog.value = true
    }
  },
}

const setting = {
  dialog: ref<boolean>(false),
  item: ref<Activity>(),
  open(item: Activity) {
    this.item.value = item
    this.dialog.value = true
  },
}

/**
 * Validation rules for text fields
 */
const rules = {
  required(message: string) {
    return (v: string) => !!v || message || 'This field is required'
  },
}
</script>

<template>
  <v-container fluid>
    <!-- Form Dialog -->
    <base-form-dialog
      v-model="form.dialog.value"
      :title="form.title.value"
      :loading="form.loading.value"
      scrollable
      max-width="50rem"
      @cancel="form.close()"
      @save="form.action.value"
    >
      <template #default="{ props: input }">
        <v-row dense>
          <!-- Code -->
          <v-col cols="12" sm="3" md="2">
            <base-image-upload
              v-model="form.item.value.icon"
              :aspect-ratio="$vuetify.display.xs ? 3 : 1"
              contain
              placeholder="Click to upload icon"
              class="mb-3 mx-auto border"
              image-class=""
              max-height="12rem"
            />
          </v-col>
          <!-- Code -->
          <v-col cols="12" sm="9" md="10">
            <base-image-upload
              v-model="form.item.value.banner"
              :aspect-ratio="16 / 9"
              contain
              placeholder="Click to upload banner"
              class="mb-3 border"
            />
          </v-col>
          <!-- Code -->
          <v-col cols="12">
            <v-text-field
              v-bind="form.props(input)"
              v-model="form.item.value.code"
              label="Activity Code"
              placeholder="EX: PRESIDENT"
              :rules="[rules.required('Activity code is required')]"
            />
          </v-col>
          <!-- Type -->
          <v-col cols="12">
            <v-select
              v-bind="form.props(input)"
              v-model="form.item.value.type"
              :clearable="false"
              label="Activity Type"
              :items="[
                { title: 'How to Live', value: 0 },
                { title: 'How to Learn', value: 1 },
              ]"
              placeholder="Select type of activity"
            />
          </v-col>
          <!-- Open -->
          <v-col cols="12">
            <v-select
              v-bind="form.props(input)"
              v-model="form.item.value.open"
              :clearable="false"
              label="Open Status"
              :prepend-inner-icon="
                form.item.value.open ? 'mdi-lock-open' : 'mdi-lock'
              "
              :items="[
                { title: 'Open', value: true },
                { title: 'Closed', value: false },
              ]"
              placeholder="Select type of activity"
            />
          </v-col>
          <!-- Progress -->
          <v-col cols="12">
            <v-select
              v-bind="form.props(input)"
              v-model="form.item.value.progress"
              :clearable="false"
              label="Progress"
              :prepend-inner-icon="
                form.item.value.progress
                  ? 'mdi-progress-check'
                  : 'mdi-progress-close'
              "
              :items="[
                { title: 'Count for progress', value: true },
                { title: 'Not count for progress', value: false },
              ]"
              placeholder="Select type of activity"
            />
          </v-col>
          <!-- Show -->
          <v-col cols="12">
            <v-select
              v-bind="form.props(input)"
              v-model="form.item.value.show"
              :clearable="false"
              label="Visibility"
              :prepend-inner-icon="
                form.item.value.show ? 'mdi-eye' : 'mdi-eye-off'
              "
              :items="[
                { title: 'Show on list', value: true },
                { title: 'Hide on list', value: false },
              ]"
              placeholder="Select activity visibility"
            />
          </v-col>
        </v-row>

        <v-divider class="my-3" />

        <!-- Multi Locales Input -->
        <v-tabs v-model="form.tab.value" color="primary">
          <v-tab
            v-for="lang in form.languages"
            :key="lang.value"
            :value="lang.value"
          >
            <v-badge
              :model-value="!form.isCompleted(lang.value)"
              dot
              color="error"
              floating
            >
              {{ lang.title }}
            </v-badge>
          </v-tab>
        </v-tabs>

        <!-- Form -->
        <v-tabs-window v-model="form.tab.value">
          <v-tabs-window-item
            v-for="lang in form.languages"
            :key="lang.value"
            :value="lang.value"
          >
            <v-row dense class="mt-5">
              <!-- Name -->
              <v-col cols="12">
                <v-text-field
                  v-bind="form.props(input)"
                  v-model="form.item.value.name[lang.value]"
                  :label="`Name (${lang.title})`"
                  :placeholder="`Activity name in ${lang.title}`"
                  :rules="[rules.required('Name is required')]"
                />
              </v-col>
              <!-- Short name -->
              <v-col cols="12">
                <v-text-field
                  v-bind="form.props(input)"
                  v-model="form.item.value.shortName[lang.value]"
                  :label="`Short Name (${lang.title})`"
                  :placeholder="`Activity short name in ${lang.title}`"
                  :rules="[rules.required('Short name is required')]"
                />
              </v-col>
              <!-- Description -->
              <v-col cols="12">
                <v-textarea
                  v-bind="form.props(input)"
                  v-model="form.item.value.description[lang.value]"
                  :label="`Description (${lang.title})`"
                  :placeholder="`Activity description in ${lang.title}`"
                  rows="3"
                  auto-grow
                />
              </v-col>
              <!-- Short description -->
              <v-col cols="12">
                <v-textarea
                  v-bind="form.props(input)"
                  v-model="form.item.value.shortDesc[lang.value]"
                  :label="`Short description (${lang.title})`"
                  :placeholder="`Activity short description in ${lang.title}`"
                  rows="2"
                  auto-grow
                />
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </template>
    </base-form-dialog>

    <!-- Confirm dialog -->
    <base-confirm-dialog
      v-model="confirm.dialog.value"
      :title="confirm.message.value"
      :loading="confirm.loading.value"
      @cancel="confirm.close()"
      @confirm="confirm.action.value"
    />

    <!-- Setting dialog -->
    <activity-setting-dialog
      v-model="setting.dialog.value"
      :title="`${setting.item.value?.name.en} Schedule`"
      :item="setting.item.value"
    />

    <!-- Header -->
    <div class="d-flex">
      <h1>HLLC Activities</h1>
      <v-spacer />
      <v-btn rounded color="primary" @click="form.open('create')">
        <v-icon start icon="mdi-plus" />
        Create
      </v-btn>
    </div>
    <!-- Table -->
    <v-card variant="outlined" class="border rounded-lg">
      <v-data-table
        :loading="loading"
        :items="activities"
        :headers="headers"
        show-expand
      >
        <template v-if="error" #no-data>
          Error while getting activities
        </template>
        <template #[`item.open`]="{ item, value }">
          <v-btn
            variant="flat"
            size="small"
            block
            :color="value ? 'success' : 'error'"
            @click="confirm.toggle('open', item)"
          >
            <v-icon :icon="value ? 'mdi-lock-open' : 'mdi-lock'" start />
            {{ value ? 'Open' : 'Closed' }}
          </v-btn>
        </template>
        <template #[`item.progress`]="{ item, value }">
          <v-btn
            variant="flat"
            size="small"
            block
            :color="value ? 'success' : 'warning'"
            @click="confirm.toggle('progress', item)"
          >
            <v-icon
              :icon="value ? 'mdi-progress-check' : 'mdi-progress-close'"
              start
            />
            {{ value ? 'Progress' : 'No progress' }}
          </v-btn>
        </template>
        <template #[`item.show`]="{ item, value }">
          <v-btn
            variant="flat"
            size="small"
            block
            :color="value ? 'success' : 'grey'"
            @click="confirm.toggle('show', item)"
          >
            <v-icon :icon="value ? 'mdi-eye' : 'mdi-eye-off'" start />
            {{ value ? 'Show' : 'Hide' }}
          </v-btn>
        </template>
        <template #expanded-row="{ columns, item: activity }">
          <tr>
            <td :colspan="columns.length">
              <v-card class="my-2 border" variant="outlined">
                <v-card-text>
                  <v-row>
                    <v-col cols="4">
                      <v-img
                        color="grey"
                        :aspect-ratio="16 / 9"
                        :src="activity.banner"
                      />
                    </v-col>
                    <v-col cols="8">
                      <!-- Activity Info -->
                      <v-card class="border" variant="outlined">
                        <v-card-title> Activity </v-card-title>
                        <v-divider />
                        <v-card-text>
                          <v-row dense>
                            <v-col cols="2">
                              <v-img
                                color="grey"
                                :aspect-ratio="1"
                                :src="activity.icon"
                              />
                            </v-col>
                            <v-col cols="10">
                              <h3>{{ activity.name?.en || 'Activity' }}</h3>
                              <p>
                                {{
                                  activity.description?.en || 'No description'
                                }}
                              </p>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider />
                <!-- Actions -->
                <v-card-actions>
                  <v-btn @click="() => setting.open(activity)">
                    <v-icon start icon="mdi-calendar" /> Major Schedule
                  </v-btn>
                  <v-spacer />
                  <v-btn @click="() => form.open('update', activity)">
                    <v-icon start icon="mdi-pencil" /> Edit
                  </v-btn>
                  <v-btn
                    color="error"
                    @click="() => form.open('delete', activity)"
                  >
                    <v-icon start icon="mdi-delete" /> Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<style></style>
