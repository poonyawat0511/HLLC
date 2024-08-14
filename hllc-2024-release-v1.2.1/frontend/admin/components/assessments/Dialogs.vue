<script setup lang="ts">
const { $api } = useNuxtApp()
const emit = defineEmits(['submit', 'snackbar'])
const dialog = defineModel<boolean>({ default: false })
const dialogConfirm = ref(false)
const props = defineProps({
  actions: {
    type: Object,
    required: true,
  },
  dialogDetail: {
    type: Object,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
})

interface CreateDialogConfirm {
  image: string
  title: string
  section: string
}

const dialogConfirmDetail = reactive<CreateDialogConfirm>({
  image: '',
  title: '',
  section: '',
})

interface DialogModel {
  status: string
  type: string
  id: string
  required: boolean
  assessment: {
    th: string
    en: string
  }
  section: {
    _id: string
    title: {
      th: string
      en: string
    }
  }
}

const createDialog = ref<DialogModel>({
  status: '',
  type: '',
  id: '',
  required: false,
  assessment: {
    th: '',
    en: '',
  },
  section: {
    _id: '',
    title: {
      th: '',
      en: '',
    },
  },
})

const openDialogAssessmentConfirm = () => {
  switch (props.actions.type) {
    case 'create':
      onDialogConfirm('Confirm assessment creation?', '../../icons/error.png')
      break
    case 'update':
      onDialogConfirm('Confirm editing of assessment?', '../../icons/error.png')
      break
  }
}

const resetForm = () => {
  createDialog.value = {
    status: '',
    type: '',
    id: '',
    required: false,
    assessment: {
      th: '',
      en: '',
    },
    section: {
      _id: '',
      title: {
        th: '',
        en: '',
      },
    },
  }
  dialog.value = false
}

const onDialogConfirm = (title: string, image: string) => {
  dialogConfirmDetail.title = title
  dialogConfirmDetail.image = image
  dialogConfirm.value = true
}

async function confirmAction() {
  switch (props.actions.type) {
    case 'create':
      await createAssessment()
      resetForm()
      emit('submit')
      break
    case 'update':
      await editAssessment()
      resetForm()
      emit('submit')
      break
  }
}

const editAssessment = async () => {
  try {
    await $api.put(`/assessments/${props.dialogDetail.id}`, {
      body: {
        assessment: {
          th: createDialog.value.assessment.th,
          en: createDialog.value.assessment.en,
        },
        status: createDialog.value.status,
        type: createDialog.value.type,
        required: createDialog.value.required,
        section: createDialog.value.section._id,
      },
    })
    onSnackbar('Update assessment successfully', 'success')
    resetForm()
    emit('submit')
  } catch (error) {
    console.error('Error updating assessment:', error)
    onSnackbar(`Error: ${error}`, 'error')
  }
}

const createAssessment = async () => {
  try {
    await $api.post('/assessments', {
      body: {
        assessment: {
          th: createDialog.value.assessment.th,
          en: createDialog.value.assessment.en,
        },
        status: createDialog.value.status,
        type: createDialog.value.type,
        required: createDialog.value.required,
        section: createDialog.value.section._id,
      },
    })
    onSnackbar('Create assessment successfully', 'success')
    emit('submit')
  } catch (error) {
    console.error('Error :', error)
    onSnackbar(`Error :`, `${error}`)
  }
}

const tranData = () => {
  if (props.dialogDetail) {
    if (Array.isArray(props.dialogDetail.status)) {
      createDialog.value.status = props.dialogDetail.status[0]
    } else {
      createDialog.value.status = props.dialogDetail.status
    }
    createDialog.value.type = props.dialogDetail.type
    createDialog.value.section._id = props.dialogDetail.section.id
    createDialog.value.required = props.dialogDetail.required
    createDialog.value.assessment.th = props.dialogDetail.assessment.th
    createDialog.value.assessment.en = props.dialogDetail.assessment.en
  }
}
watch(
  () => props.dialogDetail,
  () => {
    tranData()
  }
)
interface CreateSnackbarNotify {
  title: string
  type: string
}

const snackbarNotify = reactive<CreateSnackbarNotify>({
  title: '',
  type: '',
})

const onSnackbar = (title: string, type: string) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  emit('snackbar', { title, type })
}
</script>

<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="700px">
    <v-col>
      <v-card class="rounded-xl pa-4" elevation="5">
        <v-card-title>
          <span class="text-dark font-weight-medium">{{
            props.actions.title
          }}</span>
          <v-divider class="mt-2 mb-2" />
        </v-card-title>
        <v-card-text class="pa-0">
          <v-select
            v-model="createDialog.status"
            label="Status"
            :items="['pretest', 'posttest']"
            item-title="text"
            item-value="value"
            variant="outlined"
            density="comfortable"
            rounded
          />
          <v-select
            v-model="createDialog.type"
            label="Type of Question"
            :items="['text', 'ratings']"
            variant="outlined"
            density="comfortable"
            rounded
          />
          <v-select
            v-model="createDialog.section._id"
            label="Section"
            :items="props.data"
            item-value="id"
            item-title="title.en"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            rounded
          />
          <div class="d-flex justify-end">
            <v-switch
              v-model="createDialog.required"
              color="black"
              label="Required"
              hide-details
            />
          </div>
          <v-textarea
            v-model="createDialog.assessment.en"
            label="Assessment English"
            variant="outlined"
            rounded
          />
          <v-textarea
            v-model="createDialog.assessment.th"
            hide-details="auto"
            label="Assessment Thai"
            variant="outlined"
            rounded
          />
        </v-card-text>
        <v-card-actions class="d-flex justify-center py-0 mt-3">
          <v-btn
            rounded="xl"
            variant="flat"
            class="text-red"
            @click="resetForm()"
          >
            Cancel
          </v-btn>
          <v-btn
            rounded="lg"
            variant="flat"
            color="black"
            @click="openDialogAssessmentConfirm()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <DialogConfirm
      v-model="dialogConfirm"
      :image="dialogConfirmDetail.image"
      :title="dialogConfirmDetail.title"
      @submit="confirmAction()"
    />
  </v-dialog>
</template>
