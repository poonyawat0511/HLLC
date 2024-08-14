<script setup lang="ts">
const questionCreate = defineModel<boolean>({ default: false })
const dialogConfirm = ref(false)
const Rules = [(v: string) => !!v || 'Topic is required']
const emit = defineEmits(['submit'])

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: '',
  },
  icon: {
    type: String,
    required: true,
    default: '',
  },
  activities: {
    type: Object,
    required: true,
    default: () => null,
  },
  question: {
    type: Object,
    required: true,
    default: () => null,
  },
})
interface DialogModel {
  id: string
  question: {
    th: string
    en: string
  }
  activity: {
    id: string
    name : {
      th :string,
      en : string
    }
  }
  type: string
  required: boolean
}
const dialogDetail = ref<DialogModel>({
  id: '',
  question: {
    th: '',
    en: '',
  },
  activity: {
    id: '',
    name : {
      th :'',
      en : ''
    }
  },
  type: '',
  required: true,
})
const resetForm = () => {
  dialogDetail.value = {
    id: '',
    question: {
      th: '',
      en: '',
    },
    activity: {
      id: '',
      name : {
      th :'',
      en : ''
    }
    },
    type: '',
    required: true,
  }
  questionCreate.value = false
}

watch(
  () => props.question,
  (newQuestion) => {
    if (newQuestion) {
      dialogDetail.value = {
        id: newQuestion.id,
        question: {
          th: newQuestion.question.th,
          en: newQuestion.question.en,
        },
        activity: newQuestion.activity,
        type: newQuestion.type,
        required: newQuestion.required,
      }
      questionCreate.value = true
    } else {
      resetForm() // Clear form if no question provided
    }
  }
)
interface CreateDialogConfirm {
  image: string
  title: string
}
const dialogConfirmDetail = reactive<CreateDialogConfirm>({
  image: '',
  title: '',
})

const confirmAction = () => {
  const question: DialogModel = {
    id: dialogDetail.value.id,
    question: dialogDetail.value.question,
    activity: dialogDetail.value.activity,
    type: dialogDetail.value.type,
    required: dialogDetail.value.required,
  }
  emit('submit', question)
  resetForm()
}
//Form Invalid
const isFormValid = computed(() => {
  const { question, activity, type } = dialogDetail.value
  return (
    question.th.trim() !== '' &&
    question.en.trim() !== '' &&
    activity.trim() !== '' &&
    type.trim() !== ''
  )
})
</script>

<template>
  <v-dialog v-model="questionCreate" persistent max-width="600px">
    <v-card class="rounded-xl pa-4" elevation="5">
      <v-card-title>
        <v-icon>{{ props.icon }}</v-icon>
        <span class="ml-2 font-weight-medium">{{ props.title }}</span>
        <v-divider class="mb-3 mt-1" />
      </v-card-title>
      <v-card-text class="py-0">
        <v-select
          v-model="dialogDetail.activity"
          label="Activity"
          :items="props.activities"
          item-value="id"
          item-title="name.en"
          :rules="Rules"
          variant="outlined"
          density="comfortable"
          rounded="lg"
        />
        <v-select
          v-model="dialogDetail.type"
          label="Type of Question"
          :items="['RATINGS' ,'TEXT' ]"
          class="mt-4"
          :rules="Rules"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          rounded="lg"
        />
        <div class="d-flex justify-end">
          <v-switch
            v-model="dialogDetail.required"
            color="black"
            label="Required"
            hide-details
          />
        </div>
        <v-textarea
          v-model="dialogDetail.question.en"
          label="Question English"
          :rules="Rules"
          variant="outlined"
          rounded="lg"
        />
        <v-textarea
          v-model="dialogDetail.question.th"
          hide-details="auto"
          label="Question Thai"
          :rules="Rules"
          class="mt-3"
          variant="outlined"
          rounded="lg"
        />
      </v-card-text>
      <v-card-actions class="d-flex justify-center py-0 mt-3">
        <v-btn rounded="lg" variant="text" @click="resetForm()"> Cancel </v-btn>
        <v-btn
          rounded="lg"
          variant="flat"
          color="black"
          :disabled="!isFormValid"
          @click="confirmAction()"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <DialogConfirm
    v-model="dialogConfirm"
    :image="dialogConfirmDetail.image"
    :title="dialogConfirmDetail.title"
    @submit="confirmAction()"
  />
</template>
