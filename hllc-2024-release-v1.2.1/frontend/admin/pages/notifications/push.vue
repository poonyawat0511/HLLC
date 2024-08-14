<script setup lang="ts">
import type { VTextField, VForm } from 'vuetify/components'
import backgroundImage from '@/assets/images/bg.jpg'
const { $api } = useNuxtApp()

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/notifications', title: 'Notifications' },
    { to: '/notifications/push', title: 'Push Notification' },
  ],
})

enum RecipientType {
  Major = 'MAJOR',
  School = 'SCHOOL',
  Individual = 'INDIVIDUAL',
}

interface Recipient {
  type: RecipientType
  id: string
}

interface INotification {
  title: {
    th: string
    en: string
  }
  subtitle: {
    th: string
    en: string
  }
  detail: {
    th: string
    en: string
  }
  icon: string
  image: string | File
  redirect: {
    url: string
    btnMessage: {
      th: string
      en: string
    }
  } | null
  recipients: 'everyone' | Recipient[]
}

const notiData = reactive<INotification>({
  title: {
    th: '',
    en: '',
  },
  subtitle: {
    th: '',
    en: '',
  },
  detail: {
    th: '',
    en: '',
  },
  icon: '',
  image: '',
  redirect: {
    url: '',
    btnMessage: {
      th: '',
      en: '',
    },
  },
  recipients: 'everyone',
})

const imagePreview = ref<string>()
const form = ref<VForm | null>()
const snackbar = inject<Snackbar>('snackbar')

const inputProps = computed(() => {
  return {
    variant: 'outlined',
    density: 'compact',
    rules: [(v) => !!v || 'Value is required'],
  } satisfies VTextField['$props']
})

// Submit Notification
const pushNotification = async () => {
  try {
    const { valid } = await form.value!.validate()
    if (!valid) return
    if (everyoneSwitch.value) {
      notiData.recipients = 'everyone'
    } else {
      notiData.recipients = recipients.value
    }
    const { redirect, ...data } = notiData
    const item = Object.assign({}, data)
    if (redirectSwitch.value) {
      Object.assign(item, { redirect })
    }
    const formData = objectToFormData(item)
    await $api.post<ApiResponse<INotification>>('notifications', {
      body: formData,
    })

    snackbar?.open('Push notification successfully', 'success')
  } catch (error) {
    snackbar?.open('Push notification failed with error: ' + error, 'error')
    console.error(error)
  }
}

//Handle upload image
const onChangeImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const selectedFile = target.files[0]
    notiData.image = selectedFile
    imagePreview.value = URL.createObjectURL(selectedFile)
  } else {
    notiData.image = ''
    imagePreview.value = undefined
  }
}

const redirectSwitch = ref(false)
const everyoneSwitch = ref(false)

// Time Preview
const currentDate = ref(new Date())

const formatDate = () => {
  return `${currentDate.value.toLocaleDateString('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} | ${currentDate.value.toLocaleTimeString('en', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })}`
}

const formattedDate = computed(() => formatDate())

interface IUserInfo {
  id: string
  username: string
  fullName: string
}

const users = ref<IUserInfo[]>([])
const schools = ref<SchoolEntity[]>([])
const majors = ref<MajorEntity[]>([])
const icons = ref<string[]>([])

interface RecipientItem {
  title: string
  subtitle: string
  value: Recipient
}

const recipients = ref<Recipient[]>([])
const items = computed<RecipientItem[]>(() => {
  return [
    ...users.value.map((user) => ({
      title: `${user.username} : ${user.fullName}`,
      subtitle: 'Student',
      props: {
        prependIcon: 'mdi-account',
      },
      value: { type: RecipientType.Individual, id: user.id },
    })),
    ...schools.value.map((school) => ({
      title: `${school.acronym} : ${school.name.en}`,
      subtitle: 'School',
      props: {
        prependIcon: 'mdi-school',
      },
      value: { type: RecipientType.School, id: school.id },
    })),
    ...majors.value.map((major) => ({
      title: `${major.acronym} : ${major.name.en}`,
      subtitle: 'Major',
      props: {
        prependIcon: 'mdi-account-school',
      },
      value: { type: RecipientType.Major, id: major.id },
    })),
  ]
})

async function fetchUsers() {
  try {
    const response = await $api.get<ApiResponse<IUserInfo[]>>('users')
    users.value = response.data
  } catch (error) {
    console.error(error)
  }
}

async function fetchSchools() {
  try {
    const response = await $api.get<ApiResponse<SchoolEntity[]>>('schools')
    schools.value = response.data
  } catch (error) {
    console.error(error)
  }
}

async function fetchMajors() {
  try {
    const response = await $api.get<ApiResponse<MajorEntity[]>>('majors')
    majors.value = response.data
  } catch (error) {
    console.error(error)
  }
}

async function fetchIcons() {
  try {
    const response = await $fetch<{ name: string }[]>(
      `https://cdn.jsdelivr.net/npm/@mdi/svg@7.4.47/meta.json`
    )
    icons.value = response.map(({ name }) => `mdi-${name}`)
  } catch (error) {
    console.error(error)
  }
}

const rules = {
  recipient: [() => !!recipients.value?.length || 'Recipients is required'],
  image: [() => !!notiData.image || 'Image is required'],
}

onMounted(() => {
  setInterval(() => {
    currentDate.value = new Date()
  }, 60000)
  fetchUsers()
  fetchSchools()
  fetchMajors()
  fetchIcons()
})
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-form ref="form">
          <v-row dense>
            <!-- Recipients Selector -->
            <v-col cols="12">
              <v-card rounded="lg" variant="outlined" class="border">
                <v-card-title>
                  <span class="text-dark font-weight-medium">Recipients</span>
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-switch
                    v-model="everyoneSwitch"
                    color="success"
                    label="Everyone"
                    hide-details
                  />
                  <!-- Recipient input -->
                  <v-autocomplete
                    v-if="!everyoneSwitch"
                    v-model="recipients"
                    v-bind="inputProps"
                    :items="items"
                    :rules="rules.recipient"
                    item-title="title"
                    item-value="value"
                    label="Recipient"
                    multiple
                    chips
                    closable-chips
                  >
                    <template #item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :prepend-avatar="item.raw.avatar"
                        :subtitle="item.raw.subtitle"
                        :title="item.raw.title"
                      /> </template
                  ></v-autocomplete>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <!-- Information -->
              <v-card rounded="lg" variant="outlined" class="border">
                <v-card-title>Notification Info</v-card-title>
                <v-divider />
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        v-model="notiData.title.th"
                        label="Title (TH)"
                        v-bind="inputProps"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="notiData.title.en"
                        label="Title (EN)"
                        v-bind="inputProps"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="notiData.subtitle.th"
                        label="Subtitle (TH)"
                        v-bind="inputProps"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="notiData.subtitle.en"
                        label="Subtitle (EN)"
                        v-bind="inputProps"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="notiData.detail.th"
                        label="Detail (TH)"
                        v-bind="inputProps"
                        auto-grow
                        rows="2"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="notiData.detail.en"
                        label="Detail (EN)"
                        v-bind="inputProps"
                        auto-grow
                        rows="2"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="notiData.icon"
                        v-bind="inputProps"
                        label="Icon"
                        :items="icons"
                      >
                        <template #prepend-inner>
                          <v-icon :icon="notiData.icon" />
                        </template>
                        <template #item="{ props, item }">
                          <v-list-item
                            v-bind="props"
                            :prepend-icon="item.raw"
                            :title="item.raw"
                          />
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-file-input
                        label="Image Upload"
                        accept="image/*"
                        v-bind="inputProps"
                        :rules="rules.image"
                        persistent-hint
                        @change="onChangeImage($event)"
                        @click:clear="onChangeImage($event)"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card rounded="lg" variant="outlined" class="border">
                <v-card-title class="d-flex align-center">
                  Button <v-spacer />
                  <v-switch
                    v-model="redirectSwitch"
                    color="primary"
                    hide-details
                  />
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-row v-if="redirectSwitch" dense>
                    <v-col cols="12">
                      <v-text-field
                        v-model="notiData.redirect!.btnMessage.th"
                        label="Redirect Message (TH)"
                        v-bind="inputProps"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="notiData.redirect!.btnMessage.en"
                        label="Redirect Message (EN)"
                        v-bind="inputProps"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="notiData.redirect!.url"
                        label="Redirect URL"
                        v-bind="inputProps"
                        persistent-hint
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col cols="12" md="6">
        <!-- Preview card -->
        <v-card rounded="lg" variant="outlined" class="border">
          <v-card-title>
            <span class="text-dark font-weight-medium"> Preview </span>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-card
              flat
              rounded="lg"
              style="
                overflow-y: auto;
                background-size: cover;
                background-position: center;
              "
              :style="{ backgroundImage: `url(${backgroundImage})` }"
            >
              <v-card-text>
                <v-card
                  rounded="lg"
                  elevation="0"
                  style="background-color: rgba(255, 255, 255, 0.7)"
                  class="mb-3"
                >
                  <!-- Icon -->
                  <template #prepend>
                    <v-responsive height="50px" width="50px">
                      <v-icon :icon="notiData.icon" />
                    </v-responsive>
                  </template>
                  <template #append>
                    <span style="font-size: 12px">
                      {{ formattedDate }}
                    </span>
                  </template>
                  <template #title>{{ notiData.title.en }}</template>
                  <v-card-text class="mb-3">
                    <!-- Subtitle -->
                    <div class="d-flex flex-no-wrap justify-space-between">
                      <div>
                        <div class="box-subtitle">
                          {{ notiData.subtitle.en }}
                        </div>
                        <div class="box-detail">
                          {{ notiData.detail.en }}
                        </div>
                      </div>
                      <div>
                        <v-responsive height="50px" width="50px">
                          <v-img :src="imagePreview" />
                        </v-responsive>
                      </div>
                    </div>
                    <!-- Redirect btn -->
                    <div class="d-flex flex-no-wrap justify-end">
                      <v-btn
                        v-if="redirectSwitch"
                        variant="flat"
                        rounded
                        color="blue"
                        class="px-7 mt-3"
                      >
                        {{ notiData.redirect?.btnMessage.en }}
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-divider />
          <!-- Push noti -->
          <v-card-actions class="d-flex justify-end">
            <v-btn
              text="push"
              type="submit"
              variant="flat"
              color="primary"
              prepend-icon="mdi-bell-ring"
              @click="pushNotification"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.align-center {
  align-items: center;
}
.position-absolute {
  position: absolute;
}
.top-0 {
  top: 0;
}
.end-0 {
  right: 0;
}
</style>
