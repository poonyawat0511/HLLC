<script setup lang="ts">
const { data: user } = useAuth()
definePageMeta({
  background: true,
  menu: {
    display: true,
  },
})
const { colors } = useSchool()
const router = useRouter()
const route = useRoute()
const { dataFriendLists, fetchRelationShipWithUser, fetchRelationShip } =
  useFetchFriend()

interface TabItem {
  value: string
  title: { en: string; th: string }
}

const tabs = reactive<TabItem[]>([
  {
    value: 'community',
    title: {
      en: 'Community',
      th: 'Community',
    },
  },
  {
    value: 'friends',
    title: {
      en: 'Friends',
      th: 'Friends',
    },
  },
])

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

const { rooms, fetchRooms } = useCommunity()
const { fetchGift } = useGift()
const { fetchFriendRequest } = useFetchFriendRequest()

onMounted(async () => {
  await fetchRooms()
  await fetchGift()
  await fetchRelationShip()
  await fetchRelationShipWithUser()
  await fetchFriendRequest()
})

const searchQuery = ref('')
const searchQueryRoom = ref('')
const getFriendName = (friend: Relationship) => {
  return user.value.id === friend.sender.id
    ? friend.receiver.fullName
    : friend.sender.fullName
}

const filteredFriends = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return dataFriendLists.value.filter((friend) => {
    const nameToFilter = getFriendName(friend).toLowerCase()
    return nameToFilter.includes(query)
  })
})

// const filteredRooms = computed(() => {
//   const query = searchQuery.value.toLowerCase()
//   return rooms.value.filter((room) => {
//     return room.name[lang.value].toLowerCase().includes(query)
//   })
// })
</script>

<template>
  <ClientOnly>
    <v-container fluid>
      <NavigationBar />
      <tab-switch
        v-if="user.type == 'TESTER'"
        :tabs="tabs"
        :active-tab="tab"
        @change-tab="changeTab"
      />
      <v-card
        v-if="user.type == 'TESTER'"
        rounded="xl"
        elevation="0"
        class="mt-2 pa-5"
        :color="colors['card-bg']"
      >
        <v-window v-model="tab">
          <v-window-item :value="tabs[0].value">
            <v-row dense>
              <v-col v-for="(room, index) in rooms" :key="index" cols="12">
                <v-text-field
                  v-model="searchQueryRoom"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  :label="$t('Search')"
                  variant="outlined"
                  :color="colors['card-surface']"
                  :bg-color="colors['card-surface']"
                  :base-color="colors['card-surface']"
                  rounded
                  class="mx-auto"
                  :width="$vuetify.display.xs ? '100%' : '40%'"
                  hide-details
                  single-line
                />
                <communities-room-card :item="room" />
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item :value="tabs[1].value">
            <div class="d-flex">
              <v-spacer />
              <v-chip
                variant="elevated"
                elevation="0"
                class="mb-2"
                color="primary"
              >
                {{ $t('Your friends') }}: {{ dataFriendLists.length }}
              </v-chip>
            </div>
            <div>
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                :label="$t('Search')"
                variant="outlined"
                :color="colors['card-surface']"
                :bg-color="colors['card-surface']"
                :base-color="colors['card-surface']"
                rounded
                class="mx-auto"
                :width="$vuetify.display.xs ? '100%' : '40%'"
                hide-details
                single-line
              />
            </div>

            <v-row dense class="mt-2">
              <v-col
                v-for="(friend, index) in filteredFriends"
                :key="index"
                cols="12"
              >
                <friends-list :item="friend" />
              </v-col>
              <v-col
                v-if="filteredFriends.length === 0"
                cols="12"
                class="text-center"
              >
                <v-card
                  :color="colors['card-surface']"
                  elevation="0"
                  rounded="xl"
                >
                  <v-card-text>
                    {{ $t('noData') }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card>
      <v-card v-else :color="colors['card-surface']" rounded="xl" elevation="0">
        <v-card-text>
          <p class="text-center">{{ $t('noQuestionMC') }}</p>
        </v-card-text>
      </v-card>
    </v-container>
  </ClientOnly>
</template>
