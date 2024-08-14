<script setup lang="ts">
import { type VNavigationDrawer } from 'vuetify/components'

type BaseProps = InstanceType<typeof VNavigationDrawer>['$props']
interface Props extends /* @vue-ignore */ BaseProps {
  color?: string
  activeMenu?: string
  contentClass?: string
  activeClass?: string
  iconColor?: string
  iconActiveColor?: string
  menus?: MenuItem[]
  logout: string
}

const props = withDefaults(defineProps<Props>(), {
  color: undefined,
  contentClass: 'text-white',
  activeClass: 'text-white',
  activeMenu: undefined,
  iconColor: undefined,
  iconActiveColor: undefined,
  menus: undefined,
  logout: undefined,
})

function isActive(menu: MenuItem) {
  return menu.title === props.activeMenu
}
const openDialogLogout = ref(false)
const emit = defineEmits(['change'])
</script>

<template>
  <v-navigation-drawer color="transparent" floating>
    <div class="sidebar-navigation">
      <v-sheet :color="color" class="prepend" />
      <sidebar-item
        v-for="(menu, i) in menus"
        :key="`sidebar-${i}`"
        :active="isActive(menu)"
        :content-class="contentClass"
        :active-class="activeClass"
        :color="color"
        :title="menu.title"
        :to="menu.to"
        :badge="menu.badge"
        :icon="menu.icon"
        :icon-color="iconColor"
        :icon-active-color="iconActiveColor"
        @click:active="emit('change', menu)"
      >
        <template #icon="{ active, props: icon }">
          <slot name="item.icon" v-bind="{ item: menu, active, props: icon }" />
        </template>
      </sidebar-item>
      <v-sheet :color="color" />
      <v-sheet
        :color="color"
        class="append d-flex justify-center align-end px-5"
      >
        <v-btn
          elevation="0"
          prepend-icon="mdi-logout"
          rounded
          :color="logout"
          class="mb-5"
          block
          @click="openDialogLogout = true"
        >
          {{ $t('logout.title') }}
        </v-btn>
      </v-sheet>
    </div>
  </v-navigation-drawer>

  <logout-dialog v-model="openDialogLogout" />
</template>

<style scoped>
.sidebar-navigation {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-items: start;
}

.sidebar-navigation > .prepend {
  height: 220px;
  width: 100%;
}

.sidebar-navigation > .append {
  align-self: stretch;
  height: 100%;
  width: 100%;
}

.sidebar-navigation > div:has(+ div.active) {
  border-radius: 0 0 16px 0;
}

.sidebar-navigation > div.active + div {
  border-radius: 0 16px 0 0;
}
</style>
