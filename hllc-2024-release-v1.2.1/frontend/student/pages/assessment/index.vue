<script setup lang="ts">
definePageMeta({
  layout: 'default',
  force: true,
  background: true,
})

const { data: user, refresh } = useAuth()
const { mobile } = useDisplay()
const { colors } = useSchool()
const disabled = computed(() => !!user.value?.posttest)
const router = useRouter()
interface Question {
  th: string
  en: string
}
interface Assessment {
  id: string
  question: Question
  status: string
  type: string
  required: boolean
  section: {
    id: string
    title: SectionTitle
    subtitle: SectionSubtitle
    order: number
  }
}

interface SectionTitle {
  th: string
  en: string
}

interface SectionSubtitle {
  th: string
  en: string
}

interface Detail {
  id: string
  status: string
  type: string
  required: boolean
  value?: string
}

interface FilteredQuestion {
  question: Question
  details: Detail[]
}

interface FilteredSection {
  title: SectionTitle
  questions: FilteredQuestion[]
}
interface SnackbarModel {
  title: string
  icon: string
  type: string
}

const snackbarDetail = reactive<SnackbarModel>({
  title: '',
  icon: '',
  type: '',
})

const onSnackbar = (title: string, icon: string, type: string) => {
  snackbarDetail.title = title
  snackbarDetail.icon = icon
  snackbarDetail.type = type
  snackbar.value = true
}

const { $api } = useNuxtApp()
const data = ref<Assessment[]>([])
const filteredSections = ref<FilteredSection[]>([])
const snackbar = ref(false)

const fetchAssessment = async () => {
  try {
    const response = await $api.get<{ data: Assessment[] }>(
      '/assessments/assessments'
    )
    data.value = response.data
    filterAndCountQuestions()
  } catch (error) {
    console.error('Error fetching questions:', error)
  }
}

const filterAndCountQuestions = () => {
  const sectionMap: {
    [key: string]: {
      title: SectionTitle
      subtitle: SectionSubtitle
      questions: FilteredQuestion[]
    }
  } = {}

  data.value.forEach((item) => {
    const sectionId = item.section.id
    const sectionTitle = item.section.title
    const sectionSubtitle = item.section.subtitle
    const questionText = item.question.en

    if (!sectionMap[sectionId]) {
      sectionMap[sectionId] = {
        title: sectionTitle,
        subtitle: sectionSubtitle,
        questions: [],
      }
    }

    const questionIndex = sectionMap[sectionId].questions.findIndex(
      (q) => q.question.en === questionText
    )
    if (questionIndex > -1) {
      sectionMap[sectionId].questions[questionIndex].details.push({
        id: item.id,
        status: item.status,
        type: item.type,
        required: item.required,
        value: item.value || 0,
      })
    } else {
      sectionMap[sectionId].questions.push({
        question: item.question,
        details: [
          {
            id: item.id,
            status: item.status,
            type: item.type,
            required: item.required,
            value: item.value || 0,
          },
        ],
      })
    }
  })

  filteredSections.value = Object.values(sectionMap)
}

const routerToIndex = () => {
  router.push({ path: '/' })
}

async function onSubmit() {
  try {
    const result = filteredSections.value.flatMap((section) =>
      section.questions.flatMap((question) =>
        question.details.map((detail) => ({
          assessment: detail.id,
          value: detail.value?.toString(),
        }))
      )
    )
    await $api.post<{ data: unknown[] }>('/posttests', {
      body: {
        author: user.value.id,
        values: result,
      },
    })
    onSnackbar(
      'Thank you for taking the questionnaire.',
      'mdi-check-circle-outline',
      'success'
    )

    setTimeout(async () => {
      await refresh()
      routerToIndex()
    }, 1000)
  } catch (error) {
    const err = error as ErrorResponse
    console.error('Submission error:', err.response._data.message)
  }
}
const textProvider = {
  th: {
    BeforeJoining: 'ก่อนเข้าร่วมกิจกรรม',
    AfterJoining: 'หลังเข้าร่วมกิจกรรม',
  },
  en: {
    BeforeJoining: 'Before joining the activity',
    AfterJoining: 'After joining the activity',
  },
}

onMounted(async () => {
  await fetchAssessment()
  if (disabled.value) {
    routerToIndex()
  }
})
</script>
<template>
  <v-container v-if="!disabled" fluid>
    <v-card
      v-if="data.length === 0"
      :color="mobile ? 'transparent' : colors['card-bg']"
      class="mt-3 pa-4 mx-auto"
      rounded="xl"
      max-width="60rem"
    >
      <v-img src="icons/warning.png" max-width="6rem" class="mx-auto" />
      <v-card-title class="text-center text-title">
        {{ $t('Evaluation') }}
      </v-card-title>
      <v-card-text class="text-center text-subtitle mt-n2 py-0">
        {{ $t('noData') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          size="large"
          variant="flat"
          rounded="xl"
          class="px-10"
          href="https://www.facebook.com/mfuactivities"
        >
          {{ $t('contactUs') }}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
    <v-card
      v-else
      class="pa-4 mx-auto"
      :color="mobile ? 'transparent' : colors['card-bg']"
      :class="mobile ? '' : 'pa-5'"
      max-width="60rem"
      rounded="lg"
      elevation="0"
    >
      <v-card
        rounded="lg"
        elevation="0"
        :color="colors['card-surface']"
        class="mb-3"
      >
        <v-card-title class="font-weight-bold text-center text-primary">
          Overall Assessment
        </v-card-title>
      </v-card>
      <v-card rounded="lg" elevation="0" :color="colors['card-surface']">
        <v-img src="/imageAssessment.jpg" cover :aspect-ratio="3 / 1" />
      </v-card>
      <!-- Display Question -->
      <div
        v-for="(section, sectionIndex) in filteredSections"
        :key="sectionIndex"
      >
        <v-card
          rounded="lg"
          elevation="0"
          :color="colors['card-surface']"
          class="my-3 overflow-hidden"
        >
          <v-card color="primary" elevation="0" max-height="10px">
            <v-card-title>..</v-card-title>
          </v-card>
          <v-card-text>
            <span class="text-h6 font-weight-bold">
              {{ section.title[$i18n.locale] }}
            </span>
            <div class="text-medium-emphasis font-weight-medium mt-2">
              {{ section.subtitle[$i18n.locale] }}
            </div>
          </v-card-text>
        </v-card>
        <div v-if="section.questions.length">
          <v-card
            v-for="(question, index) in section.questions"
            :key="index"
            rounded="lg"
            elevation="0"
            :color="colors['card-surface']"
            class="mb-4"
          >
            <v-card-text>
              <span class="text-body-3 font-weight-bold">
                {{ index + 1 }}.{{ question.question[$i18n.locale] }}
              </span>
              <span
                v-if="question.details[0].required"
                class="text-red font-weight-bold"
              >
                *
              </span>
              <div
                v-for="detail in question.details"
                :key="detail.id"
                class="mt-4"
              >
                <p class="text-primary font-weight-bold text-center mb-n6">
                  {{
                    detail.status === 'PRETEST'
                      ? $t(textProvider[$i18n.locale].BeforeJoining)
                      : $t(textProvider[$i18n.locale].AfterJoining)
                  }}
                </p>
                <v-row dense class="mt-4">
                  <v-col
                    cols="2"
                    class="align-self-end text-right mb-6 text-title"
                  >
                    {{ $t('Low') }}
                  </v-col>
                  <v-col cols="8" class="align-self-end">
                    <v-radio-group
                      v-model="detail.value"
                      class="d-flex justify-center mx-n4"
                      color="primary"
                      inline
                      hide-details="auto"
                    >
                      <div
                        v-for="rating in 5"
                        :key="`rating-${index}-${rating}`"
                      >
                        <div class="d-flex flex-column align-center mx-n1">
                          <span class="text-title mb-n2 mt-2">{{
                            rating
                          }}</span>
                          <v-radio :value="rating" class="d-flex" />
                        </div>
                      </div>
                    </v-radio-group>
                  </v-col>
                  <v-col
                    cols="2"
                    class="align-self-end text-title text-left mb-6"
                  >
                    {{ $t('High') }}
                  </v-col>
                </v-row>
                <!-- <v-divider v-if="detail.status === 'PRETEST'" /> -->
              </div>
            </v-card-text>
          </v-card>
        </div>
        <div v-else>No questions available.</div>
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          size="large"
          variant="flat"
          rounded="xl"
          class="px-10"
          @click="onSubmit()"
        >
          {{ $t('submit') }}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarDetail.title"
      :icon="snackbarDetail.icon"
      :type="snackbarDetail.type"
    />
  </v-container>
</template>
