<script setup lang="ts">
import { io } from 'socket.io-client'

// Injections
const { menus } = useNavigation()
const { init, colors, assets } = useSchool()
const { updateTheme } = useColors()
const { data: user, token } = useAuth()
const { progress } = useProgress()
const route = useRoute()
const router = useRouter()
const { fetchActivities, updateCheckIn, activities } = useActivity()
const { fetch: fetchNotifications, unreads, push } = useNotification()
const { fetchLamduan, fetchActivitiesLamduan, lamduanActivities } = useLamduan()
const { items, init: initEvolution } = useEvolution()
const runtimeConfig = useRuntimeConfig()
const socketURL = runtimeConfig.public.socketURL

// References
const { mobile } = useDisplay()
const { t } = useI18n()
const theme = ref('light')
const activeMenu = computed(() => route.meta.menu?.active)
const isShowNavigation = computed(() => route.meta.menu?.display)
const force = computed(() => route.meta.force)
const pcOnlyNavigation = computed(() => route.meta.menu?.pcOnly)
const computeMenus = computed<NavigationList>(() => {
  return menus.map((menu) => {
    if (menu.title === 'Notifications') {
      if (unreads.value.length > 0) {
        return { ...menu, badge: true }
      }
    }
    if (menu.title === 'Activities') {
      if (
        activities.value.some(
          (activity) => activity.status?.message === 'waiting'
        )
      ) {
        return { ...menu, badge: true }
      }
    }
    return menu
  }) as NavigationList
})

const background = computed(() => {
  if (import.meta.server) return ''
  const image = assets['background'] || '~/assets/images/bg.jpg'
  return `url(${image})`
})

const icons: Record<Title, Component> = {
  Home: defineAsyncComponent(
    async () => await import('~/components/svg/Home.vue')
  ),
  Activities: defineAsyncComponent(
    async () => await import('~/components/svg/Activity.vue')
  ),
  'QR Code': defineAsyncComponent(
    async () => await import('~/components/svg/QrCode.vue')
  ),
  'E-voucher': defineAsyncComponent(
    async () => await import('~/components/svg/Voucher.vue')
  ),
  Notifications: defineAsyncComponent(
    async () => await import('~/components/svg/Bell.vue')
  ),
}

const snackbar: Snackbar = {
  model: ref<boolean>(false),
  message: ref<string>(''),
  color: ref<string>(),
  action: ref<string>(),
  onClickAction: ref<() => void>(),

  open(
    message: string,
    color?: string,
    action?: { label: string; event: () => void }
  ) {
    this.model.value = false
    this.message.value = message
    this.color.value = color

    if (action) {
      this.action.value = action.label
      this.onClickAction.value = () => {
        action.event()
        this.model.value = false
      }
    } else {
      this.action.value = 'close'
      this.onClickAction.value = () => {
        this.model.value = false
      }
    }

    this.model.value = true
  },
}

provide<Snackbar>('snackbar', snackbar)

nextTick(() => {
  init({
    photos: user.value.major?.school?.photos ?? {},
    colors: user.value.theme?.colors ?? {},
    assets: user.value.theme?.assets ?? {},
  })
  updateTheme(theme.value, colors)
})

onMounted(async () => {
  const socket = io(socketURL, {
    transports: ['websocket'],
    auth: { token: token.value },
  })

  fetchLamduan()

  provide('socket', socket)

  socket.on('notification', async (notification) => {
    push(notification)
    if (notification?.title?.th === 'ดอกลำดวนของคุณถูกลบ!') {
      if (!lamduanActivities.value) {
        await fetchActivitiesLamduan()
      }
      if (!lamduanActivities.value) return
      const item = items.value.find(
        (item) => item.activity === lamduanActivities.value!.id
      )
      if (item) {
        item.evolution = null
      }
      const activityIndex = activities.value.findIndex(
        (activity) => activity.id === lamduanActivities.value!.id
      )
      if (activityIndex !== -1) {
        activities.value.splice(activityIndex, 1, lamduanActivities.value!)
      }
      fetchLamduan(true)
    }
    snackbar.open(t('New Notification'), 'primary', {
      label: t('see'),
      event: () => {
        router.push('/notifications')
      },
    })
  })

  socket.on('checkIn', (checkIn) => {
    updateCheckIn(checkIn)
  })

  await fetchNotifications()
  await initEvolution()
  await fetchActivities()
})
</script>

<template>
  <v-app :class="{ app: $route.meta.background }">
    <ClientOnly>
      <sidebar-navigation
        v-if="!mobile && isShowNavigation && !force"
        :model-value="true"
        :color="colors['sidebar-bg']"
        :icon-color="colors['sidebar-icon']"
        :icon-active-color="colors['sidebar-icon-active']"
        :menus="computeMenus"
        :mobile-breakpoint="0"
        :active-menu="activeMenu"
        content-class="text-sidebar-text"
        active-class="text-sidebar-text-active"
        absolute
        :logout="colors['error']"
      >
        <template #[`item.icon`]="{ item, props }">
          <component :is="icons[item.title]" v-bind="props" />
        </template>
      </sidebar-navigation>
    </ClientOnly>
    <v-app-bar :height="80" flat floating fixed color="transparent">
      <v-app-bar-title>
        <ClientOnly>
          <progress-box
            :model-value="progress"
            :bg-avatar="colors['primary']"
            :gradient-colors="[
              colors['progress-gradient-1'],
              colors['progress-gradient-2'],
              colors['progress-gradient-3'],
              colors['progress-gradient-4'],
              colors['progress-gradient-5'],
            ]"
            @click:logo="$router.push('/')"
          />
        </ClientOnly>
      </v-app-bar-title>
      <template #append>
        <ClientOnly>
          <lang-switcher class="mr-3" />
          <profile-menu :nav="!force" />
        </ClientOnly>
      </template>
    </v-app-bar>
    <v-main>
      <slot />
      <ClientOnly>
        <v-responsive
          v-if="$vuetify.display.mobile && !pcOnlyNavigation"
          height="76px"
        />
      </ClientOnly>
    </v-main>
    <ClientOnly>
      <div
        v-if="
          $vuetify.display.mobile &&
          isShowNavigation &&
          !pcOnlyNavigation &&
          !force
        "
      >
        <bottom-navigation
          :color="colors['bottom-bg']"
          :menus="computeMenus"
          :active-menu="activeMenu"
          :icon-color="colors['bottom-icon']"
          :icon-ative-color="colors['bottom-icon-active']"
          :center-bg="colors['bottom-center']"
          :center-icon="colors['bottom-center-icon']"
          content-class="text-bottom-text"
          active-class="text-bottom-text-active"
        >
          <template #[`item.icon`]="{ item, props, active }">
            <component
              :is="icons[item.title]"
              v-bind="props"
              :color="colors[active ? 'bottom-icon-active' : 'bottom-icon']"
            />
          </template>
          <template #[`item.center`]="{ item, props }">
            <component :is="icons[item.title]" v-bind="props" color="white" />
          </template>
        </bottom-navigation>
      </div>
    </ClientOnly>

    <!-- Snackbar -->
    <base-snackbar
      v-model="snackbar.model.value"
      :message="snackbar.message.value"
      :action="snackbar.action.value"
      :color="snackbar.color.value"
      @click:action="snackbar.onClickAction.value"
    />
  </v-app>
</template>

<style scoped>
.app {
  background-image: v-bind(background);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

<style>
body {
  background: black;
}

::-webkit-scrollbar {
  display: none;
}
</style>
