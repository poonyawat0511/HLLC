<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })
const loading = ref(false)

const { signOut } = useAuth()

async function logout() {
  loading.value = true
  await signOut({ external: true, redirect: false })
  nextTick(() => {
    reloadNuxtApp()
  })
  loading.value = false
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    persistent
    content-class="rounded-xl overflow-hidden"
    max-width="20rem"
    scrollable
  >
    <v-card rounded="lg">
      <v-card rounded="lg">
        <v-card-title>
          <div class="my-2">
            <v-icon color="warning" class="mr-2"> mdi-alert </v-icon>
            <span class="text--text">Logout</span>
          </div>
        </v-card-title>
        <v-card-text> Do you want to logout? </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row dense>
            <v-col cols="6">
              <v-btn rounded block :disabled="loading" @click="dialog = false">
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                rounded
                block
                color="primary"
                :loading="loading"
                @click.stop="logout"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</template>
