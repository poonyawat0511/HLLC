<script setup lang="ts">
import type { VDataTable, VTextField } from 'vuetify/components'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/evolutions', title: 'Evolutions' },
    { to: '/evolutions/items', title: 'Items' },
  ],
})

// Injections
const { $api } = useApi()

// Type definitions
type TableProps = VDataTable['$props']

interface ActivityWithItem extends Activity {
  item: Item | null
}

// References
const items = ref<ActivityWithItem[]>([])
const headers: TableProps['headers'] = [
  {
    title: 'Activity',
    value: 'name.en',
    key: 'activity',
    sortable: true,
    align: 'start',
    width: '10%',
    maxWidth: '100px',
    cellProps: { class: 'text-truncate' },
  },
  {
    title: 'Image',
    value: 'item.image',
    key: 'image',
    sortable: false,
    align: 'center',
    width: '10%',
    minWidth: '100px',
  },
  {
    title: 'Name',
    value: 'item.name.en',
    key: 'name',
    sortable: true,
    align: 'center',
    width: '15%',
    minWidth: '150px',
    cellProps: { class: 'text-truncate' },
  },
  {
    title: 'Description',
    value: 'item.description.en',
    key: 'description',
    align: 'center',
    width: '20%',
    minWidth: '180px',
    sortable: true,
  },
  {
    title: 'Actions',
    value: 'actions',
    sortable: false,
    align: 'center',
    width: '10%',
    minWidth: '100px',
    cellProps: { class: 'text-truncate' },
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

// Item management object
const management = {
  async fetchActivities() {
    try {
      const response = await $api.get<ApiResponse<Activity[]>>('/activities')
      return response.data
    } catch (error) {
      console.error('Fetch activities failed', error)
      return []
    }
  },

  async fetch() {
    try {
      // Fetch activities
      const activityItems = await this.fetchActivities()
      const response = await $api.get<ApiResponse<Item[]>>('/items', {
        params: { includes: ['activity'] },
      })
      const itemMap = new Map(
        response.data.map((item) => [item.activity, item])
      )
      items.value = activityItems.map((activity) =>
        Object.assign(activity, { item: itemMap.get(activity.id!) ?? null })
      )
    } catch (err) {
      error.value = true
      console.error('Error fetching items', err)
      return false
    }
  },
  async create(data: Item) {
    try {
      const response = await $api.post<ApiResponse<Item>>('/items', {
        body: objectToFormData(data),
      })
      const activity = items.value.find(
        (activity) => activity.id === response.data.activity
      )
      if (activity) {
        activity.item = response.data
      }
      snackbar.open('Created item successfully', 'success')
      return true
    } catch (err) {
      snackbar.open(getErrorMessage(err), 'error')
      console.error('Error creating item', err)
      return false
    }
  },
  async update(id: string, data: Partial<Item>) {
    try {
      const response = await $api.put<ApiResponse<Item>>(`/items/${id}`, {
        body: objectToFormData(data),
      })
      const activity = items.value.find(
        (activity) => activity.id === response.data.activity
      )
      if (activity) {
        activity.item = response.data
      }
      snackbar.open('Updated item successfully', 'success')
      return true
    } catch (err) {
      snackbar.open(getErrorMessage(err), 'error')
      console.error('Error updating item', err)
      return false
    }
  },
  async delete(data: Item) {
    try {
      await $api.delete<ApiResponse<Item>>(`/items/${data.id}`)
      const activity = items.value.find(
        (activity) => activity.id === data.activity
      )
      if (activity) {
        activity.item = null
      }
      snackbar.open('Deleted item successfully', 'success')
      return true
    } catch (err) {
      snackbar.open(getErrorMessage(err), 'error')
      console.error('Error updating item', err)
      return false
    }
  },
}

const MOCK_DATA: Item = {
  name: { th: '', en: '' },
  description: { th: '', en: '' },
  image: null,
  activity: '',
}

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
    } satisfies VTextField['$props']
  },

  backup: ref<Item>(),
  item: ref<Item>(Object.assign({}, MOCK_DATA)),
  title: ref<string>(''),
  dialog: ref<boolean>(false),
  loading: ref<boolean>(false),
  action: ref<(valid: boolean) => void>(),

  open(type: DialogType, activity: ActivityWithItem) {
    if (type == 'create') {
      this.title.value = 'Create new item'
      this.backup.value = JSON.parse(
        JSON.stringify({ ...MOCK_DATA, activity: activity.id })
      )
      this.item.value = JSON.parse(
        JSON.stringify({ ...MOCK_DATA, activity: activity.id })
      )
      this.action.value = (valid) => {
        if (!valid) {
          return snackbar.open('Please enter all valid information', 'error')
        }
        confirm.open('create')
      }
      this.dialog.value = true
      return
    } else if (type === 'update') {
      this.backup.value = activity.item!
      this.item.value = JSON.parse(JSON.stringify(activity.item))
      this.title.value = 'Update item'
      this.action.value = (valid) => {
        if (!valid) {
          return snackbar.open('Please enter all valid information', 'error')
        }
        confirm.open('update')
      }
      this.dialog.value = true
      return
    } else {
      this.item.value = activity.item!
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
      this.message.value = 'Are you sure you want to save the item?'
      this.action.value = async () => {
        this.dialog.value = false
        form.loading.value = true
        const success = await management.create(form.item.value)
        form.loading.value = false
        if (success) form.close()
      }
      this.dialog.value = true
    } else if (type === 'update') {
      this.message.value = 'Are you sure you want to update the item?'
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
      this.message.value = `Are you sure you want to delete the item "${form.item.value?.name.en}"`
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
        <v-row>
          <!-- Image -->
          <v-col cols="12" md="4">
            <base-image-upload
              v-model="form.item.value.image"
              :aspect-ratio="1"
              placeholder="Upload active image"
              class="mb-5 border"
            />
          </v-col>
          <v-col cols="12" md="8">
            <v-row dense>
              <!-- Activity -->
              <v-col cols="12">
                <v-select
                  :model-value="form.item.value.activity"
                  v-bind="form.props({ ...input, clearable: false })"
                  :items="items"
                  item-title="name.en"
                  item-value="id"
                  readonly
                  label="Activity"
                />
              </v-col>
              <!-- Name TH -->
              <v-col cols="12">
                <v-text-field
                  v-model="form.item.value.name.th"
                  v-bind="form.props(input)"
                  :rules="[rules.required('Name is required')]"
                  label="Name [TH]"
                />
              </v-col>
              <!-- Name EN -->
              <v-col cols="12">
                <v-text-field
                  v-model="form.item.value.name.en"
                  v-bind="form.props(input)"
                  :rules="[rules.required('Name is required')]"
                  label="Name [EN]"
                />
              </v-col>
              <!-- Description TH -->
              <v-col cols="12">
                <v-textarea
                  v-model="form.item.value.description.th"
                  v-bind="form.props(input)"
                  auto-grow
                  rows="2"
                  label="Description [TH]"
                />
              </v-col>
              <!-- Description EN -->
              <v-col cols="12">
                <v-textarea
                  v-model="form.item.value.description.en"
                  v-bind="form.props(input)"
                  auto-grow
                  rows="2"
                  label="Description [EN]"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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

    <!-- Header -->
    <div class="d-flex">
      <h1>Evolution Items</h1>
      <v-spacer />
    </div>
    <!-- Table -->
    <v-card variant="outlined" class="border rounded-lg">
      <v-data-table :loading="loading" :items="items" :headers="headers">
        <template #[`item.image`]="{ item: activity, value }">
          <template v-if="activity.item">
            <v-img max-height="7rem" :src="value" />
          </template>
          <template v-else> No item </template>
        </template>
        <template #[`item.name`]="{ item: activity, value }">
          <template v-if="activity.item"> {{ value }} </template>
          <template v-else> No item </template>
        </template>
        <template #[`item.description`]="{ item: activity, value }">
          <template v-if="activity.item">
            {{ value || 'No description' }}
          </template>
          <template v-else> No item </template>
        </template>
        <template #[`item.actions`]="{ item: activity }">
          <template v-if="activity.item">
            <v-icon
              icon="mdi-pencil"
              start
              @click="() => form.open('update', activity)"
            />
            <v-icon
              icon="mdi-delete"
              color="error"
              @click="() => form.open('delete', activity)"
            />
          </template>
          <template v-else>
            <v-icon
              icon="mdi-plus-circle"
              @click="() => form.open('create', activity)"
            />
          </template>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
