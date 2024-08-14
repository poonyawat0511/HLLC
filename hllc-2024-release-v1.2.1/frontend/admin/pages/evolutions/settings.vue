<script setup lang="ts">
import type { VTextField, VForm } from 'vuetify/components'

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/evolutions', title: 'Evolution' },
    { to: '/evolutions/settings', title: 'Evolution Setting' },
  ],
})

const images = ['mission', 'item', 'secret'] as const
const levels = ['level1', 'level2', 'level3'] as const

type Images = (typeof images)[number]
type Level = (typeof levels)[number]

type EvolutionSetting = {
  [K in Level]?: number | null
} & {
  images: {
    [K in Images]?: File | string | null
  }
}

const option: Record<string, SettingOptions[]> = {
  level: [
    {
      key: 'level1',
      path: 'level1',
      type: 'number',
    },
    {
      key: 'level2',
      path: 'level2',
      type: 'number',
    },
    {
      key: 'level3',
      path: 'level3',
      type: 'number',
    },
  ],
  images: [
    {
      key: 'image:mission',
      path: 'images.mission',
      type: 'image',
    },
    {
      key: 'image:item',
      path: 'images.item',
      type: 'image',
    },
    {
      key: 'image:secret',
      path: 'images.secret',
      type: 'image',
    },
  ],
}

const setting = ref<EvolutionSetting>({
  images: {
    mission: undefined,
    secret: undefined,
    item: undefined,
  },
})
const settingBackup = ref<EvolutionSetting>({
  images: {
    mission: undefined,
    secret: undefined,
    item: undefined,
  },
})
const loading = ref(false)
const saving = reactive<Record<string, boolean>>({})
const itemsCount = ref(0)
const formLevel = ref<VForm | null>(null)
const formImage = ref<VForm | null>(null)

const { fetch, toObject, compare, update, toSettings } = useSetting('evolution')
const { $api } = useApi()
const snackbar = inject<Snackbar>('snackbar')

const countItems = async () => {
  try {
    const response = await $api.get<ApiResponse<Activity[]>>('/items')
    itemsCount.value = response.data.length
  } catch (error) {
    console.error(error)
    itemsCount.value = 0
  }
}

const rules = computed<{ [K in Level]: VTextField['$props']['rules'] }>(() => {
  const max = {
    level1: setting.value.level2,
    level2: setting.value.level3,
    level3: itemsCount.value,
  }
  const check = (level: Level, suffix: string) => (v: number) => {
    return !max[level]
      ? true
      : v < max[level] || `Value must be less than ${suffix}`
  }
  return {
    level1: [check('level1', 'Level 2')],
    level2: [check('level2', 'Level 3')],
    level3: [check('level3', 'Items Count')],
  }
})

const activitySelect = computed(() => {
  const items = Array(itemsCount.value || 1)
    .fill(0)
    .map((_, i) => ({ title: `${i + 1} items`, value: i + 1 }))
  return items
})

function splitSelect(min: number, max: number) {
  return activitySelect.value.slice(min, max - 1)
}

const select = computed<Record<Level, { title: string; value: number }[]>>(
  () => ({
    level1: splitSelect(0, setting.value.level2 || itemsCount.value + 1),
    level2: splitSelect(
      setting.value.level1 || 0,
      setting.value.level3 || itemsCount.value + 1
    ),
    level3: splitSelect(
      setting.value.level2 || setting.value.level1 || 0,
      itemsCount.value + 1
    ),
  })
)

const isChanges = (type: keyof typeof option) => {
  return !compare(option[type], setting.value, settingBackup.value)
}

const inputProps = computed(() => {
  return {
    variant: 'outlined',
    density: 'compact',
  } satisfies VTextField['$props']
})

function discardChanges(type: keyof typeof option) {
  const item = option[type].reduce((prev, curr) => {
    assignObject(
      prev,
      curr.path,
      getObjectValue(settingBackup.value, curr.path)
    )
    return curr
  }, {})
  setting.value = JSON.parse(
    JSON.stringify({ ...settingBackup.value, ...item })
  )
}

async function saveChanges(type: keyof typeof option) {
  try {
    switch (type) {
      case 'images': {
        const { valid } = await formImage.value!.validate()
        if (!valid) return
        break
      }
      case 'level': {
        const { valid } = await formLevel.value!.validate()
        if (!valid) return
        break
      }
    }
    saving[type] = true
    await update(toSettings(setting.value, option[type]))
    setting.value = toObject(Object.values(option).flatMap((v) => v))
    settingBackup.value = toObject(Object.values(option).flatMap((v) => v))
    snackbar?.open('Updated all setting successfully', 'success')
  } catch (error) {
    console.log('error saving changes', error)
    const message = getErrorMessage(error)
    snackbar?.open(message, 'error')
  } finally {
    saving[type] = false
  }
}

onMounted(async () => {
  loading.value = true
  await fetch()
  await countItems()
  setting.value = toObject(Object.values(option).flatMap((v) => v))
  settingBackup.value = toObject(Object.values(option).flatMap((v) => v))
  loading.value = false
})
</script>

<template>
  <v-container fluid>
    <template v-if="loading">
      <v-card rounded="lg" class="border" variant="outlined">
        <v-card-text>
          <v-progress-circular indeterminate />
          Loading...
        </v-card-text>
      </v-card>
    </template>
    <template v-else>
      <v-row dense>
        <!-- Images -->
        <v-col cols="12">
          <h2 class="text--text">Evolution Setting</h2>
        </v-col>
        <v-col cols="12">
          <v-card rounded="lg" variant="outlined" class="border">
            <v-card-title> Images </v-card-title>
            <v-divider />
            <v-card-text>
              <v-form ref="formImage">
                <v-row dense>
                  <v-col v-for="key in images" :key="key" cols="3">
                    <span> {{ key }} </span>
                    <base-image-upload
                      v-model="setting.images[key]"
                      class="border"
                      :aspect-ratio="1"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="saving['images'] || !isChanges('images')"
                color="error"
                @click="discardChanges('images')"
              >
                <v-icon icon="mdi-cancel" start />
                Discard Changes
              </v-btn>
              <v-btn
                :loading="saving['images']"
                :disabled="!isChanges('images')"
                color="success"
                @click="saveChanges('images')"
              >
                <v-icon icon="mdi-content-save" start />
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <!-- Level -->
        <v-col cols="12">
          <v-card rounded="lg" variant="outlined" class="border">
            <v-card-title class="d-flex">
              Upgrade to Another Level
              <v-spacer />
              <v-btn variant="flat" color="primary" to="/items">
                <v-icon icon="mdi-open-in-new" start /> Items:
                {{ itemsCount }}
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-form ref="formLevel">
                <v-row dense>
                  <template v-for="level in levels" :key="level">
                    <v-col cols="3"> {{ level }} </v-col>
                    <v-col cols="9">
                      <v-select
                        v-model="setting[level]"
                        v-bind="inputProps"
                        :items="select[level]"
                        :rules="rules[level]"
                        hide-spin-buttons
                        type="number"
                      />
                    </v-col>
                  </template>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="saving['level'] || !isChanges('level')"
                color="error"
                @click="discardChanges('level')"
              >
                <v-icon icon="mdi-cancel" start />
                Discard Changes
              </v-btn>
              <v-btn
                :loading="saving['level']"
                :disabled="!isChanges('level')"
                color="success"
                @click="saveChanges('level')"
              >
                <v-icon icon="mdi-content-save" start />
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
