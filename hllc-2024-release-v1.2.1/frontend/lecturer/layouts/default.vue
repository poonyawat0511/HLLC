<script setup lang="ts">
const snackbar: Snackbar = {
  items: ref<SnackbarItem[]>([]),
  open(items: SnackbarItem[]) {
    this.items.value = items
  },
}

provide<Snackbar>('snackbar', snackbar)

const logout = reactive({
  dialog: false,
  open() {
    this.dialog = true
  },
})
</script>

<template>
  <v-app>
    <v-app-bar elevation="0">
      <v-app-bar-title
        ><v-img src="/hllc/hllcB.png" max-width="5rem"
      /></v-app-bar-title>
      <template #append>
        <profile-menu />
      </template>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
    <!-- Snackbar -->
    <multi-snackbars v-model="snackbar.items.value" />
    <!-- Logout dialog -->
    <logout-dialog v-model="logout.dialog" />
  </v-app>
</template>
