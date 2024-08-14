<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/progress', title: 'Progress Management' },
  ],
})
const { data: staff } = useAuth()
const { $api } = useNuxtApp()

interface ActivitiesModel {
  id: string
  name: {
    th: string
    en: string
  }
}

interface ErrorResponse {
  response: {
    _data: {
      message: string
    }
  }
}

interface UserModel {
  id: string
  fullName: string
  username: string
}

interface CheckInsModel {
  id: string
  user: string
  activity: string
}

const userModel = ref<UserModel>({
  id: '',
  fullName: '',
  username: '',
})

const actData = ref<ActivitiesModel[]>([])
const snackbar = ref(false)

const fetchActivity = async () => {
  try {
    const act = await $api.get<{ data: ActivitiesModel[] }>('activities')
    actData.value = act.data
  } catch (error) {
    const err = error as ErrorResponse
    console.error(err)
  }
}

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

const progressData = ref<CheckInsModel[]>([])
const processUser = ref<
  Array<Record<string, string | { value: string; checkInId: string }>>
>([])

const getProgress = async (user: UserModel) => {
  try {
    const progress = await $api.get<{ data: CheckInsModel[] }>(
      `/check-ins/search/${user.id}`
    )
    progressData.value = progress.data
    mapData()
  } catch (error) {
    console.error(error)
  }
}

const studentId = ref()
const searchDataUser = async () => {
  const username = userModel.value.username

  if (username.length === 10) {
    try {
      const response = await $api.get<{ data: UserModel }>(
        `users/search/${username}`
      )
      getProgress(response.data)
      studentId.value = response.data
    } catch (error) {
      console.error(error)
    }
  } else {
    onSnackbar('Invalid student ID', 'warning')
  }
}

const mapData = () => {
  if (!progressData.value.length) {
    processUser.value = [
      {
        username: userModel.value.username,
        ...actData.value.reduce((acc, activity) => {
          acc[activity.id] = { value: '0', checkInId: '' }
          return acc
        }, {} as Record<string, { value: string; checkInId: string } >),
      },
    ]
    return
  }

  const userProgress = progressData.value as CheckInsModel[]

  const data = actData.value.map((activity) => {
    const progressMatch = userProgress.find(
      (progress) => progress.activity === activity.id
    )
    const isCompleted = progressMatch ? '1' : '0'
    const checkInId = progressMatch ? progressMatch.id : ''

    return {
      activityId: activity.id,
      [activity.id]: { value: isCompleted, checkInId },
    }
  })

  processUser.value = [
    {
      username: userModel.value.username,
      ...data.reduce(
        (acc, item) => ({
          ...acc,
          [item.activityId]: item[item.activityId],
        }),
        {}
      ),
    },
  ]
}

const dynamicHeader = computed(() => {
  const additionalHeaders = actData.value.map((activity) => ({
    title: activity.name.en,
    key: `${activity.id}`,
  }))
  return [...headers.value, ...additionalHeaders]
})

const headers = ref([{ title: 'Student ID', key: 'username' }])
const dynamicHeaders = computed(() => {
  const additionalHeaders = actData.value.map((activity) => ({
    title: activity.name.en,
    key: `${activity.id}.value`,
  }))
  return [
    ...headers.value,
    ...additionalHeaders,
    { title: 'Actions', key: 'actions' },
  ]
})

const dialogEditor = ref(false)
const actDataSelected = ref<Record<string, string | { value: string; checkInId: string; }>>()

const onChange = (activityData: Record<string, string | { value: string; checkInId: string; }>) => {
  actDataSelected.value = { ...activityData }
  dialogEditor.value = true
}

onMounted(() => {
  fetchActivity()
})
</script>

<template>
  <v-container fluid>
    <v-row class="d-flex align-center justify-center">
      <v-col cols="12" md="6" class="d-flex">
        <h2>Progress Management</h2>
      </v-col>
      <v-col cols="12" md="6" class="d-flex mb-2">
        <v-text-field
          v-model="userModel.username"
          class="mr-2"
          density="compact"
          label="Search"
          placeholder="Enter your student id"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details="auto"
          maxlength="10"
          rounded="lg"
          @keydown.enter="searchDataUser"
        />
        <v-btn class="rounded-lg" color="black" @click="searchDataUser">
          Search
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="rounded-lg pa-2" elevation="0" border>
      <v-data-table
        :headers="dynamicHeaders"
        :items="processUser"
        hide-default-footer
      >
        <template #[`item.actions`]="{ item }">
          <v-btn variant="text" icon @click="onChange(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>

        <template #no-data>
          <v-chip variant="outlined" rounded="lg" color="error">
            No search username
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackbarNotify.type">
      {{ snackbarNotify.title }}
    </v-snackbar>
    <user-DialogEditorProgress
      v-model="dialogEditor"
      :staff="staff"
      :act-data="actDataSelected"
      :dynamic-headers="dynamicHeader"
      :student-id="studentId"
      @submit="getProgress(studentId)"
    />
  </v-container>
</template>
