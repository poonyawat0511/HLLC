<script setup lang="ts">
import type { AnswerType } from '~/modules/questions/components/QuestionDialog.vue'

interface DialogReactive {
  value: boolean
  type?: AnswerType
  id?: string
  action?: (type: AnswerType, item: IAnswer, idQuestion: string) => void
}
definePageMeta({
  menu: {
    display: true,
  },
  background: true,
})
const { data: user } = useAuth()
const { colors } = useSchool()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
const route = useRoute()
const id = route.params.id as string

const {
  answers,
  fetchAnswers,
  submit,
  edit,
  fetchQuestion,
  question,
  deleteAnswer,
} = useQuestion()

onMounted(async () => {
  await fetchAnswers(id)
  await fetchQuestion(id)
})

const dialog = reactive<DialogReactive>({ value: false, type: 'update' })
const selectedAnswer = ref<IAnswer | null | undefined>(null)
  const openDialog = (type: AnswerType, id?: string, item?: IAnswer) => {
  if (type === 'update') {
    selectedAnswer.value = item
    dialog.type = type
    dialog.value = true
  } else {
    dialog.type = type
    dialog.value = true
    dialog.id = id
  }
}
async function onConfirm(type: AnswerType, item: IAnswer) {
  if (type === 'update') {
    await edit(item)
    dialog.value = false
  } else {
    await submit(item)
    dialog.value = false
  }
}

const dialogDelete = reactive<DialogReactive>({ value: false })
const openDeleteDialog = (item?: IAnswer) => {
  selectedAnswer.value = item
  dialogDelete.value = true
}
async function onDeleteConfirm(item: IAnswer) {
  await deleteAnswer(item)
  dialogDelete.value = false
}
</script>
<template>
  <v-container fluid>
    <v-btn 
      color="primary"
      rounded="xl"
      variant="flat"
      class="mt-2 ml-2"
      @click="$router.push('/questions')"
    >
      <v-icon icon="mdi-arrow-left-circle-outline" />
      <span class="ml-2">{{ $t('goBack') }}</span>
    </v-btn>
    <v-card rounded="xl" elevation="0" class="mt-2" :color="colors['card-bg']">
      <v-card-text>
        <div class="d-flex justify-center">
          <v-card
            rounded="xl"
            class="px-10 pt-4 pb-4 text-center"
            elevation="0"
            :width="$vuetify.display.xs ? '100%' : '80%'"
            color="primary"
          >
            <span style="font-size: 1.2rem;"> {{ question?.title[lang] }} </span>
          </v-card>
        </div>
        <v-img
          class="mx-auto mt-3"
          width="15rem"
          contain
          :src="question?.image"
        />
        <v-row dense>
          <v-col cols="12" v-for="(answer, index) in answers" :key="index">
            <question-answer-card :item="answer">
              <template #actions>
                <v-spacer />
                <v-btn
                  rounded
                  variant="text"
                  color="warning"
                  prepend-icon="mdi-pencil"
                  @click="openDialog('update', id, answer)"
                >
                  {{ $t('Edit') }}
                </v-btn>
                <v-btn
                  rounded
                  variant="text"
                  class="mr-2"
                  color="error"
                  @click="openDeleteDialog(answer)"
                  prepend-icon="mdi-delete"
                >
                  {{ $t('Delete') }}
                </v-btn>
              </template>
            </question-answer-card> </v-col
          ><v-spacer />
        </v-row>
      </v-card-text>

      <v-card-actions
        :class="!answers ? 'text-center mb-4' : 'd-flex justify-center mb-4'"
      >
        <v-btn
          rounded
          color="primary"
          class="text-white px-8"
          variant="flat"
          elevation="0"
          prepend-icon="mdi-plus"
          @click="openDialog('post', id)"
        >
          <span >
            {{ $t('Submit') }}
          </span>
        </v-btn>
      </v-card-actions>
    </v-card>
    <question-dialog
  v-model="dialog.value"
  :type="dialog.type!"
  :id="dialog.id"
  :item="selectedAnswer"
  @confirm="onConfirm"
/>
    <question-delete-dialog
      v-if="selectedAnswer"
      v-model="dialogDelete.value"
      :item="selectedAnswer"
      @confirm="onDeleteConfirm"
    />
  </v-container>
</template>
