<template>
  <ClientOnly>
    <v-container fluid>
      <v-card
        v-if="activity"
        rounded="xl"
        elevation="0"
        class="mt-2"
        :color="$vuetify.display.mobile ? 'transparent' : colors['card-bg']"
        :class="$vuetify.display.mobile ? '' : 'pa-5'"
      >
        <v-row dense>
          <v-col cols="12" md="6">
            <v-img
              :src="activity?.banner ? activity.banner : '../no-img.png'"
              :aspect-ratio="16 / 9"
              :class="activity?.banner ? '' : 'bg-white'"
              elevation="0"
              cover
              class="rounded-xl border"
            >
              <v-btn
                color="primary"
                rounded="xl"
                class="mt-2 ml-2"
                variant="flat"
                @click="$router.push('/activities')"
              >
                <v-icon color="white" icon="mdi-arrow-left-circle-outline" />
                <span class="ml-2 text-white">{{ $t('goBack') }}</span>
              </v-btn>
            </v-img>
          </v-col>
          <v-col cols="12" md="6">
            <v-card elevation="0" :color="colors['card-surface']" rounded="xl">
              <div v-if="activity" class="pa-6 border rounded-xl">
                <div class="pb-6">
                  <ActivityDotTracking
                    v-model="activeWindow"
                    :activity="activity"
                    :show-window="true"
                  />
                </div>
                <v-window v-model="activeWindow">
                  <v-window-item value="start">
                    <div
                      v-if="formattedDateTime"
                      class="d-flex flex-column ga-2"
                    >
                      <div class="d-flex ga-4 align-center">
                        <div class="border pa-2 rounded-lg">
                          <v-icon color="grey">mdi-calendar</v-icon>
                        </div>
                        <p v-if="formattedDateTime" class="text-title">
                          {{ formattedDateTime.date[lang] }}
                        </p>
                        <p v-else class="text-title">
                          {{ textMessage.comingSoon[lang] }}
                        </p>
                      </div>
                      <div class="d-flex ga-4 align-center">
                        <div class="border pa-2 rounded-lg">
                          <v-icon color="grey">mdi-clock-outline</v-icon>
                        </div>
                        <p v-if="formattedDateTime" class="text-title">
                          {{ formattedDateTime.startTime[lang] }} -
                          {{ formattedDateTime.endTime[lang] }}
                        </p>
                        <p v-else class="text-title">
                          {{ textMessage.comingSoon[lang] }}
                        </p>
                      </div>
                      <div class="d-flex ga-4 align-center">
                        <div class="border pa-2 rounded-lg">
                          <v-icon color="grey">mdi-map-marker-outline</v-icon>
                        </div>
                        <p v-if="formattedDateTime" class="text-title">
                          {{ activity.location[lang] }}
                        </p>
                        <p v-else class="text-title">
                          {{ textMessage.undefined[lang] }}
                        </p>
                      </div>
                    </div>
                    <div v-else>
                      <div class="d-flex ga-4 align-center">
                        <div class="border pa-2 rounded-lg">
                          <v-icon color="grey">mdi-message-outline</v-icon>
                        </div>
                        <p class="text-center">
                          {{ textMessage.comingSoon[lang] }}
                        </p>
                      </div>
                    </div>
                  </v-window-item>
                  <v-window-item value="checkin">
                    <div class="d-flex ga-4 align-center">
                      <div class="border pa-2 rounded-lg">
                        <v-icon color="grey">mdi-message-outline</v-icon>
                      </div>
                      <div v-if="stepProgress === 'Closed'">
                        <p class="text-title">
                          {{ textMessage.waitingCheckin[lang] }}
                        </p>
                      </div>
                      <div v-if="stepProgress === 'Start'">
                        <p class="text-title">
                          {{ textMessage.openCheckin[lang] }}
                        </p>
                      </div>
                      <div v-if="stepProgress === 'Failed'">
                        <p class="text-title">
                          {{ textMessage.checkinFailed[lang] }}
                        </p>
                      </div>
                      <div
                        v-else-if="
                          stepProgress === 'Ongoing' ||
                          stepProgress === 'End' ||
                          stepProgress === 'Done'
                        "
                      >
                        <p class="text-title">
                          {{ textMessage.checkedin[lang] }}
                        </p>
                      </div>
                    </div>
                    <v-btn
                      v-if="stepProgress === 'Start'"
                      color="primary"
                      rounded
                      width="100%"
                      class="mt-4"
                      @click="$router.push('/qr-code')"
                      >{{ textMessage.qrButton[lang] }}</v-btn
                    >
                  </v-window-item>
                  <v-window-item value="end">
                    <div class="d-flex ga-4 align-center">
                      <div class="border pa-2 rounded-lg">
                        <v-icon color="grey">mdi-message-outline</v-icon>
                      </div>
                      <div
                        v-if="
                          stepProgress === 'Ongoing' || stepProgress === 'Start'
                        "
                      >
                        <p class="text-title">
                          {{ textMessage.ongoing[lang] }}
                        </p>
                      </div>
                      <div
                        v-if="
                          stepProgress === 'End' ||
                          stepProgress === 'Done' ||
                          stepProgress === 'Failed'
                        "
                      >
                        <p class="text-title">{{ textMessage.ended[lang] }}</p>
                      </div>
                      <div v-if="stepProgress === 'Closed'">
                        <p class="text-title">
                          {{ textMessage.waitingCheckin[lang] }}
                        </p>
                      </div>
                    </div>
                  </v-window-item>
                  <v-window-item value="assessment">
                    <div class="d-flex ga-4 align-center">
                      <div class="border pa-2 rounded-lg">
                        <v-icon color="grey">mdi-message-outline</v-icon>
                      </div>
                      <div
                        v-if="
                          stepProgress === 'Ongoing' || stepProgress === 'Start'
                        "
                      >
                        <p class="text-title">
                          {{ textMessage.ongoing[lang] }}
                        </p>
                      </div>
                      <div v-if="stepProgress === 'Done'">
                        <p class="text-title">
                          {{ textMessage.doneEvaluation[lang] }}
                        </p>
                      </div>
                      <div v-if="stepProgress === 'End'">
                        <p class="text-title">
                          {{ textMessage.waitingEvaluation[lang] }}
                        </p>
                      </div>
                      <div v-if="stepProgress === 'Closed'">
                        <p class="text-title">
                          {{ textMessage.waitingCheckin[lang] }}
                        </p>
                      </div>
                      <div v-if="stepProgress === 'Failed'">
                        <p class="text-title">
                          {{ textMessage.failedEvaluation[lang] }}
                        </p>
                      </div>
                    </div>
                    <v-btn
                      v-if="stepProgress === 'End'"
                      color="primary"
                      rounded
                      elevation="0"
                      width="100%"
                      class="mt-4"
                      @click="evaluation.open()"
                    >
                      <span class="text-white">{{
                        textMessage.evaluationButton[lang]
                      }}</span></v-btn
                    >
                  </v-window-item>
                </v-window>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
              elevation="0"
              class="pa-4 border rounded-xl"
              :color="colors['card-surface']"
            >
              <h2 class="pb-2 text-title">{{ activity?.name[lang] }}</h2>
              <p class="text-content">{{ activity?.description[lang] }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-else :color="colors['card-surface']" rounded="xl" elevation="0">
        <v-card-text>
          <p class="text-center">{{ $t('comingSoon') }}</p>
        </v-card-text>
      </v-card>
      <QuestionsActivitiesDialog
        v-model="evaluation.dialog"
        :loading="evaluation.loading"
        :saving="evaluation.saving"
        :questions="evaluation.questions"
        @cancel="evaluation.close()"
        @submit="(items) => evaluation.submit(items)"
      />
      <ItemView v-model="item.dialog" :item="item.item!">
        <template #header>
          <v-card-title> {{ $t('congrate') }} </v-card-title>
        </template>
        <template #actions>
          <v-btn rounded variant="text" @click="item.dialog = false">
            {{ $t('isClose') }}
          </v-btn>
          <v-btn
            color="primary"
            rounded
            variant="flat"
            @click="$router.push('/evolution')"
          >
            {{ $t('evolution') }}
          </v-btn>
        </template>
      </ItemView>
    </v-container>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  menu: {
    active: 'Activities',
    display: true,
  },
  background: true,
})
const { current } = useLocale()
type Locales = 'th' | 'en'
const lang = computed(() => current.value as Locales)
const route = useRoute()
const id = route.params.id as string
const { colors } = useSchool()
const { findOne, updateAssessment } = useActivity()
const {
  data: activity,
  status,
  error,
} = await useAsyncData<IActivity>(`activity:${id}`, async () => {
  return await findOne(id)
})
if (status.value === 'error' || !activity.value) {
  showError({
    statusCode: error.value?.statusCode,
    message: error.value?.message,
  })
}

const formattedDateTime = computed(() => {
  const start = activity.value?.dateTime.start
    ? new Date(activity.value.dateTime.start)
    : undefined

  const end = activity.value?.dateTime.end
    ? new Date(activity.value.dateTime.end)
    : undefined
  const checkin = activity.value?.checkInAt
    ? new Date(activity.value.checkInAt)
    : undefined
  if (!start || !end) return undefined

  const date = {
    en: new Intl.DateTimeFormat('en-gb', {
      dateStyle: 'long',
    }).format(start),
    th: new Intl.DateTimeFormat('th', {
      dateStyle: 'long',
    }).format(start),
  }

  const startTime = {
    en: new Intl.DateTimeFormat('en-gb', {
      timeStyle: 'short',
    }).format(start),
    th: new Intl.DateTimeFormat('th', {
      timeStyle: 'short',
    }).format(start),
  }
  const endTime = {
    en: new Intl.DateTimeFormat('en-gb', {
      timeStyle: 'short',
    }).format(end),
    th: new Intl.DateTimeFormat('th', {
      timeStyle: 'short',
    }).format(end),
  }
  const checkinTime = {
    en: new Intl.DateTimeFormat('en-gb', {
      timeStyle: 'short',
    }).format(checkin),
    th: new Intl.DateTimeFormat('th', {
      timeStyle: 'short',
    }).format(checkin),
  }

  return { date, startTime, endTime, checkinTime }
})

const stepProgress = computed(() => {
  const progress = activity.value?.status

  if (!progress) {
    return null
  }

  switch (progress.step) {
    case 0:
      return 'Closed'
    case 1:
      return progress.message === 'waiting' ? 'Start' : 'Failed'
    case 2:
      return 'Ongoing'
    case 3:
      return progress.message === 'waiting'
        ? 'End'
        : progress.message === 'success'
        ? 'Done'
        : null
    default:
      return null
  }
})

const tabs = ['start', 'checkin', 'end', 'assessment'] as const
type Tabs = (typeof tabs)[number]
const activeWindow = ref<Tabs>('start')

onMounted(() => {
  activeWindow.value = tabs[activity.value?.status.step ?? 0]
})

const textMessage = {
  waitingCheckin: {
    en: 'This activity is not open now.',
    th: 'กิจกรรมนี้ ยังไม่เปิดให้ลงทะเบียน',
  },
  openCheckin: {
    en: 'Now you can check in.',
    th: 'กิจกรรมเปิดให้ลงทะเบียนแล้ว',
  },
  qrButton: {
    en: 'Display QR-Code',
    th: 'แสดงคิวอาร์โค้ด',
  },
  checkinFailed: {
    en: `You didn’t check in on time, so it’s no longer possible to Check in.`,
    th: 'คุณไม่ได้ลงทะเบียนในเวลาที่กำหนด',
  },
  checkedin: {
    en: `You already checked in at ${formattedDateTime.value?.checkinTime.en}.`,
    th: `คุณลงทะเบียนกิจกรรมนี้เรียบร้อยแล้วเมื่อ ${formattedDateTime.value?.checkinTime.th} น.`,
  },
  ongoing: {
    th: 'กิจกรรมนี้กำลังเกิดขึ้น',
    en: 'This activity is ongoing',
  },
  ended: {
    th: 'กิจกรรมนี้สิ้นสุดลงแล้ว',
    en: 'This activity has ended',
  },
  evaluationButton: {
    en: 'Evaluate this activity',
    th: 'ทำแบบประเมิน',
  },
  failedEvaluation: {
    en: 'You didn’t check in on time, so it’s not possible to do evaluation.',
    th: 'คุณไม่ได้ลงทะเบียนในเวลาที่กำหนด จึงไม่สามารถทำแบบประเมินของกิจกรรมนี้ได้',
  },
  waitingEvaluation: {
    en: 'Now you can do evaluation.',
    th: 'คุณสามารถทำแบบประเมินของกิจกรรมนี้ได้',
  },
  doneEvaluation: {
    en: `You're have completed this evaluation.`,
    th: 'คุณทำแบบประเมินนี้แล้ว',
  },
  undefined: {
    th: 'จะแจ้งให้ทราบในภายหลัง',
    en: 'To be informed later.',
  },
  comingSoon: {
    th: 'แล้วพบกันเร็วๆนี้',
    en: 'See you soon.',
  },
}

const { init, questions, save, createItem } = useAsssessment(activity.value!)

const evaluation = reactive({
  dialog: false,
  loading: false,
  saving: false,
  questions: [] as ActivityQuestion[],

  close() {
    this.dialog = false
    this.loading = false
    this.saving = false
  },

  async open() {
    this.dialog = true
    this.loading = true
    await init()
    this.questions = questions.value
    this.loading = false
  },

  async submit(items: ActivityQuestion[]) {
    try {
      this.saving = true
      const assessment = await save(items)
      const createdItem = await createItem()
      this.saving = false
      this.dialog = false
      if (createdItem) {
        item.open(createdItem)
      }
      activity.value!.takeAssessmentAt = assessment!.timestamp
      activity.value!.status = { step: 3, message: 'success' }
      updateAssessment(assessment!)
    } catch (error) {
      console.error('error')
    }
  },
})

const item = reactive({
  dialog: false,
  item: null as Item | null,

  open(item: Item) {
    this.item = item
    this.dialog = true
  },
})
</script>

<style scoped></style>
