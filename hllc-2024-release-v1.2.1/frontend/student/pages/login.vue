<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { FetchError } from 'ofetch'
import type { VForm, VTextField } from 'vuetify/components'
import type LoginResponseDialog from '~/components/LoginResponseDialog.vue'
import type { ResponseType } from '~/components/LoginResponseDialog.vue'

const credentails = reactive({ username: '', password: '' })
const isShowPassword = ref(false)
const resetPasswordDialog = ref(false)

const reverse = true

const { smAndDown: isMobile } = useDisplay()

const textFieldDesign: VTextField['$props'] = {
  density: 'compact',
  rounded: true,
  variant: 'solo',
  counter: true,
  persistentCounter: true,
}

definePageMeta({
  layout: 'login',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const { signIn, refreshToken, status, refresh } = useAuth()

await useAsyncData(async () => {
  try {
    if (status.value === 'unauthenticated' && refreshToken.value) {
      await refresh()
    }
  } catch (error) {
    console.error('Error while refreshing', error)
  }
})

const router = useRouter()

interface ResponseHandler {
  dialog: boolean
  type: ResponseType
  onClose?: () => void
}

const response = reactive<ResponseHandler>({
  dialog: false,
  type: 'error',
})

const form = ref<VForm | null>(null)
const rules = {
  username(v: string) {
    if (!v) {
      return 'Username is required'
    }
    return true
  },
  password(v: string) {
    if (!v) {
      return 'Password is required'
    }
    return true
  },
}

function openReponseDialog(type: ResponseType, onClose?: () => void) {
  response.type = type
  response.onClose = onClose
  response.dialog = true
}

async function login() {
  try {
    const validate = await form.value?.validate()
    if (!validate?.valid) return
    await signIn(credentails, { external: true, redirect: false })
    openReponseDialog('success', () => {
      router.replace('/')
    })
  } catch (error) {
    if (error instanceof FetchError && error.statusCode === 401) {
      openReponseDialog('register')
    } else {
      openReponseDialog('error')
    }
  }
}

async function openResetPassword() {
  resetPasswordDialog.value = true
}

const routerToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <clientOnly>
    <div
      :style="{ height: '100%', width: isMobile ? '100dvw' : 'auto' }"
      class="d-flex align-start justify-start overflow-x-auto container"
      :class="[reverse ? 'flex-row-reverse' : 'flex-row']"
    >
      <!-- Banner -->
      <div v-if="!isMobile" class="grid" />
      <div
        class="grid d-flex flex-column align-center justify-center"
        :style="{
          backgroundColor: isMobile ? 'transparent' : 'rgba(69, 69, 69, 0.3)',
        }"
      >
        <v-responsive width="100%" class="d-flex align-center">
          <v-card
            class="mx-auto py-5 my-5 my-md-0 py-md-"
            max-width="30rem"
            rounded="xl"
            flat
            :color="isMobile ? 'rgba(69, 69, 69, 0.3)' : 'transparent'"
          >
            <v-img
              :height="isMobile ? '120' : '150'"
              :src="credentails.username.length ? 'close.png' : 'open.png'"
              contain
            />
            <v-form ref="form" class="px-6 pa-md-8" @submit="login">
              <v-card-title class="text-center">
                <h1 class="mb-3 mt-md-n5 text-white">LOGIN</h1>
                <p class="mb-5 mt-md-n5 text-white">Let's start your journey</p>
              </v-card-title>
              <v-card-text>
                <span class="text-white"> Student ID </span>
                <v-text-field
                  v-bind="textFieldDesign"
                  v-model="credentails.username"
                  class="login username"
                  autocomplete="current-user"
                  placeholder="Student ID"
                  prepend-inner-icon="mdi-account"
                  :rules="[rules.username]"
                />
                <span class="text-white"> Password </span>
                <v-text-field
                  v-model="credentails.password"
                  v-bind="textFieldDesign"
                  autocomplete="current-password"
                  placeholder="Password"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="
                    isShowPassword ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  :type="isShowPassword ? 'text' : 'password'"
                  :rules="[rules.password]"
                  @click:append-inner="isShowPassword = !isShowPassword"
                />
                <div class="text-right white--text mt-n1">
                  <a class="forgot-password" @click="openResetPassword()">
                    Forgot Password?
                  </a>
                </div>
                <v-row class="mt-5">
                  <v-col cols="6">
                    <v-btn
                      rounded
                      outlined
                      :size="isMobile ? 'large' : 'large'"
                      variant="outlined"
                      class="text-center"
                      color="white"
                      block
                      @click="routerToRegister"
                    >
                      Register
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      :size="isMobile ? 'large' : 'large'"
                      variant="elevated"
                      light
                      rounded
                      block
                      @click="login"
                    >
                      Login
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider
                :thickness="1"
                class="border-opacity-100 my-5 mx-8"
                color="white"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  variant="text"
                  color="transparent"
                  href="https://www.facebook.com/mfuactivities"
                  target="_blank"
                >
                  <v-icon class="mr-2" color="white"> mdi-facebook </v-icon>
                  <span class="text-white"> Contact us </span>
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-form>
          </v-card>
        </v-responsive>
        <!-- Forget password dialog -->
        <forget-password-dialog v-model="resetPasswordDialog" />
        <!-- Response dialog -->
        <login-response-dialog
          v-model="response.dialog"
          :type="response.type"
          @close="response.onClose"
        />
      </div>
    </div>
  </clientOnly>
</template>

<style scoped>
.container {
  background-image: url('~/assets/images/background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.forgot-password {
  color: rgb(255, 255, 255);
  font-size: 12px;
  font-weight: 400;
  cursor: pointer !important;
}

.grid {
  flex: 1;
  height: inherit;
}
</style>

<style>
.login.username input {
  border-radius: 0 24px 24px 0;
}
</style>
