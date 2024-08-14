<script setup lang="ts">
definePageMeta({
  menu: {
    display: true,
  },
  background: true,
})

const { colors } = useSchool()
const query = ref<string>('')
const dialog = ref<boolean>(false)

const {
  random,
  fetchFovorite,
  fetchContests,
  favorite,
  unvote,
  isOpen,
  setting,
  loadSetting,
} = useContest()

const filteredItems = computed(() => random(query.value))

const router = useRouter()
function openView(contest: Contest) {
  router.push(`/contest/${contest.id}`)
}

async function onConfirm(_type: string, item: Contest) {
  await unvote(item)
}

const { current } = useLocale()
const locale = computed(() => {
  return current.value as 'th' | 'en'
})

onMounted(async () => {
  await loadSetting()
  await fetchContests()
  await fetchFovorite()
})
</script>

<template>
  <ClientOnly>
    <contest-dialog
      v-if="favorite"
      v-model="dialog"
      :item="favorite"
      type="cancel"
      @confirm="onConfirm"
    />
    <v-container fluid>
      <v-toolbar color="transparent" flat>
        <v-btn
          color="primary"
          rounded="xl"
          variant="flat"
          @click="$router.push('/contest')"
        >
          <v-icon icon="mdi-arrow-left-circle-outline" />
          <span class="ml-2">{{ $t('goBack') }}</span>
        </v-btn>
        <v-spacer />
        <contest-rule :rules="setting.howToVote" />
      </v-toolbar>
      <v-card
        rounded="xl"
        elevation="0"
        :color="$vuetify.display.mobile ? 'transparent' : colors['card-bg']"
        :class="$vuetify.display.mobile ? '' : 'pa-5'"
      >
        <v-row dense>
          <v-col cols="12" md="4" sm="6" class="mx-auto">
            <!-- Voted card -->
            <div v-if="!$vuetify.display.mobile" style="height: 4rem" />
            <v-card
              v-if="!favorite"
              rounded="xl"
              elevation="0"
              :color="colors['card-surface']"
            >
              <v-card-title
                class="text-center text-primary font-weight-bold"
                style="font-size: 2rem"
              >
                {{ $t('How') }}
              </v-card-title>
              <v-card-text class="mt-n1 text-content">
                <ul class="pl-4">
                  <li
                    v-for="(tagline, index) in setting.taglines[locale]"
                    :key="index"
                  >
                    {{ tagline }}
                  </li>
                </ul>
              </v-card-text>
            </v-card>
            <contest-favorite
              v-if="favorite"
              :item="favorite"
              :is-open="isOpen"
              @click:unvote="dialog = true"
              @click="openView"
            />
          </v-col>
          <v-col cols="12" md="8" sm="6">
            <v-toolbar color="transparent" flat>
              <h3 class="font-weight-bold text-card-surface">
                {{ $t('All') }}
              </h3>
              <v-spacer />
              <v-text-field
                v-model="query"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                :label="$t('Search')"
                variant="outlined"
                :color="colors['card-surface']"
                :bg-color="colors['card-surface']"
                :base-color="colors['card-surface']"
                rounded
                hide-details
                single-line
              />
            </v-toolbar>
            <div :class="$vuetify.display.mobile ? '' : 'overflow-hidden '">
              <v-responsive
                :class="$vuetify.display.mobile ? '' : 'overflow-y-auto '"
                :max-height="$vuetify.display.mobile ? '' : '75vh'"
              >
                <v-row dense>
                  <template v-if="filteredItems.length">
                    <v-col
                      v-for="contest in filteredItems"
                      :key="contest.id"
                      cols="12"
                      md="6"
                    >
                      <contest-card :item="contest" @click="openView" />
                    </v-col>
                  </template>
                  <template v-else>
                    <v-col cols="12">
                      <v-card
                        :color="colors['card-surface']"
                        rounded="xl"
                        elevation="0"
                      >
                        <v-card-text>
                          <p class="text-center">{{ $t('noContent') }}</p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </template>
                </v-row>
              </v-responsive>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </ClientOnly>
</template>
