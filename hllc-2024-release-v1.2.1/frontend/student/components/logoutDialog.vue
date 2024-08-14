<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { colors } = useSchool()
const { signOut } = useAuth()
const { mdAndUp } = useDisplay()
const logoutDialog = defineModel({ type: Boolean, default: false })

const logout = async () => {
  logoutDialog.value = false
  nextTick(() => {
    reloadNuxtApp()
  })
  await signOut({ external: true, redirect: false })
}
</script>
<template>
  <v-dialog v-model="logoutDialog" max-width="25rem" persistent
    >'
    <div style="position: relative">
      <div
        style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: end;
          z-index: 1;
        "
      >
        <v-img src="icons/logout.png" style="width: 8rem" />
      </div>
      <v-card
        rounded="xl"
        class="text-center"
        elevation="0"
        :style="{
          backgroundColor: colors['dialog-surface'],
          '-webkit-backdrop-filter': 'blur(15px)',
          'backdrop-filter': 'blur(15px)',
          position: 'relative',
          bottom: $vuetify.display.xs ? '4vh' : '3.5vh',
        }"
      >
        <div style="height: 2rem" />
        <v-card-text>
          <p class="font-weight-bold text-title">{{ $t('logout.detail') }}</p>
        </v-card-text>
        <v-card-actions class="mb-3">
          <v-spacer />
          <v-btn
            variant="text"
            rounded="xl"
            :width="mdAndUp ? '10rem' : '8rem'"
            class="px-4"
            @click="logoutDialog = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            prepend-icon="mdi-logout"
            rounded="xl"
            :width="mdAndUp ? '10rem' : '8rem'"
            class="ml-2 px-4"
            @click="logout()"
          >
            {{ $t('Confirm') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>
<style scope>
.blur {
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  background-color: #ffffff8c;
}
</style>
