<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/reset-password', title: 'Reset Password' },
  ],
})
const resetpasswordDialog = ref(false)
const snackbar = ref(false)
const items = ref<UserModel[]>([])
const { $api } = useNuxtApp()

const headers = ref([
  {
    title: 'Student ID',
    sortable: false,
    key: 'username',
  },
  { title: 'Full Name', sortable: false, key: 'fullName' },
  { title: 'Actions', sortable: false, key: 'actions' },
])

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

const userModel = ref<UserModel>({
  id: '',
  fullName: '',
  username: '',
})

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

/**
 * * search the user data
 */

const searchDataUser = async () => {
  const username = userModel?.value.username

  if (username.length == 10) {
    try {
      const response = await $api.get<{ data: UserModel }>(
        `/users/search/${username}`
      )

      if (response.data) {
        items.value = [response.data]
        onSnackbar('Search user successfuly', 'success')
      }
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response._data.message === 'User password is not set') {
        onSnackbar('User password is not set password', 'warning')
      } else if (err.response._data.message === 'User not found') {
        onSnackbar('User not found', 'error')
      } else {
        onSnackbar(`Error : ${error}`, 'error')
      }
    }
  } else {
    onSnackbar('Invalid student ID', 'warning')
  }
}

/**
 * * reset password user
 */

const onSubmit = async () => {
  const id = userModel?.value.id
  try {
    await $api.post(`/users/${id}/reset-password`, {})
    onSnackbar('Reset Password Successfuly', 'success')
    resetpasswordDialog.value = false
  } catch (error) {
    const err = error as ErrorResponse
    if (
      err.response._data.message === 'Cannot reset password of unknown user'
    ) {
      onSnackbar('Cannot reset password of unknown user', 'error')
    } else {
      onSnackbar(`Error : ${err.response}`, 'error')
    }
    console.error('Error update data:', err.response)
  }
}

const openDialog = (item: UserModel) => {
  userModel.value.id = item.id
  Object.assign(userModel.value, item)
  resetpasswordDialog.value = true
}
</script>

<template>
  <v-container fluid>
    <v-row class="d-flex align-center justify-center">
      <v-col cols="12" md="6" class="d-flex">
        <h2>Reset Password</h2>
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
        <v-btn class="rounded-lg" color="black" @click="searchDataUser"
          >Search</v-btn
        >
      </v-col>
    </v-row>
    <v-card class="rounded-lg pa-2" elevation="0" border>
      <!-- Table -->
      <v-data-table :headers="headers" :items="items" hide-default-footer>
        <template #[`item.actions`]="{ item }">
          <v-btn
            prepend-icon="mdi-lock-reset"
            color="black"
            variant="flat"
            rounded="lg"
            @click="openDialog(item)"
          >
            Reset
          </v-btn>
        </template>
        <template #no-data>
          <v-chip variant="outlined" rounded="lg" color="error">
            No search username
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="resetpasswordDialog" persistent max-width="600px">
      <v-card class="rounded-xl pa-4">
        <div class="d-flex flex-row align-center">
          <h2 class="pa-0">Reset Password</h2>
        </div>
        <v-divider />
        <v-card-text class="mb-n4">
          <v-text-field
            v-model="userModel.username"
            density="compact"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            label="Student ID"
            rounded
            readonly
          />
          <v-text-field
            v-model="userModel.fullName"
            density="compact"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            label="Full Name"
            rounded
            readonly
          />
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            class="pa-2"
            color="error"
            rounded="lg"
            variant="text"
            @click="resetpasswordDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            class="pa-2"
            rounded="lg"
            variant="flat"
            color="black"
            @click="onSubmit()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
  </v-container>
</template>

<style scoped></style>
