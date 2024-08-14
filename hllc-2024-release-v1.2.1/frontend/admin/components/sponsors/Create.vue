<script setup lang="ts">
interface Sponsor {
  id?: string
  no: number
  name: {
    th: string
    en: string
  }
  logo: string | File
  show: boolean
  type: string
}
const props = defineProps<{
  dialog: boolean
  isEdit: boolean
  sponsorData: Sponsor | null
  fetchSponsor: () => void
}>()

const emit = defineEmits(['update:dialog'])

const { $api } = useNuxtApp()
const snackbar = ref(false)
const dialog = ref(props.dialog)
const sponsor = ref<Sponsor>(
  props.sponsorData || {
    no: 0,
    name: {
      th: '',
      en: '',
    },
    logo: '',
    show: true,
    type: 'NORMAL',
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
function closeDialog() {
  dialog.value = false
  emit('update:dialog', false)
}
const onSnackbar = (title: string, type: string) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  snackbar.value = true
}
watch(
  () => props.dialog,
  (newVal) => {
    dialog.value = newVal
    if (newVal) {
      if (props.isEdit && props.sponsorData) {
        sponsor.value = { ...props.sponsorData }
      } else {
        sponsor.value = {
          no: 0,
          name: {
            th: '',
            en: '',
          },
          show: true,
          logo: '',
          type: 'NORMAL',
        }
      }
    }
  }
)

const validateForm = (): boolean => {
  if (!sponsor.value.no) {
    onSnackbar('Number is required', 'error')
    return false
  }
  if (sponsor.value.no <= 0) {
    onSnackbar('Numbers must not be less than or equal to 0', 'warning')
    return false
  }
  if (!sponsor.value.name.th) {
    onSnackbar('Name (TH) is required', 'error')
    return false
  }
  if (!sponsor.value.name.en) {
    onSnackbar('Name (EN) is required', 'error')
    return false
  }
  if (!sponsor.value.logo) {
    onSnackbar('Logo is required', 'error')
    return false
  }
  return true
}
const handleCreateError = (error: unknown) => {
  const message = getErrorMessage(error)
  console.log(message)
  if (message === `Data is duplicated while creating Sponsor`) {
    onSnackbar('The numbers are already in use.', 'warning')
  } else if (message === `Internal server error`) {
    onSnackbar('The numbers are already in use.', 'warning')
  } else {
    return onSnackbar('Error', 'error')
  }
}
const saveSponsor = async () => {
  if (!validateForm()) {
    return
  }
  try {
    const formData = new FormData()
    formData.append('no', sponsor.value.no.toString()) // Include 'no' field
    formData.append('name[th]', sponsor.value.name.th)
    formData.append('name[en]', sponsor.value.name.en)
    formData.append('type', sponsor.value.type.toString())
    formData.append('show', sponsor.value.show.toString())
    if (sponsor.value.logo instanceof File) {
      formData.append('logo', sponsor.value.logo)
    }
    if (props.isEdit && sponsor.value.id) {
      await $api.put(`/sponsors/${sponsor.value.id}`, { body: formData }) // Use $api for API requests
      onSnackbar('Edit sponsor successfully', 'success')
    } else {
      await $api.post('/sponsors', { body: formData }) // Use $api for API requests
      onSnackbar('Create sponsor successfully', 'success')
    }
    emit('update:dialog', false)
    props.fetchSponsor()
  } catch (error) {
    console.log(error)
    handleCreateError(error)
  }
}

const dialogTitle = computed(() =>
  props.isEdit ? 'Edit Sponsor' : 'Create New Sponsor'
)
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="rounded-xl elevation-0">
      <v-card-title class="mt-2 mb-n2">
        <span class="text-h5 ml-3 mt-2">{{ dialogTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" md="6">
              <base-image-upload
                v-model="sponsor.logo"
                :aspect-ratio="4 / 3"
                contain
                placeholder="Click to upload logo"
                style="background-color: black; color: white"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="sponsor.no"
                    label="Number"
                    variant="outlined"
                    type="number"
                    hide-details
                    rounded
                  />
                  <v-text-field
                    v-model="sponsor.name.th"
                    label="Name (TH)"
                    variant="outlined"
                    hide-details
                    rounded
                    class="my-3"
                  />
                  <v-text-field
                    v-model="sponsor.name.en"
                    label="Name (EN)"
                    variant="outlined"
                    hide-details
                    rounded
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-select
                v-model="sponsor.show"
                :items="[
                  { title: 'Show on list', value: true },
                  { title: 'Hide on list', value: false },
                ]"
                label="Show"
                variant="outlined"
                class="mt-3"
                hide-details
                rounded
              />
              <v-select
                v-model="sponsor.type"
                :items="['NORMAL', 'SCAN']"
                label="Type"
                variant="outlined"
                class="mt-3"
                hide-details
                rounded
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="my-1">
        <v-spacer />
        <v-btn rounded @click="closeDialog()"> Cancel </v-btn>
        <v-btn
          variant="flat"
          class="px-5"
          color="black"
          rounded
          @click="saveSponsor"
          >Save</v-btn
        >
        <v-spacer />
      </v-card-actions>
    </v-card>
    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
  </v-dialog>
</template>
<style scoped>
.image-placeholder {
  width: 100%;
  height: 260px;
  border: 1px dashed #ccc;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  background-color: #aaa;
}
</style>
