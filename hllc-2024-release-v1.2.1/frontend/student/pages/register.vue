<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { VTextField } from 'vuetify/components'
import type { ResponseType } from '~/components/RegisterResponseDialog.vue'
import { FetchError } from 'ofetch'

//Import thailand provinces
import provinces from '~/../province.json'

//Breakpoint from vuetify
const { smAndDown: isMobile } = useDisplay()

//Set router
const router = useRouter()

//Import $api
const { $api } = useNuxtApp()

//Set guest only
definePageMeta({
  layout: 'login',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/login',
  },
})

//Sorting provinces ascending
const secrets = provinces.map((item) => item.name_en).sort()

//Text field style
const textField: VTextField['$props'] = {
  density: 'compact',
  rounded: true,
  variant: 'solo-filled',
  bgColor: 'rgba(255, 255, 255, 1)',
}

const userForms = reactive({
  username: '',
  fullName: '',
  password: '',
  confirmPassword: '',
  province: null,
})

const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

interface ResponseHandler {
  dialog: boolean
  type: ResponseType
  onClose?: () => void
}

const response = reactive<ResponseHandler>({
  dialog: false,
  type: 'error',
})

function openReponseDialog(type: ResponseType, onClose?: () => void) {
  response.type = type
  response.onClose = onClose
  response.dialog = true
}

//Check user response interface
interface ICheckUser {
  user: {
    name: {
      first: string
      last: string
    }
    fullName: string
    type: string
    round: string
  }
  isRegistered: boolean
}

//Register rsponse interface
interface RegisterResponse {
  statusCode: number
  message: string
  data: boolean
}

function handleRegisterError(error: unknown) {
  if (error instanceof FetchError) {
    if (error.statusCode === 404) {
      return openReponseDialog('notfound')
    }
    if (error.statusCode === 409) {
      return openReponseDialog('registered')
    }
  }
  return openReponseDialog('error')
}

function handleSearchError(error: unknown) {
  const message = getErrorMessage(error)
  if (message === 'User not found') {
    openReponseDialog('notfound', () => {
      clearFields()
    })
  } else {
    openReponseDialog('error', () => {
      clearFields()
    })
  }
}

//Register API
const submitRegister = async () => {
  try {
    await $api.post<RegisterResponse>('/auth/register', {
      body: {
        username: userForms.username,
        password: userForms.password,
        confirmPassword: userForms.confirmPassword,
        secret: userForms.province,
      },
    })
    openReponseDialog('success', () => {
      routerToLogin()
      resetForm()
    })
  } catch (error) {
    handleRegisterError(error)
  }
}

//Fetch FULLNAME using username
const checkStatus = async () => {
  if (userForms.username?.trim().length === 10) {
    try {
      const response = await $api.get<{ data: ICheckUser }>(
        `/auth/register/check/${userForms.username}`
      )
      userForms.fullName = response.data.user.fullName
      if (response.data.isRegistered) {
        openReponseDialog('registered', () => {
          clearFields()
        })
      }
    } catch (error) {
      handleSearchError(error)
    }
  } else {
    openReponseDialog('incorrect', () => {
      clearFields()
    })
  }
}

//Clear all field and router to LOGIN page
const clearFields = () => {
  userForms.username = ''
  userForms.fullName = ''
  userForms.password = ''
  userForms.confirmPassword = ''
  userForms.province = null
}

const resetForm = () => {
  userForms.username = ''
  userForms.fullName = ''
  userForms.password = ''
  userForms.confirmPassword = ''
  userForms.province = null
}

//Router to LOGIN
const routerToLogin = () => {
  router.push('/login')
}

//Check form completion
const formComplete = computed(() => {
  return (
    !!userForms.username?.trim() &&
    !!userForms.fullName?.trim() &&
    !!userForms.password?.trim() &&
    !!userForms.confirmPassword.trim() &&
    !!userForms.province &&
    userForms.password.length >= 8 &&
    userForms.confirmPassword.length >= 8 &&
    userForms.password === userForms.confirmPassword
  )
})
</script>

<template>
  <ClientOnly>
    <div
      :style="{ height: '100%', width: isMobile ? '100dvw' : 'auto' }"
      class="d-flex align-start justify-start overflow-x-auto flex-row background"
    >
      <div
        class="grid d-flex flex-column align-center justify-center"
        :style="{
          backgroundColor: isMobile ? 'transparent' : 'rgba(69, 69, 69, 0.3)',
        }"
      >
        <v-responsive width="100%" class="d-flex align-center">
          <div v-if="isMobile" class="d-flex justify-center">
            <HllcLogo />
          </div>
          <v-card
            class="mx-auto py-5 mt-5 my-md-0 py-md-0 rounded-t-xl"
            max-width="30rem"
            flat
            :color="isMobile ? 'rgba(69, 69, 69, 0.3)' : 'transparent'"
          >
            <div v-if="!isMobile" class="d-flex justify-center">
              <HllcLogo />
            </div>

            <v-form ref="form" class="px-5 pa-md-5">
              <v-card-title>
                <h1 class="mt-md-n5 text-white text-center">Register</h1>
              </v-card-title>
              <v-card-text>
                <span class="text-white"> Student ID </span>
                <v-text-field
                  v-model="userForms.username"
                  v-bind="textField"
                  placeholder="Student ID"
                  prepend-inner-icon="mdi-account"
                  :rules="[$rules.username]"
                  counter
                  persistent-counter
                  @change="checkStatus"
                />

                <span class="text-white"> Name </span>
                <v-text-field
                  v-model="userForms.fullName"
                  v-bind="textField"
                  placeholder="Name"
                  prepend-inner-icon="mdi-account"
                  :readonly="true"
                  style="pointer-events: none"
                />

                <span class="text-white"> Password </span>
                <v-text-field
                  v-model="userForms.password"
                  prepend-inner-icon="mdi-lock"
                  placeholder="Password"
                  v-bind="textField"
                  :append-inner-icon="
                    passwordVisible ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  :type="passwordVisible ? 'text' : 'password'"
                  :rules="[$rules.password]"
                  counter
                  persistent-counter
                  :disabled="!userForms.fullName"
                  @click:append-inner="passwordVisible = !passwordVisible"
                />

                <span class="text-white"> Confirm Password </span>
                <v-text-field
                  v-model="userForms.confirmPassword"
                  prepend-inner-icon="mdi-lock"
                  placeholder="Confirm password"
                  v-bind="textField"
                  :append-inner-icon="
                    confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  :type="confirmPasswordVisible ? 'text' : 'password'"
                  :rules="[
                    $rules.password,
                    $rules.confirm(userForms.password ?? ''),
                  ]"
                  counter
                  persistent-counter
                  :disabled="!userForms.fullName"
                  @click:append-inner="
                    confirmPasswordVisible = !confirmPasswordVisible
                  "
                />

                <span class="text-white"> Province </span>
                <v-autocomplete
                  v-model="userForms.province"
                  prepend-inner-icon="mdi-map"
                  placeholder="Province"
                  v-bind="textField"
                  :items="secrets"
                  :rules="[$rules.secret]"
                  :disabled="!userForms.fullName"
                />

                <div class="text-center">
                  <v-btn
                    :disabled="!formComplete"
                    size="large"
                    rounded
                    class="mt-4 mb-9"
                    @click="submitRegister"
                  >
                    Register
                  </v-btn>
                </div>
                <hr class="solid w-100" />
                <v-card-text class="text-white text-center">
                  Already registerd click
                  <a
                    class="text-blue-lighten-2 text-decoration-underline"
                    style="cursor: pointer"
                    @click="routerToLogin"
                  >
                    Login
                  </a>
                </v-card-text>
              </v-card-text>
            </v-form>
          </v-card>
        </v-responsive>
      </div>
      <div v-if="!isMobile" class="grid" />

      <register-response-dialog
        v-model="response.dialog"
        :type="response.type"
        @close="response.onClose"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>
.background {
  background-image: url('~/assets/images/background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.grid {
  flex: 1;
  height: inherit;
}
</style>
