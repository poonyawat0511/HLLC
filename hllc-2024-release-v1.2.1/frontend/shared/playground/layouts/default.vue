<script setup lang="ts">
const theme = ref('school')
const menus = [
  {
    title: 'Home',
    to: '/',
    icon: 'mdi-home',
  },
  {
    title: 'Activites',
    to: '/',
    icon: 'mdi-calendar',
  },
  {
    title: 'QR Code',
    to: '/',
    icon: 'mdi-qrcode',
  },
  {
    title: 'E-vouchers',
    to: '/',
    icon: 'mdi-wallet-giftcard',
  },
  {
    title: 'Notifications',
    to: '/',
    icon: 'mdi-bell',
    badge: true,
  },
]

const { init, colors } = useSchool()
init({
  photos: { first: '', second: '', third: '', fourth: '' },
  colors: { primary: '#1867C0', 'sidebar-bg': 'rgba(70, 70, 70, 0.4)' },
})

const { provideTheme, updateTheme } = useColors()
provideTheme(theme.value)
updateTheme(theme.value, colors)

const activeMenu = ref('Home')
function onMenuChange(menu: MenuItem) {
  activeMenu.value = menu.title
}

const drawer = ref(true)
</script>

<template>
  <v-app class="app">
    <ClientOnly>
      <sidebar-navigation
        v-if="!$vuetify.display.mobile"
        v-model="drawer"
        mobile-breakpoint="xs"
        :color="colors['sidebar-bg']"
        :theme="theme"
        :menus="menus"
        :active-menu="activeMenu"
        disable-resize-watcher
        @change="onMenuChange" />
    </ClientOnly>
    <v-app-bar>
      <v-app-bar-title class="text-uppercase"> #f5b700 </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>

    <ClientOnly>
      <bottom-navigation
        v-if="$vuetify.display.mobile"
        :color="colors['sidebar-bg']"
        :theme="theme"
        :menus="menus"
        :active-menu="activeMenu"
        icon-color="grey-darken-3"
        content-class="text-grey-darken-3"
        active-class="text-primary"
        @change="onMenuChange" />
    </ClientOnly>
  </v-app>
</template>

<style scoped>
.v-application {
  background-color: #f5b700;
}
</style>
