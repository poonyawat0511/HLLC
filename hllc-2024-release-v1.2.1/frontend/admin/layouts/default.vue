<script setup lang="ts">
const clipped = ref(true)
const miniVariant = ref(false)

const DRAWER_KEY = 'drawer'
const localDrawer = ref(true)
const drawer = computed<boolean>({
  get() {
    return localDrawer.value
  },
  set(value: boolean) {
    if (import.meta.client) {
      sessionStorage.setItem(DRAWER_KEY, `${value}`)
    }
    localDrawer.value = value
  },
})

onMounted(() => {
  localDrawer.value =
    sessionStorage.getItem(DRAWER_KEY) === 'false' ? false : true
})

const snackbar: Snackbar = {
  model: ref<boolean>(false),
  message: ref<string>(''),
  color: ref<string>(),
  open(message: string, color?: string) {
    this.model.value = false
    this.message.value = message
    this.color.value = color
    this.model.value = true
  },
}

provide<Snackbar>('snackbar', snackbar)

const appConfig = useAppConfig()
const sidebarItems = computed(() => appConfig.menus)

const route = useRoute()
const breadcrumbs = computed(() => route.meta.breadcrumbs ?? [])
</script>

<template>
  <div>
    <v-app>
      <v-app-bar flat>
        <template #prepend>
          <v-btn icon left @click="drawer = !drawer">
            <v-icon>mdi-apps</v-icon>
          </v-btn>
        </template>
        <v-app-bar-title>
          <v-img
            src="~/assets/images/logo.png"
            width="60"
            contain
            alt="hllc logo"
          />
        </v-app-bar-title>
        <template #append>
          <profile-menu />
        </template>
      </v-app-bar>
      <clientOnly>
        <v-navigation-drawer
          v-model="drawer"
          app
          color="white"
          :clipped="clipped"
          :mini-variant="miniVariant"
        >
          <v-list density="compact" rounded nav>
            <sidebar-item to="/" icon="mdi-home" title="Home" />
          </v-list>
          <sidebar-list :items="sidebarItems" />
        </v-navigation-drawer>
      </clientOnly>
      <v-main>
        <div v-if="breadcrumbs?.length" fluid class="px-4 pt-4">
          <v-card rounded="lg" class="border" variant="flat">
            <v-breadcrumbs :items="breadcrumbs" class="text-caption" />
          </v-card>
        </div>
        <slot />
      </v-main>
    </v-app>
    <!-- Snackbar -->
    <base-snackbar
      v-model="snackbar.model.value"
      :message="snackbar.message.value"
      :color="snackbar.color.value"
    />
  </div>
</template>
