<template>
  <v-dialog v-model="dialogCreateSection" persistent max-width="600px">
    <v-card class="rounded-xl pa-4" elevation="5">
      <v-card-title>
        <span class="text-black font-weight-medium">{{
          props.actions.title
        }}</span>
        <v-divider class="mt-2 mb-2" />
      </v-card-title>
      <v-card-text class="py-0">
        <v-text-field
          v-model="sectionDetails.order"
          type="number"
          label="Order"
          variant="outlined"
          rounded
        />
        <v-textarea
          v-model="sectionDetails.title.th"
          rows="1"
          label="Title Thai"
          variant="outlined"
          rounded
        />
        <v-textarea
          v-model="sectionDetails.title.en"
          rows="1"
          label="Title English"
          variant="outlined"
          rounded
        />
        <v-textarea
          v-model="sectionDetails.details.th"
          label="Detail Thai"
          variant="outlined"
          rounded
        />
        <v-textarea
          v-model="sectionDetails.details.en"
          label="Detail English"
          variant="outlined"
          rounded
        />
      </v-card-text>
      <v-card-actions class="d-flex justify-center py-0 mt-3">
        <v-btn
          rounded="xl"
          variant="text"
          color="error"
          @click="closeDialogSection()"
        >
          Cancel
        </v-btn>
        <v-btn
          rounded="lg"
          variant="flat"
          color="black"
          @click="openDialogSectionConfirm()"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
    <DialogConfirm
      v-model="dialogConfirmSection"
      :image="dialogConfirmDetail.image"
      :title="dialogConfirmDetail.title"
      @submit="confirmActionSection"
    />
    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
  </v-dialog>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const props = defineProps({
  actions: { type: Object, required: true },
  sectionDetailsOld: { type: Object, required: true },
})

const dialogCreateSection = defineModel<boolean>({ default: false })
const emit = defineEmits(['submit', 'snackbar'])

const snackbarNotify = reactive({
  title: '',
  type: '',
})

const onSnackbar = (title: string, type: string) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  if (title.value === 'Section order is already have') {
    snackbar.value = true
  }
  emit('snackbar', { title, type })
}

const snackbar = ref(false)

const closeDialogSection = () => {
  dialogCreateSection.value = false
  resetFormSection()
}

const resetFormSection = () => {
  sectionDetails.value = {
    title: { th: '', en: '' },
    details: { th: '', en: '' },
    order: 0,
  }
}

const createSection = async () => {
  try {
    await $api.post('/assessment-sections', {
      body: {
        title: {
          th: sectionDetails.value.title.th,
          en: sectionDetails.value.title.en,
        },
        details: {
          th: sectionDetails.value.details.th,
          en: sectionDetails.value.details.en,
        },
        order: Number(sectionDetails.value.order),
      },
    })
    closeDialogSection()
    onSnackbar('Section created successfully', 'success')
    emit('submit')
  } catch (error) {
    if (error.statusCode === 409) {
      onSnackbar('Section order is already have', 'error')
    } else {
      closeDialogSection()
      onSnackbar('Error creating section', 'error')
    }
  }
}

const dialogConfirmDetail = reactive({
  image: '',
  title: '',
})

const dialogConfirmSection = ref(false)

const onDialogConfirmSection = (title: string, image: string) => {
  dialogConfirmDetail.title = title
  dialogConfirmDetail.image = image
  dialogConfirmSection.value = true
}

const openDialogSectionConfirm = () => {
  onDialogConfirmSection('Confirm section creation?', '../../icons/error.png')
}

const sectionDetails = ref<SectionModel>({
  title: { th: '', en: '' },
  details: { th: '', en: '' },
  order: 0,
})

interface SectionModel {
  title: { th: string; en: string }
  details: { th: string; en: string }
  order: number
}

const confirmActionSection = async () => {
  await createSection()
}
</script>
