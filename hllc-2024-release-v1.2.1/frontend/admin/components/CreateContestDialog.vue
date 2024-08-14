<script setup lang="ts">
const { $api } = useNuxtApp()
const emit = defineEmits(['submit'])
const createDialog = defineModel<boolean>({ default: false })
const props = defineProps({
  formTitle: {
    type: String,
    default: '',
  },
  identify: {
    type: Object,
    default: null,
  },
})

interface ContestModel {
  team: string
  title: {
    th: string
    en: string
  }
  category: {
    th: string
    en: string
  }
  description: {
    th: string
    en: string
  }
  coverImage: string
  coverImagePath: string
  members: [{ name: string; studentId: string }]
  url: string
}
const tranData = () => {
  if (props.identify) {
    contestDialog.value.team = props.identify.team
    contestDialog.value.title.th = props.identify.title.th
    contestDialog.value.title.en = props.identify.title.en
    contestDialog.value.category.th = props.identify.category.th
    contestDialog.value.category.en = props.identify.category.en
    contestDialog.value.description.th = props.identify.description.th
    contestDialog.value.description.en = props.identify.description.en
    contestDialog.value.coverImage = props.identify.coverImage
    contestDialog.value.coverImagePath = props.identify.coverImage
    contestDialog.value.members = props.identify.members
    contestDialog.value.url = props.identify.url
  }
}
const resetFrom = () => {
  contestDialog.value = {
    team: '',
    title: {
      th: '',
      en: '',
    },
    category: {
      th: '',
      en: '',
    },
    description: {
      th: '',
      en: '',
    },
    coverImage: '',
    coverImagePath: '',
    members: [{ name: '', studentId: '' }],
    url: '',
  }
}
const contestDialog = ref<ContestModel>({
  team: '',
  title: {
    th: '',
    en: '',
  },
  category: {
    th: '',
    en: '',
  },
  description: {
    th: '',
    en: '',
  },
  coverImage: '',
  coverImagePath: '',
  members: [{ name: '', studentId: '' }],
  url: '',
})

const fileInputs = ref(String as unknown as HTMLInputElement)

const triggerFileInput = () => {
  fileInputs.value.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const selectedFile = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      contestDialog.value.coverImagePath = contestDialog.value.coverImage
      contestDialog.value.coverImage = reader.result as string
    }
    reader.readAsDataURL(selectedFile)
  }
}

const dialogError = ref(false)
const addMember = () => {
  contestDialog.value.members.push({ name: '', studentId: '' })
}

const removeMember = (index: number) => {
  if (contestDialog.value.members.length > 1) {
    contestDialog.value.members.splice(index, 1)
  } else {
    showErrorDialog('At least one member is required.')
  }
}

const showErrorDialog = (message: string) => {
  dialogMessage.value = message
  dialogError.value = true
}

const onSave = async () => {
  const formData = new FormData()
  formData.append('team', contestDialog.value.team)
  formData.append('title[th]', contestDialog.value.title.th)
  formData.append('title[en]', contestDialog.value.title.en)
  formData.append('category[th]', contestDialog.value.category.th)
  formData.append('category[en]', contestDialog.value.category.en)
  formData.append('description[th]', contestDialog.value.description.th)
  formData.append('description[en]', contestDialog.value.description.en)
  formData.append('url', contestDialog.value.url)
  contestDialog.value.members.forEach((member, index) => {
    formData.append(`members[${index}][name]`, member.name)
    formData.append(`members[${index}][studentId]`, member.studentId)
  })

  if (contestDialog.value.coverImagePath) {
    formData.append('coverImage', contestDialog.value.coverImagePath)
  } 


  try {
    if (!props.identify.id) {
      await $api.post('/contests', {
        body: formData,
      })
      onSnackbar('Create contest successfully', 'success')
    } else {
      await $api.put(`/contests/${props.identify.id}`, {
        body: formData,
      })
      onSnackbar('Update contest successfully', 'success')
    }
    resetFrom()
    createDialog.value = false
    emit('submit')
  } catch (error) {
    console.error('Error performing the operation:', error)
    onSnackbar('Error performing the operation', 'error')
  }
}

const onCancel = () => {
  createDialog.value = false
}

const closeErrorDialog = () => {
  dialogError.value = false
}

const dialogMessage = ref('')
const snackbar = ref(false)

interface CreateSnackbarNotify {
  title: string
  type: string
}

const snackbarNotify = ref<CreateSnackbarNotify>({
  title: '',
  type: '',
})

const onSnackbar = (title: string, type: string) => {
  snackbarNotify.value.title = title
  snackbarNotify.value.type = type
  snackbar.value = true
}

watch(
  () => props.identify,
  () => {
    tranData()
  }
)

const rules = () => {
  return (v: string | null) => !!v || 'This field is required'
}
</script>

<template>
  <v-dialog v-model="createDialog" persistent scrollable max-width="600px">
    <v-card class="rounded-xl pa-4">
      <v-card-title class="text-center">
        <span class="text-h5 text-dark">{{ props.formTitle }}</span>
      </v-card-title>
      <v-divider color="black" />
      <v-card-text>
        <v-col>
          <v-text-field
            v-model="contestDialog.team"
            label="Team name"
            required
            variant="outlined"
            rounded="xl"
            :rules="[rules()]"
          />
          <v-text-field
            v-model="contestDialog.title.th"
            label="Content title (TH)"
            required
            variant="outlined"
            rounded="xl"
            :rules="[rules()]"
          />
          <v-text-field
            v-model="contestDialog.title.en"
            label="Content title (EN)"
            required
            variant="outlined"
            rounded="xl"
            :rules="[rules()]"
          />
          <v-text-field
            v-model="contestDialog.category.th"
            label="Category (TH)"
            required
            variant="outlined"
            rounded="xl"
            :rules="[rules()]"
          />
          <v-text-field
            v-model="contestDialog.category.en"
            label="Category (EN)"
            required
            variant="outlined"
            rounded="xl"
            :rules="[rules()]"
          />
          <v-text-field
            v-model="contestDialog.description.th"
            label="Description (TH)"
            required
            variant="outlined"
            rounded="xl"
            :rules="[rules()]"
          />
          <v-text-field
            v-model="contestDialog.description.en"
            label="Description (EN)"
            required
            variant="outlined"
            rounded="xl"
            :rules="[rules()]"
          />
          <v-file-input
            ref="fileInputs"
            v-model="contestDialog.coverImage"
            accept="image/png, image/jpeg, image/bmp"
            label="Picture input"
            placeholder="Pick an avatar"
            prepend-icon=""
            variant="outlined"
            rounded="xl"
            style="display: none"
            :rules="[rules()]"
            @change="handleFileChange($event)"
          />
          <v-card
            v-if="contestDialog.coverImage"
            class="mb-4"
            variant="outlined"
            rounded="xl"
          >
            <v-img
              :src="contestDialog.coverImage"
              aspect-ratio="2.5"
              @click="triggerFileInput()"
            />
          </v-card>
          <v-card
            v-else
            class="mb-4"
            variant="outlined"
            max-width="200"
            max-height="200"
            rounded="xl"
            @click="triggerFileInput()"
          >
            <span class="ml-lg-2">Click to add new Image</span>
          </v-card>

          <v-text-field
            v-model="contestDialog.url"
            label="Input YouTube Link"
            required
            variant="outlined"
            rounded="xl"
            :rules="[rules()]"
          />
          <v-col>
            <h3>Members</h3>
          </v-col>
          <v-col
            v-for="(member, index) in contestDialog.members"
            :key="index"
            cols="12"
          >
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="member.name"
                  label="Member Name"
                  required
                  variant="outlined"
                  rounded="xl"
                  :rules="[rules()]"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="member.studentId"
                  label="Student ID"
                  required
                  variant="outlined"
                  rounded="xl"
                  :rules="[rules()]"
                />
              </v-col>
              <v-col cols="2" class="d-flex align-center justify-center">
                <v-btn icon @click="removeMember(index)">
                  <v-icon color="error">mdi-minus</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="2" class="d-flex align-center justify-center">
                <v-btn icon @click="addMember">
                  <v-icon color="green">mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" variant="text" @click="onCancel">Cancel</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="onSave">Save</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialogError" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="headline grey--text text--darken-2">
          <v-icon color="red darken-4">mdi-alert-circle</v-icon>
          Error
        </v-card-title>
        <v-card-text>
          <span>{{ dialogMessage }}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="closeErrorDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>

  <div>
    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
  </div>
</template>
