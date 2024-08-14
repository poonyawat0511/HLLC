<script setup lang="ts">
interface Props {
  color?: string
  contentClass?: string
  activeClass?: string
  iconColor?: string
  iconActiveColor?: string
  menus?: UserMenuItem[]
}

const props = withDefaults(defineProps<Props>(), {
  color: 'white',
  contentClass: 'text-black',
  activeClass: 'text-black',
  activeMenu: undefined,
  iconColor: undefined,
  iconActiveColor: undefined,
  menus: () => [],
})

const activeMenu = ref<string>(props.menus[0].title)

function isActive(menu: UserMenuItem) {
  return menu.title === activeMenu.value
}

function changeActiveMenu(menu: UserMenuItem) {
  activeMenu.value = menu.title
}
</script>

<template>
  <v-sheet color="transparent">
    <div class="sidebar-navigation">
      <v-sheet :color="color" class="prepend" />
      <slot>
        <user-sidebar-item
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
          @click:active="changeActiveMenu(menu)"
        />
      </slot>
      <v-sheet :color="color" class="append" />
    </div>
  </v-sheet>
</template>

<style scoped>
.sidebar-navigation {
  width: 100%;
  height: inherit;
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
