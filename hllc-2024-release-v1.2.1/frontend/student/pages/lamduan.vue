<script setup lang="ts">
import type { LamduanType } from '~/modules/lamduans/components/LamduanDialog.vue'

interface DialogReactive {
  value: boolean
  type?: LamduanType
  action?: (type: LamduanType, item: Lamduan) => void
}

definePageMeta({
  background: true,
  menu: {
    display: true,
  },
})
const { colors } = useSchool()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)

const {
  fetchLamduan,
  lamduan,
  submit,
  edit,
  setting,
  loadSetting,
  isOpen,
  isClosed,
  fetchActivitiesLamduan,
  lamduanActivities,
} = useLamduan()

await useAsyncData(async () => {
  await loadSetting()
  await fetchActivitiesLamduan()
  await fetchLamduan()
})

const dialog = reactive<DialogReactive>({ value: false, type: 'update' })
const openDialogEdit = (type: LamduanType) => {
  dialog.type = type
  dialog.value = true
}
async function onConfirm(type: LamduanType, item: Lamduan) {
  if (type === 'update') {
    await edit(item)
    dialog.value = false
  } else {
    await submit(item)
    dialog.value = false
  }
}
const assessmentDialog = reactive<DialogReactive>({ value: false })
const assessmentConfirmDialog = reactive<DialogReactive>({ value: false })
const answerQuestion = ref<AnswerQuestion | null>(null)
async function onConfirmAssement(item: AnswerQuestion) {
  answerQuestion.value = item
  assessmentConfirmDialog.value = false
  assessmentDialog.value = false
  await fetchActivitiesLamduan(true)
}

const { init, questions, save, createItem } = useAsssessment(
  lamduanActivities.value!
)
const { updateAssessment } = useActivity()
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
      lamduanActivities.value!.takeAssessmentAt = assessment!.timestamp
      lamduanActivities.value!.status = { step: 3, message: 'success' }
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

async function downloadFile() {
  try {
    const url = setting.value.tutorial
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const blob = await response.blob()
    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(blob)
    anchor.download = 'tutorial.jpg'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(anchor.href)
  } catch (error) {
    console.error('There was an error downloading the file:', error)
  }
}
</script>
<template>
  <ClientOnly>
    <v-container v-if="!lamduanActivities" fluid>
      <v-card :color="colors['card-surface']" rounded="xl" elevation="0">
        <v-card-text>
          <p class="text-center">{{ $t('LanduanComing') }}</p>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container v-else fluid>
      <v-card
        rounded="xl"
        elevation="0"
        class="mt-2"
        :color="$vuetify.display.mobile ? 'transparent' : colors['card-bg']"
        :class="$vuetify.display.mobile ? '' : 'pa-5'"
      >
        <v-row dense>
          <v-col cols="12" md="7">
            <v-img
              :src="lamduanActivities?.banner"
              :aspect-ratio="16 / 9"
              cover
              class="rounded-xl"
            >
              <v-chip
                color="primary"
                rounded="xl"
                variant="flat"
                class="mt-2 ml-2"
                @click="$router.push('/')"
              >
                <v-icon icon="mdi-arrow-left-circle-outline" />
                <span class="ml-2">{{ $t('goBack') }}</span>
              </v-chip>
            </v-img>
          </v-col>
          <v-col cols="12" md="5">
            <v-card rounded="xl" elevation="0" :color="colors['card-surface']">
              <v-card-title class="text-title">
                {{ lamduanActivities?.name[lang] }}
              </v-card-title>
              <v-card-text>
                <span class="text-content">{{
                  lamduanActivities?.description[lang]
                }}</span>
                <youtube-embed class="mt-3 rounded-xl" :src="setting.youtube" />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  variant="flat"
                  color="primary"
                  rounded
                  @click="downloadFile"
                >
                  {{ $t('download toturial') }}
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <lamduan-create
              v-if="!lamduan"
              :start-date="setting.dateTimes.open"
              :end-date="setting.dateTimes.close"
              :is-open="isOpen"
              :is-closed="isClosed"
              @confirm="openDialogEdit('post')"
            />
            <lamduan-card
              v-else
              :item="lamduan"
              :evaluation="lamduanActivities.status.message"
              @confirm="openDialogEdit('update')"
            >
              <template #actions>
                <div v-if="lamduanActivities.status.step === 3" class="my-2">
                  <v-btn
                    v-if="lamduanActivities.status.message === 'waiting'"
                    rounded
                    color="primary"
                    elevation="0"
                    @click="evaluation.open()"
                  >
                    {{ $t('Evaluation') }}
                  </v-btn>
                  <v-chip
                    v-else-if="lamduanActivities.status.message === 'success'"
                    rounded
                    color="success"
                  >
                    {{ $t('Evaluated') }}
                  </v-chip>
                </div>
              </template>
            </lamduan-card>
          </v-col>
        </v-row>
      </v-card>
      <lamduan-dialog
        v-model="dialog.value"
        :type="dialog.type"
        :item="lamduan"
        @confirm="onConfirm"
      />
      <QuestionsActivitiesDialog
        v-model="evaluation.dialog"
        :loading="evaluation.loading"
        :saving="evaluation.saving"
        :questions="evaluation.questions"
        @cancel="evaluation.close()"
        @submit="(items) => evaluation.submit(items)"
      />
      <lamduan-confirm-dialog
        v-model="assessmentConfirmDialog.value"
        :item="answerQuestion"
        @confirm="onConfirmAssement"
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
