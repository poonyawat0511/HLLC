<script setup lang="ts">
// Page setup
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/themes', title: 'Schools Theme' },
  ],
})

// Injections
const { $api } = useApi()
const router = useRouter()

export interface SchoolWithTheme extends SchoolEntity {
  theme?: {
    id?: string
    colors: ThemeEntity['colors']
    assets: ThemeEntity['assets']
  }
}

// Model References
const schools = useState<SchoolWithTheme[]>('schools:theme', () => [])
const themes = ref<ThemeEntity[]>([])
const loading = ref<boolean>(true)

/**
 * A function that call api to get schools data
 */
async function fetchSchools() {
  try {
    const response = await $api.get<ApiResponse<SchoolEntity[]>>('/schools')
    schools.value = response.data
  } catch (error) {
    console.error(error)
    schools.value = []
  }
}

/**
 * A function that call api to get themes data
 */
async function fetchThemes() {
  try {
    const response = await $api.get<ApiResponse<ThemeEntity[]>>('/themes')
    themes.value = response.data
  } catch (error) {
    console.error(error)
    themes.value = []
  }
}

/**
 * A function to navigate to the options page
 */
function navigateToOptionPage(school: SchoolWithTheme) {
  return router.push(`/themes/${school.id}`)
}

function exposeId(entity: { id: string } | string) {
  if (typeof entity === 'object') return entity?.id
  return entity
}

/**
 * A function to marge themes into school
 */
async function combindColorsToSchools() {
  const themeMap = new Map<string, ThemeEntity>(
    themes.value.map((theme) => [exposeId(theme.school), theme])
  )
  for (const school of schools.value) {
    school.theme = { assets: {}, colors: {} }
    const theme = themeMap.get(school.id)
    if (theme) {
      school.theme.id = theme.id
      school.theme.colors = theme.colors ?? {}
      school.theme.assets = theme.assets ?? {}
    }
  }
}

/**
 * Initial function to fetch all necessary data
 */
async function fetchData() {
  loading.value = true
  await fetchSchools()
  await fetchThemes()
  await combindColorsToSchools()
  loading.value = false
}

onMounted(async () => {
  await fetchData()
})
</script>
<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <h2 class="text--text">Schools</h2>
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
        <div v-else-if="!schools.length">
          <v-card rounded="lg" class="border" variant="outlined">
            <v-card-text> No schools </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" to="/schools">
                <v-icon left class="mr-2"> mdi-open-in-new </v-icon>
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <v-row v-else dense>
          <v-col v-for="school in schools" :key="school.id" cols="12">
            <v-card
              rounded="lg"
              class="border"
              variant="outlined"
              @click="navigateToOptionPage(school)"
            >
              <v-list>
                <v-list-item :title="school.name.en">
                  <template #prepend>
                    <v-avatar
                      tile
                      rounded="lg"
                      :color="school.theme?.colors?.['primary']"
                    >
                      {{ school.acronym.charAt(0) }}
                    </v-avatar>
                  </template>
                  <template #subtitle>
                    Colors:
                    {{ Object.keys(school.theme?.colors ?? {}).length }} |
                    Assets: {{ Object.keys(school.theme?.assets ?? {}).length }}
                  </template>
                  <template #append>
                    <v-icon @click.stop="navigateToOptionPage(school)">
                      mdi-chevron-right
                    </v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
