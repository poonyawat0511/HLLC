<script setup lang="ts">
import type { SchoolWithTheme } from './index.vue'
import { FetchError } from 'ofetch'

// Injections
const route = useRoute()
const { $api } = useApi()
const { updateTheme } = useColors()

// Constraints
const THEME: string = 'custom'
const SCHOOL_STATE = 'schools:theme'
const ASYNC_DATA_KEY = `theme:${route.params.id}`
const SIDEBAR_MENUS: UserMenuItem[] = [
  {
    title: 'Menu 1',
    to: '#',
    icon: 'mdi-home',
    badge: false,
  },
  {
    title: 'Menu 2',
    to: '#',
    icon: 'mdi-home',
    badge: false,
  },
]
const BOTTOM_MENUS: UserMenuItem[] = [
  {
    title: 'Menu 1',
    to: '#',
    icon: 'mdi-home',
    badge: false,
  },
  {
    title: 'Menu 2',
    to: '#',
    icon: 'mdi-qrcode',
    badge: false,
  },
  {
    title: 'Menu 3',
    to: '#',
    icon: 'mdi-account',
    badge: false,
  },
]
const EXPANSION_MENUS = [
  'backpack',
  'contest',
  'lamduan',
  'khantoke',
  'community',
  'question',
]
const PROFILE_MENUS = ['username', 'studentId', 'school', 'major']

interface ColorState {
  title: string
  keys: string[]
  isChanged: boolean
}

// Model References
const schools = useState<SchoolWithTheme[]>(SCHOOL_STATE, () => [])
const colors = reactive<Record<string, string>>({})
const colorsBackup = reactive<Record<string, string>>({})
const assets = reactive<Record<string, File | string | null>>({})
const assetsBackup = reactive<Record<string, string>>({})
const colorState = reactive<Record<string, ColorState>>({
  general: {
    title: 'General',
    keys: ['primary', 'secondary', 'success', 'warning', 'error'],
    isChanged: false,
  },
  sidebar: {
    title: 'Sidebar Navigation',
    keys: [
      'sidebar-bg',
      'sidebar-icon',
      'sidebar-icon-active',
      'sidebar-text',
      'sidebar-text-active',
    ],
    isChanged: false,
  },
  bottom: {
    title: 'Bottom Navigation',
    keys: [
      'bottom-bg',
      'bottom-icon',
      'bottom-icon-active',
      'bottom-text',
      'bottom-text-active',
      'bottom-center-bg',
      'bottom-center-icon',
    ],
    isChanged: false,
  },
  card: {
    title: 'Card and Typography',
    keys: ['card-bg', 'card-surface', 'title', 'subtitle', 'content'],
    isChanged: false,
  },
  dialog: {
    title: 'Dialog',
    keys: ['dialog-surface'],
    isChanged: false,
  },
  evolution: {
    title: 'Evolution',
    keys: [
      'evolution-menu',
      'evolution-text-menu',
      'evolution-card',
      'evolution-text-card',
    ],
    isChanged: false,
  },
  progress: {
    title: 'Progress',
    keys: [
      'progress-gradient-1',
      'progress-gradient-2',
      'progress-gradient-3',
      'progress-gradient-4',
      'progress-gradient-5',
    ],
    isChanged: false,
  },
})

const background = computed(() => {
  if (import.meta.client && assets['background'] instanceof File) {
    const url = URL.createObjectURL(assets['background'])
    return `url('${url}')`
  }
  const image = assets['background'] || '~/assets/images/castle.jpg'
  return `url('${image}')`
})

/**
 * A function to check state of the color is changed or not
 * @param colorState A state of color to check
 */
function checkColorState(colorState: ColorState) {
  colorState.isChanged = !colorState.keys.every(
    (key) => colors[key] === colorsBackup[key]
  )
}

/**
 * A function to discard changes of state colors
 * @param colorState A state of color to discard changes
 */
function discardColorChanges(colorState: ColorState) {
  colorState.keys.forEach((key) => {
    colors[key] = colorsBackup[key]
  })
  colorState.isChanged = false
}

/**
 * A function to save changes of state colors to database
 * @param colorState  A state of color to save changes
 */
async function saveColorChanges(colorState: ColorState) {
  try {
    const updateData = Object.fromEntries(
      colorState.keys.map((key) => [key, colors[key]])
    )
    await $api.put<ApiResponse<ThemeEntity>>(
      `/themes/${school.value?.theme?.id}`,
      { body: { colors: updateData } }
    )
    colorState.keys.forEach((key) => {
      colorsBackup[key] = colors[key]
    })
    colorState.isChanged = false
  } catch (error) {
    console.error(error)
  }
}

/**
 * A function to check the assets is changed or not
 * @param key key of the asset
 */
function isAssetChanges(key: string) {
  return assets[key] !== assetsBackup[key]
}

/**
 * A function to discard changes of assets by key
 * @param key key of the asset
 */
function discardAssetChanges(key: string) {
  assets[key] = assetsBackup[key]
}

/**
 * A function to save changes of the asset by key
 * @param key key of the asset
 */
async function saveAssetChanges(key: string) {
  try {
    const body = objectToFormData({ assets: { [key]: assets[key] } })
    const response = await $api.put<ApiResponse<ThemeEntity>>(
      `/themes/${school.value?.theme?.id}`,
      { body }
    )
    assetsBackup[key] = response.data.assets?.[key]
    Object.assign(assets, {}, { [key]: assetsBackup[key] })
  } catch (error) {
    console.error(error)
  }
}

/**
 * A function that get school by params id
 */
async function findSchool(): Promise<SchoolWithTheme | undefined> {
  try {
    const response = await $api.get<ApiResponse<SchoolEntity>>(
      `/schools/${route.params.id}`
    )
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * A function to get thmems of school
 */
async function fetchSchoolTheme(): Promise<ThemeEntity | undefined> {
  // Check if the theme is already existing
  const theme = await (async () => {
    try {
      const response = await $api.get<ApiResponse<ThemeEntity>>(
        `/schools/${route.params.id}/theme`
      )
      return response.data
    } catch (error) {
      console.error(error)
      if (error instanceof FetchError && error.statusCode == 404) return
      throw error
    }
  })()

  if (theme) return theme

  // Create new theme if not already existing
  try {
    const response = await $api.post<ApiResponse<ThemeEntity>>('/themes', {
      body: { school: route.params.id, assets: {}, colors: {} } as ThemeEntity,
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const {
  data: school,
  status,
  error,
} = await useAsyncData(ASYNC_DATA_KEY, async () => {
  const school = await (async () => {
    // Try to get school from local state
    if (schools.value.length) {
      const school = schools.value.find(
        (school) => school.id === route.params.id
      )
      // Return if school exits on state
      if (school) return school
    }
    // Try to get school if it is not in state
    return await findSchool()
  })()

  //  Go to page not found if school is not found from api
  if (!school?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  // Find theme and assign to the school
  const theme = await fetchSchoolTheme()

  // Set theme
  school.theme = {
    id: theme?.id,
    assets: theme?.assets ?? {},
    colors: theme?.colors ?? {},
  }

  return school
})

// Go to error if fetch error
if (status.value === 'error') {
  showError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.statusMessage,
  })
}

nextTick(() => {
  // update breadcrumbs after school is fetched
  route.meta.breadcrumbs = [
    {
      title: 'Home',
      to: '/',
    },
    { title: 'Schools Theme', to: '/themes' },
    { title: school?.value?.name.en ?? 'school', to: route.fullPath },
  ]

  // Assign school color to ref
  Object.assign(colors, {}, school.value!.theme!.colors)
  Object.assign(colorsBackup, {}, colors)

  // Assign school assets to ref
  Object.assign(assets, {}, school.value!.theme!.assets)
  Object.assign(assetsBackup, {}, assets)

  // Watch change of color and deeply changes in theme
  watch(
    () => colors,
    (v) => {
      updateTheme(THEME, v)
    },
    { immediate: true, deep: true }
  )
})
</script>

<template>
  <client-only>
    <v-container fluid>
      <v-row dense>
        <v-col cols="12">
          <h1>Theme of school {{ school?.name.en }}</h1>
          <v-divider />
        </v-col>
        <v-col cols="12">
          <h2>Assets</h2>
          <v-divider />
        </v-col>
        <v-col cols="12" class="d-flex">
          <h3>background</h3>
          <v-spacer />
          <v-btn
            variant="text"
            color="error"
            :disabled="!isAssetChanges('background')"
            @click="discardAssetChanges('background')"
          >
            <v-icon icon="mdi-cancel" start /> Discard changes
          </v-btn>
          <v-btn
            variant="text"
            color="success"
            :disabled="!isAssetChanges('background')"
            @click="saveAssetChanges('background')"
          >
            <v-icon icon="mdi-content-save" start /> save
          </v-btn>
        </v-col>
        <v-col cols="12">
          <base-image-upload
            v-model="assets['background']"
            class="border"
            :aspect-ratio="20 / 9"
          />
        </v-col>
        <v-col cols="12">
          <h2>Expanstion menu</h2>
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-row dense>
            <v-col v-for="menu in EXPANSION_MENUS" :key="menu" cols="12" md="3">
              <h3>{{ menu }}</h3>
              <div>
                <base-image-upload
                  v-model="assets[menu]"
                  class="border"
                  :aspect-ratio="1"
                />
              </div>
              <div class="d-flex">
                <v-btn
                  variant="text"
                  color="error"
                  :disabled="!isAssetChanges(menu)"
                  @click="discardAssetChanges(menu)"
                >
                  <v-icon icon="mdi-cancel" start /> Discard changes
                </v-btn>
                <v-btn
                  variant="text"
                  color="success"
                  :disabled="!isAssetChanges(menu)"
                  @click="saveAssetChanges(menu)"
                >
                  <v-icon icon="mdi-content-save" start /> save
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <h2>Profile</h2>
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-row dense>
            <v-col v-for="menu in PROFILE_MENUS" :key="menu" cols="12" md="3">
              <h3>{{ menu }}</h3>
              <div cols="12">
                <base-image-upload
                  v-model="assets[menu]"
                  class="border"
                  :aspect-ratio="1"
                />
              </div>
              <div class="d-flex">
                <v-btn
                  variant="text"
                  color="error"
                  :disabled="!isAssetChanges(menu)"
                  @click="discardAssetChanges(menu)"
                >
                  <v-icon icon="mdi-cancel" start /> Discard changes
                </v-btn>
                <v-btn
                  variant="text"
                  color="success"
                  :disabled="!isAssetChanges(menu)"
                  @click="saveAssetChanges(menu)"
                >
                  <v-icon icon="mdi-content-save" start /> save
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <h2>Colors</h2>
          <v-divider />
        </v-col>
        <v-col cols="12">
          <color-setting-card
            v-model="colors"
            :keys="colorState.general.keys"
            class="border"
            variant="outlined"
            content-class="d-flex flex-column align-center justify-center pa-3"
            area-color="white"
            :is-changed="colorState.general.isChanged"
            :title="colorState.general.title"
            @update="checkColorState(colorState.general)"
            @click:discard="discardColorChanges(colorState.general)"
            @click:save="saveColorChanges(colorState.general)"
          >
            <template #default="{ keys }">
              <v-btn
                v-for="key in keys"
                :key="key"
                flat
                :color="key"
                :theme="THEME"
                width="100%"
                class="my-1"
              >
                {{ key }}
              </v-btn>
            </template>
          </color-setting-card>
        </v-col>
        <v-col cols="12">
          <color-setting-card
            v-model="colors"
            :keys="colorState.sidebar.keys"
            class="border"
            variant="outlined"
            content-class="home-bg"
            area-color="transparent"
            :is-changed="colorState.sidebar.isChanged"
            :title="colorState.sidebar.title"
            @update="checkColorState(colorState.sidebar)"
            @click:discard="discardColorChanges(colorState.sidebar)"
            @click:save="saveColorChanges(colorState.sidebar)"
          >
            <user-sidebar-navigation
              style="width: 80%; height: 100%"
              class="rounded-ts-md rounded-bs-md overflow-hidden"
              :theme="THEME"
              :menus="SIDEBAR_MENUS"
              :color="colors['sidebar-bg']"
              :icon-color="colors['sidebar-icon']"
              :icon-active-color="colors['sidebar-icon-active']"
              content-class="text-sidebar-text"
              active-class="text-sidebar-text-active"
            />
          </color-setting-card>
        </v-col>
        <v-col cols="12">
          <color-setting-card
            v-model="colors"
            :keys="colorState.bottom.keys"
            class="border"
            variant="outlined"
            content-class="home-bg d-flex flex-column justify-end overflow-hidden"
            area-color="transparent"
            :is-changed="colorState.bottom.isChanged"
            :title="colorState.bottom.title"
            @update="checkColorState(colorState.bottom)"
            @click:discard="discardColorChanges(colorState.bottom)"
            @click:save="saveColorChanges(colorState.bottom)"
          >
            <user-bottom-navigation
              :theme="THEME"
              :menus="BOTTOM_MENUS"
              :color="colors['bottom-bg']"
              :icon-color="colors['bottom-icon']"
              :icon-active-color="colors['bottom-icon-active']"
              :center-bg="colors['bottom-center-bg']"
              :center-icon="colors['bottom-center-icon']"
              content-class="text-bottom-text"
              active-class="text-bottom-text-active"
            />
          </color-setting-card>
        </v-col>
        <v-col cols="12">
          <color-setting-card
            v-model="colors"
            :keys="colorState.card.keys"
            class="border"
            variant="outlined"
            content-class="home-bg bg-blur d-flex flex-column justify-center overflow-hidden pa-3"
            area-color="transparent"
            :is-changed="colorState.card.isChanged"
            :title="colorState.card.title"
            @update="checkColorState(colorState.card)"
            @click:discard="discardColorChanges(colorState.card)"
            @click:save="saveColorChanges(colorState.card)"
          >
            <v-card
              :theme="THEME"
              :color="colors['card-bg']"
              width="100%"
              class="pa-10 mx-auto"
            >
              <v-card
                width="100%"
                height="auto"
                class="mx-auto"
                :color="colors['card-surface']"
              >
                <v-card-title class="text-title"> Title </v-card-title>
                <v-card-subtitle class="text-subtitle">
                  subtitle
                </v-card-subtitle>
                <v-card-text class="text-content"> Content </v-card-text>
              </v-card>
            </v-card>
          </color-setting-card>
        </v-col>
        <v-col cols="12">
          <color-setting-card
            v-model="colors"
            :keys="colorState.dialog.keys"
            class="border"
            variant="outlined"
            content-class="home-bg bg-blur d-flex flex-column justify-center overflow-hidden pa-3"
            area-color="transparent"
            :is-changed="colorState.dialog.isChanged"
            :title="colorState.dialog.title"
            @update="checkColorState(colorState.dialog)"
            @click:discard="discardColorChanges(colorState.dialog)"
            @click:save="saveColorChanges(colorState.dialog)"
          >
            <v-card
              :theme="THEME"
              width="100%"
              height="auto"
              class="mx-auto"
              :color="colors['dialog-surface']"
            >
              <v-card-title class="text-title"> Dialog </v-card-title>
              <v-card-text class="text-content"> content </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" variant="elevated"> Action </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </color-setting-card>
        </v-col>
        <v-col cols="12">
          <color-setting-card
            v-model="colors"
            :keys="colorState.evolution.keys"
            class="border"
            variant="outlined"
            content-class="home-bg bg-blur d-flex flex-column justify-center overflow-hidden pa-3"
            area-color="transparent"
            :is-changed="colorState.evolution.isChanged"
            :title="colorState.evolution.title"
            @update="checkColorState(colorState.evolution)"
            @click:discard="discardColorChanges(colorState.evolution)"
            @click:save="saveColorChanges(colorState.evolution)"
          >
            <div class="d-flex justify-end mb-4">
              <v-card
                :theme="THEME"
                width="25%"
                height="auto"
                :color="colors['evolution-menu']"
              >
                <v-card-title class="text-evolution-text-menu">
                  menu
                </v-card-title>
              </v-card>
            </div>
            <v-card
              :theme="THEME"
              width="100%"
              height="auto"
              class="mx-auto"
              :color="colors['evolution-card']"
            >
              <v-card-title class="text-evolution-text-card">
                card
              </v-card-title>
            </v-card>
          </color-setting-card>
        </v-col>
        <v-col cols="12">
          <color-setting-card
            v-model="colors"
            :keys="colorState.progress.keys"
            class="border"
            variant="outlined"
            content-class="home-bg bg-blur d-flex flex-column justify-center overflow-hidden pa-3"
            area-color="transparent"
            :is-changed="colorState.progress.isChanged"
            :title="colorState.progress.title"
            @update="checkColorState(colorState.progress)"
            @click:discard="discardColorChanges(colorState.progress)"
            @click:save="saveColorChanges(colorState.progress)"
          >
            <user-progress-box
              :theme="THEME"
              bg-avatar="primary"
              model-value="80"
              :gradient-colors="[
                colors['progress-gradient-1'],
                colors['progress-gradient-2'],
                colors['progress-gradient-3'],
                colors['progress-gradient-4'],
                colors['progress-gradient-5'],
              ]"
            />
          </color-setting-card>
        </v-col>
      </v-row>
    </v-container>
  </client-only>
</template>

<style>
.home-bg {
  background-image: v-bind(background);
  background-position: left;
  background-size: cover;
  background-repeat: no-repeat;
}

.home-bg.bg-blur:before {
  background-image: v-bind(background);
  background-position: left;
  background-size: cover;
  background-repeat: no-repeat;

  content: '';
  position: absolute;
  margin: padding;
  left: 0;
  top: 0;
  margin: 12px;
  border-radius: 8px;
  width: calc(100% - 24px);
  height: calc(100% - 24px);

  filter: blur(1px);
}

.home-bg.bg-blur:after {
  content: '';
  position: absolute;
  margin: padding;
  left: 0;
  top: 0;
  margin: 12px;
  border-radius: 8px;
  width: calc(100% - 24px);
  height: calc(100% - 24px);

  background: rgba(166, 166, 166, 0.2);
}
</style>
