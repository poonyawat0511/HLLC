<script setup lang="ts">
import type { ResponseType } from './ForgetPasswordResponseDialog.vue'
import type { VForm, VTextField } from 'vuetify/components'
import provinces from '~/../province.json'

const dialog = defineModel<boolean>({ default: false })
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const form = ref<VForm | null>(null)
const { $api } = useNuxtApp()

interface ResetPasswordModel {
  username?: string
  password?: string
  confirmPassword?: string
  name?: string
  secret?: string | null
}

const resetData = reactive<ResetPasswordModel>({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  secret: null,
})

const textFieldProps: InstanceType<typeof VTextField>['$props'] = {
  density: 'compact',
  variant: 'outlined',
  baseColor: 'grey-lighten-3',
  color: 'grey-lighten-3',
  bgColor: 'grey-lighten-3',
  rounded: true,
}

interface ReponseDialog {
  dialog: boolean
  type: ResponseType
  onClose?: () => void
}

const response = reactive<ReponseDialog>({
  dialog: false,
  type: 'error',
})

function openResponseDialog(type: ResponseType, onClose?: () => void) {
  response.type = type
  response.dialog = true
  response.onClose = onClose
}

interface SearchUserData {
  fullName: string
  username: string
}

const handleSearchError = (error: unknown) => {
  const message = getErrorMessage(error)
  if (message === 'User is not registered') {
    resetForm()
    openResponseDialog('register')
  } else if (message === 'User not found') {
    resetForm()
    openResponseDialog('notfound')
  } else {
    return openResponseDialog('error')
  }
}

const handleRegisterError = (error: unknown) => {
  const message = getErrorMessage(error)
  if (message === 'Invalid user secret') {
    openResponseDialog('secret')
  } else if (message === 'Cannot reset password of unknown user') {
    openResponseDialog('notfound')
  } else {
    return openResponseDialog('error')
  }
}

// search name user by student id
const onSearchName = async () => {
  if (resetData.username?.trim().length === 10) {
    const username = resetData?.username
    try {
      const response = await $api.get<{ data: SearchUserData }>(
        `/users/search/${username}`
      )
      resetData.username = response.data.username
      resetData.name = response.data.fullName
    } catch (error) {
      handleSearchError(error)
    }
  } else {
    openResponseDialog('incorrect')
  }
}

const secrets = provinces.map((value) => value.name_en).sort()

const onSubmit = async () => {
  try {
    const { valid } = await form.value!.validate()
    if (!valid) return
    await $api.post(`/auth/reset-password`, {
      body: {
        username: resetData.username,
        password: resetData.password,
        confirmPassword: resetData.confirmPassword,
        secret: resetData.secret,
      },
    })
    openResponseDialog('success', () => {
      closeDialog()
      form.value!.reset()
    })
  } catch (error) {
    handleRegisterError(error)
  }
}

const resetForm = () => {
  resetData.username = ''
  resetData.password = ''
  resetData.confirmPassword = ''
  resetData.secret = ''
  resetData.name = ''
}

function closeDialog() {
  resetForm()
  dialog.value = false
}

const isFormValid = computed(() => {
  return (
    !!resetData.username?.trim() &&
    !!resetData.name?.trim() &&
    !!resetData.secret &&
    !!resetData.password &&
    !!resetData.confirmPassword &&
    resetData.password.length >= 8 &&
    resetData.confirmPassword.length >= 8 &&
    resetData.password === resetData.confirmPassword
  )
})
</script>
<template>
  <v-dialog v-model="dialog" persistent max-width="30rem" max-height="auto">
    <v-card class="rounded-xl pa-2 py-4">
      <v-card-title class="text-center font-weight-medium">
        Reset password
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit="onSubmit()">
          <!-- Student ID input -->
          <div class="text-subtitle-2 text-medium-emphasis">Student ID</div>
          <v-text-field
            v-model="resetData.username"
            v-bind="textFieldProps"
            prepend-inner-icon="mdi-account"
            placeholder="Student ID"
            :rules="[$rules.username]"
            counter
            persistent-counter
            @change="onSearchName()"
          />
          <!-- Name input -->
          <div class="text-subtitle-2 text-medium-emphasis">Name</div>
          <v-text-field
            v-model="resetData.name"
            v-bind="textFieldProps"
            prepend-inner-icon="mdi-account"
            placeholder="Name"
            readonly
          />
          <!-- New password input -->
          <div
            v-if="resetData.name"
            class="text-subtitle-2 text-medium-emphasis"
          >
            New password
          </div>
          <v-text-field
            v-if="resetData.name"
            v-model="resetData.password"
            v-bind="textFieldProps"
            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passwordVisible ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            placeholder="New password"
            minlength="8"
            :rules="[$rules.password]"
            counter
            persistent-counter
            @click:append-inner="passwordVisible = !passwordVisible"
          />
          <!-- Confirm new password input -->
          <div
            v-if="resetData.name"
            class="text-subtitle-2 text-medium-emphasis"
          >
            Confirm new password
          </div>
          <v-text-field
            v-if="resetData.name"
            v-model="resetData.confirmPassword"
            v-bind="textFieldProps"
            :append-inner-icon="
              confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="confirmPasswordVisible ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            placeholder="Confirm new password"
            :rules="[$rules.password, $rules.confirm(resetData.password ?? '')]"
            counter
            persistent-counter
            @click:append-inner="
              confirmPasswordVisible = !confirmPasswordVisible
            "
          />
          <!-- Province input -->
          <div
            v-if="resetData.name"
            class="text-subtitle-2 text-medium-emphasis"
          >
            Province
          </div>
          <v-autocomplete
            v-if="resetData.name"
            v-model="resetData.secret"
            v-bind="textFieldProps"
            :items="secrets"
            prepend-inner-icon="mdi-map-marker"
            placeholder="province"
            sort
            :rules="[$rules.secret]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn class="pa-2" rounded="xl" variant="flat" @click="closeDialog()">
          cancel
        </v-btn>
        <v-btn
          :disabled="!isFormValid"
          class="pa-2"
          color="success"
          variant="flat"
          rounded="xl"
          @click="onSubmit()"
        >
          confirm
        </v-btn>
      </v-card-actions>
    </v-card>
    <ForgetPasswordResponseDialog
      v-model="response.dialog"
      :type="response.type"
      @close="response.onClose"
    />
  </v-dialog>
</template>

<style scoped></style>
