<script setup lang="ts">
definePageMeta({
  menu: {
    display: true,
  },
  background: true,
})

const { colors } = useSchool()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
const { data: user } = useAuth()

const { fetchQuestions, questions } = useQuestion()

onMounted(async () => {
  await fetchQuestions()
})

const router = useRouter()
function openView(question: IQuestion) {
  router.push(`/questions/${question.id}`)
}
</script>
<template>
  <v-container fluid>
    <v-btn
      v-if="questions.length !== 0"
      color="primary"
      rounded="xl"
      variant="flat"
      class="mt-2 ml-2"
      @click="$router.push('/')"
    >
      <v-icon icon="mdi-arrow-left-circle-outline" />
      <span class="ml-2">{{ $t('goBack') }}</span>
    </v-btn>

    <v-card
      v-if="questions.length !== 0"
      rounded="xl"
      elevation="0"
      class="mt-2"
      :color="colors['card-bg']"
    >
      <v-card-text>
        <div class="d-flex justify-center">
          <v-card
            rounded="xl"
            class="px-10 pt-4 pb-4 text-center"
            elevation="0"
            :width="$vuetify.display.xs ? '100%' : '40%'"
            color="primary"
          >
            {{ $t('headerQuestion') }}
          </v-card>
        </div>
        <v-row dense class="mt-2">
          <v-col
            v-if="questions.length !== 0"
            cols="12"
            md="6"
            v-for="(question, index) in questions"
            :key="index"
          >
            <question-card :item="question" @click="openView" />
          </v-col>
          <v-col v-else cols="12" class="mx-auto">
            <p class="text-title">
              {{ $t('noQuestionMC') }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      v-else
      rounded="xl"
      elevation="0"
      class="mt-2"
      :color="colors['card-surface']"
    >
      <v-card-text class="text-center">
        {{ $t('noQuestionMC') }}
      </v-card-text>
    </v-card>
  </v-container>
 
</template>
