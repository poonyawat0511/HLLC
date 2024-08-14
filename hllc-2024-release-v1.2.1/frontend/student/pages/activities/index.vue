<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { data: user } = useAuth()
const { colors } = useSchool()

definePageMeta({
  menu: {
    active: 'Activities',
    display: true,
  },
  background: true,
})

const { fetchActivities, activities } = useActivity()

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

const displayActivities = computed(() => {
  return activities.value
    .filter((activity) => activity.show)
    .sort((a, b) => {
      const dateA = a.dateTime.start
        ? new Date(a.dateTime.start).getTime()
        : Infinity
      const dateB = b.dateTime.start
        ? new Date(b.dateTime.start).getTime()
        : Infinity
      return dateA - dateB
    })
})

const tabs = reactive<TabItem[]>([
  {
    value: 'overview',
    title: {
      en: 'Overview',
      th: 'กิจกรรมทั้งหมด',
    },
  },
  {
    value: 'status',
    title: {
      en: 'Status',
      th: 'สถานะกิจกรรม',
    },
  },
])

onMounted(async () => {
  await fetchActivities()
})
</script>

<template>
  <ClientOnly>
    <v-container fluid>
      <template v-if="activities.length === 0">
        <v-card :color="colors['card-surface']" rounded="xl" elevation="0">
          <v-card-text>
            <p class="text-center">{{ $t('communityComing') }}</p>
          </v-card-text>
        </v-card>
      </template>
      <template v-else>
        <TabSwitch
          :tabs="tabs"
          :active-tab="tab"
          class="mb-4"
          @change-tab="changeTab"
        />
        <v-window v-model="tab">
          <v-window-item value="overview">
            <v-card
              rounded="xl"
              elevation="0"
              class="mt-2"
              :color="
                $vuetify.display.mobile ? 'transparent' : colors['card-bg']
              "
              :class="$vuetify.display.mobile ? '' : 'pa-5'"
            >
              <v-row dense>
                <v-col
                  v-for="activity in displayActivities"
                  :key="activity.id"
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <ActivityCard
                    :activity="activity"
                    @click="$router.push(`/activities/${activity.id}`)"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-window-item>
          <v-window-item value="status">
            <v-card
              rounded="xl"
              elevation="0"
              class="mt-2"
              :color="
                $vuetify.display.mobile ? 'transparent' : colors['card-bg']
              "
              :class="$vuetify.display.mobile ? '' : 'pa-5'"
            >
              <v-row dense>
                <v-col
                  v-for="activity in displayActivities"
                  :key="activity.id"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <ActivityCard
                    :activity="activity"
                    :tracking="true"
                    @click="$router.push(`/activities/${activity.id}`)"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-window-item>
        </v-window>
      </template>
    </v-container>
  </ClientOnly>
</template>
<style scoped></style>
