<script setup lang="ts">
definePageMeta({
  menu: {
    display: true,
  },
  background: true,
})
const { colors } = useSchool()
const theme = ref('school')
const { isClosed, isOpen, fetchContests, loadSetting, top, random, setting } =
  useContest()

/**
 * TODO: check remaining items
 */
const remainingItems = computed<Contest[]>(() => random(undefined, 5))

/**
 * TODO: check top 5 items
 */
const topFiveItems = computed<Contest[]>(() => top(5))

const router = useRouter()
function openView(contest: Contest) {
  router.push(`/contest/${contest.id}`)
}

const { current } = useLocale()
const locale = computed(() => {
  return current.value as 'th' | 'en'
})

const adapter = useDate()

const startDate = computed(() => {
  return adapter
    .toJsDate(setting.value.dateTimes.open)
    ?.toLocaleDateString(locale.value, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
})

const endDate = computed(() => {
  return adapter
    .toJsDate(setting.value.dateTimes.close)
    ?.toLocaleDateString(locale.value, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
})

const endTime = computed(() => {
  return adapter
    .toJsDate(setting.value.dateTimes.close)
    ?.toLocaleString(locale.value, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
})

onMounted(async () => {
  await loadSetting()
  await fetchContests()
})
</script>
<template>
  <ClientOnly>
    <v-container fluid :theme="theme">
      <v-card
        rounded="xl"
        elevation="0"
        :color="$vuetify.display.mobile ? 'transparent' : colors['card-bg']"
        :class="$vuetify.display.mobile ? '' : 'pa-5'"
      >
        <v-card rounded="xl" :color="colors['card-surface']" elevation="0">
          <v-row dense>
            <v-col v-if="$vuetify.display.mobile" cols="12" md="4">
              <v-img :src="setting.banner" class="mx-auto" width="50%" />
            </v-col>
            <v-col cols="12" md="8">
              <v-card flat color="transparent">
                <v-card-title class="text-h5 font-weight-bold">
                  <h3 class="font-weight-bold text-title text-truncate">
                    <span class="text-primary font-weight-bold">MFU</span>
                    Freshers Contest
                  </h3>
                </v-card-title>
                <v-card-text>
                  <span class="font-weight-medium text-content">
                    {{ setting.details[locale] }}
                  </span>
                  <v-row dense class="mt-2">
                    <v-col cols="12" md="6">
                      <span class="font-weight-bold text-primary">
                        {{ $t('votingPeriod') }}
                      </span>
                      <v-list-item class="mt-1 ml-n5">
                        <template #prepend>
                          <v-avatar color="transparent" class="pa-1 mr-2">
                            <v-img src="contests/open.png" />
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle
                          class="font-weight-bold text-black"
                        >
                          {{ startDate }} - {{ endDate }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" md="6">
                      <span class="font-weight-bold text-primary">
                        {{ $t('closeVoted') }}
                      </span>
                      <v-list-item class="mt-1 ml-n5">
                        <template #prepend>
                          <div>
                            <v-avatar color="transparent" class="pa-1 mr-2">
                              <v-img src="contests/close.png" />
                            </v-avatar>
                          </div>
                        </template>
                        <v-list-item-subtitle
                          class="font-weight-bold text-black ml-4"
                        >
                          {{ endTime }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col v-if="!$vuetify.display.mobile" cols="12" md="4">
              <v-img width="80%" class="mx-auto" :src="setting.banner" />
            </v-col>
          </v-row>
          <v-card-actions class="mt-n3 mb-2">
            <v-spacer />
            <v-btn
              color="primary"
              variant="flat"
              class="px-10 text-white"
              rounded
              size="large"
              :disabled="!isOpen && !isClosed"
              @click="$router.push('/contest/vote')"
            >
              {{ $t(isClosed ? 'thankVote' : 'Join') }}
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
        <v-card
          v-if="isClosed"
          class="mt-4"
          :color="colors['card-surface']"
          rounded="xl"
          elevation="0"
        >
          <v-card-title>
            <h3 class="text-title text-truncate">
              {{ $t('Finalist') }}
              <span class="text-primary">Final Round</span>
            </h3>
          </v-card-title>
          <v-card-text>
            <p class="font-weight-bold text-content">
              {{ setting.final[locale] }}
            </p>
            <v-row class="mt-2 justify-center">
              <v-col
                v-for="contest in topFiveItems"
                :key="contest.id"
                cols="7"
                sm="2"
                md="2"
                lg="2"
              >
                <contest-champion :item="contest" @click="openView" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mb-3">
            <v-spacer />
            <contest-result :items="remainingItems" />
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-card>
    </v-container>
  </ClientOnly>
</template>
