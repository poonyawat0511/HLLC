<script setup lang="ts">
const dialogAddfriend = defineModel<boolean>({ default: false })
const { question, user } = useFetchQuestions()
const { locale } = useI18n()
const { $api } = useNuxtApp()
const props = defineProps({
  dataFriend: {
    type: Object,
    required: true,
    default: null,
  },
})
const dialogText = ref()
const dialogError = ref(false)
const rules = {
  required: (value: string) => !!value || 'Plases answer this question !',
}

const sentNoti = async () => {
  const notiData = {
    title: {
      th: 'คุณมีคำขอเพิ่มเป็นเพื่อน',
      en: 'You have a friend request.',
    },
    subtitle: {
      th: `จาก ${user.value.fullName}`,
      en: `From ${user.value.fullName}`,
    },
    detail: {
      th: 'คุณต้องการเข้าไปดูเพิ่มเติมหรือไหม',
      en: 'Do you want to go see more?',
    },
    icon: 'mdi-star',
    image: new Blob([], { type: 'image/png' }), // Sending an empty blob
    redirect: {
      url: 'communities/?=true',
      btnMessage: {
        th: 'ไปดู',
        en: 'See',
      },
    },
    recipients: [
      {
        type: 'INDIVIDUAL',
        id: props.dataFriend.id,
      },
    ],
  }

  const { redirect, ...data } = notiData
  const item = Object.assign({}, data)
  Object.assign(item, { redirect })
  const formData = objectToFormData(item)

  try {
    await $api.post<INotification>('notifications', { body: formData })
  } catch (error) {
    dialogText.value = {
      th: 'เกิดข้อผิดพลาดในการส่งการเเจ้งเตือน',
      en: 'There was an error sending notifications.',
    }
    dialogError.value = true
  }
}

const confirm = async () => {
  // Access the actual data from the Ref
  const questionData = question.value
  // Check if 'data' exists and is an array
  if (questionData && Array.isArray(questionData)) {
    // Prepare the data to send
    const encodeToBase64 = (data: string): string => {
      return btoa(unescape(encodeURIComponent(data)))
    }
    const questionsToSend = questionData.map((q: AnswerResponse) => ({
      questionnaire: q.id,
      answer: encodeToBase64(String(q.answer)),
    }))
    try {
      await $api.post<{ data: Request[] }>(`answer-friends`, {
        body: {
          sender: user?.value.id,
          receiver: props.dataFriend.id,
          questions: questionsToSend,
        },
      })
      questionData.forEach((q: Answer) => {
        q.answer = ''
      })
      dialogAddfriend.value = false
      sentNoti()
    } catch (error) {
      const err = error as ErrorResponse
      if (
        err.response._data.message ===
        'Data is duplicated while creating AnswerQues'
      ) {
        dialogError.value = true
        dialogText.value = {
          th: 'คุณได้ทำการขอการเพิ่มเพื่อนแล้ว',
          en: 'You have requested to be added as a friend.',
        }
      } else {
        dialogError.value = true
        dialogText.value = {
          th: 'เกิดข้อผิดพลาดในการเพิ่มเพื่อน',
          en: 'There was an error adding friends.',
        }
      }
    }
  } else {
    console.error('Data property is missing or not an array in questionData.')
  }
}
</script>

<template>
  <v-dialog
    v-model="dialogAddfriend"
    max-width="30rem"
    persistent
    content-class="elevation-0"
    rounded="xl"
  >
    <v-card>
      <v-card-title>{{ $t('askFriend') }}</v-card-title>
      <v-card-text>
        <div v-for="(q, index) in question" :key="index">
          <v-card class="rounded-lg my-3 overflow-hidden">
            <v-card color="primary" elevation="0" max-height="10px">
              <v-card-title>..</v-card-title>
            </v-card>
            <v-card-text>
              <span class="text-h6 font-weight-bold">
                {{ q.questionnaire[locale] }}
              </span>
            </v-card-text>
            <v-col>
              <!-- text -->
              <div>
                <v-text-field
                  v-model="q.answer"
                  label="answer"
                  class="mt-5"
                  counter="300"
                  variant="outlined"
                  rounded
                  auto-grow
                  rows="1"
                  required
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
          </v-card>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn rounded class="text-error" @click="dialogAddfriend = false">
          {{ $t('isClose') }}
        </v-btn>
        <v-btn rounded @click="confirm"> {{ $t('submit') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <DialogError
    v-model="dialogError"
    :title="dialogText"
    @close="dialogAddfriend = false"
  />
</template>

<style scoped></style>
