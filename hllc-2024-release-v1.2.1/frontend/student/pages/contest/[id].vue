<script setup lang="ts">
import type { VoteType } from '~/modules/contests/components/ContestDialog.vue'

interface DialogReactive {
  value: boolean
  type: VoteType
  action?: (type: VoteType, item: Contest) => void
}

definePageMeta({
  menu: {
    display: true,
  },
  background: true,
})

const { colors } = useSchool()
const route = useRoute()
const id = route.params.id as string

const search = ref<string>('')
const dialog = reactive<DialogReactive>({
  value: false,
  type: 'vote',
})

const {
  findOne,
  random,
  isOpen,
  favorite,
  fetchContests,
  fetchFovorite,
  loadSetting,
  setting,
  vote,
  unvote,
} = useContest()

const {
  data: content,
  status,
  error,
} = await useAsyncData(`contest:${id}`, async () => {
  await loadSetting()
  await fetchFovorite()
  return await findOne(id)
})

if (status.value === 'error') {
  showError({
    statusCode: error.value?.statusCode,
    message: error.value?.message,
  })
}

const isVoted = computed(() => favorite.value?.id === content.value?.id)

const filteredItems = computed(() =>
  random(search.value, 5, [content.value?.id ?? ''])
)

function openDialog(type: VoteType) {
  dialog.type = type
  dialog.value = true
}

async function onConfirm(type: VoteType, item: Contest) {
  if (type === 'vote') {
    await vote(item)
    if (content.value) {
      if (content.value.votes) content.value.votes++
      else content.value.votes = 1
    }
    dialog.value = false
  } else {
    await unvote(item)
    if (content.value) {
      if (content.value.votes) content.value.votes--
      else content.value.votes = 0
    }
    dialog.value = false
  }
}

const router = useRouter()
function openView(contest: Contest) {
  router.push(`/contest/${contest.id}`)
}

onMounted(async () => {
  await fetchContests()
})
</script>

<template>
  <v-container fluid>
    <contest-dialog
      v-if="content"
      v-model="dialog.value"
      :item="content"
      :type="dialog.type"
      @confirm="onConfirm"
    />
    <v-toolbar color="transparent" flat>
      <v-btn
        color="primary"
        rounded="xl"
        variant="flat"
        @click="$router.push('/contest/vote')"
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
        <v-col cols="12" md="7" sm="12">
          <contest-video
            v-if="content"
            :item="content"
            :is-open="isOpen"
            :is-voted="isVoted"
            @click:vote="openDialog('vote')"
            @click:unvote="openDialog('cancel')"
          />
        </v-col>
        <v-col cols="12" md="5" sm="12">
          <v-toolbar color="transparent" flat>
            <h3 class="font-weight-bold text-title  text-card-surface">
              {{ $t('Suggestion') }}
            </h3>
            <v-spacer />
            <v-text-field
              v-model="search"
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
          <v-row dense>
            <template v-if="filteredItems.length">
              <v-col
                v-for="contest in filteredItems"
                :key="contest.id"
                cols="12"
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
                  <v-card-text class="text-center">
                    {{ $t('noData') }}
                  </v-card-text>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
