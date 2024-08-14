<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { VForm, VTextField } from 'vuetify/components'

const credentails = reactive({
  username: '',
  password: '',
  role: ['LECTURER'],
})
const isShowPassword = ref<boolean>(false)

const { xs, mdAndUp } = useDisplay()
const textFieldDesign = reactive<VTextField['$props']>({
  density: 'comfortable',
  variant: 'solo',
  hideDetails: 'auto',
})

watch(xs, (value) => {
  if (value) {
    textFieldDesign.density = 'compact'
  } else {
    textFieldDesign.density = 'comfortable'
  }
})

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

const response = reactive({
  dialog: false,
  message: '',
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

async function login() {
  try {
    const validate = await form.value?.validate()
    if (!validate?.valid) return
    await signIn(credentails, { external: true, redirect: false })
    nextTick(() => {
      reloadNuxtApp()
    })
  } catch (error) {
    response.message = getErrorMessage(error)
    response.dialog = true
  }
}
</script>

<template>
  <v-layout full-height height="100dvh" class="background">
    <v-container fluid class="d-flex justify-center align-center">
      <ClientOnly>
        <v-card
          class="mx-auto pa-3 pa-md-5"
          color="rgba(69, 69, 69, 0.3)"
          :width="mdAndUp ? '40rem' : '100%'"
          rounded="xl"
        >
          <v-form ref="form" class="pa-md-5" @submit="login">
            <v-card-title>
              <img
                class="header-logo"
                src="/logo-sdad.png"
                :style="{
                  height: xs ? '60px' : '80px',
                  width: 'auto',
                }"
                alt="logo"
              >
              <h2 class="text-center text-white">LECTURER LOGIN</h2>
            </v-card-title>
            <v-card-text>
              <div class="text-white">Username</div>
              <v-text-field
                v-model="credentails.username"
                v-bind="textFieldDesign"
                prepend-inner-icon="mdi-account"
                placeholder="Username"
                :rules="[rules.username]"
              />
              <div class="mt-5 text-white">Password</div>
              <v-text-field
                v-model="credentails.password"
                v-bind="textFieldDesign"
                placeholder="Password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="isShowPassword ? 'text' : 'password'"
                :rules="[rules.password]"
                @click:append-inner="isShowPassword = !isShowPassword"
                @keydown.enter="login"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :size="!xs ? 'x-large' : 'large'"
                rounded
                variant="elevated"
                class="mt-5"
                color="black"
                @click="login"
              >
                <v-responsive
                  :width="!xs ? '7rem' : '8rem'"
                  style="font-weight: 900"
                >
                  Login
                </v-responsive>
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-form>
        </v-card>
      </ClientOnly>
    </v-container>

    <!-- Response dialog -->
    <login-response-dialog
      v-model="response.dialog"
      :message="response.message"
    />
  </v-layout>
</template>

<style scoped>
.background {
  background-image: url('~/assets/images/background.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
