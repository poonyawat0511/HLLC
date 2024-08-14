<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

interface Props {
  active?: boolean
  color?: string
  height?: string | number
  gap?: string | number
  title?: string
  contentClass?: string
  activeClass?: string
  iconColor?: string
  iconActiveColor?: string
  icon?: string
  to?: RouteLocationRaw
  badge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'white',
  height: 50,
  active: false,
  title: 'Navigation',
  contentClass: 'text-black',
  activeClass: 'text-black',
  iconColor: undefined,
  iconActiveColor: undefined,
  icon: 'mdi-home',
  gap: 16,
  to: '#',
  badge: false,
})

const gapHeight = computed(() => {
  const { number, unit } = computeSize(props.gap)
  return `${number}${unit}`
})

const itemHeight = computed(() => {
  const { number, unit } = computeSize(props.height)
  return `${number}${unit}`
})

const size = computed(() => {
  const { number, unit } = computeSize(props.height)
  return `${number / 1.97}${unit}`
})

const router = useRouter()
const emit = defineEmits(['click:active'])

function routerNavigation() {
  emit('click:active', props.active)
  router.push(props.to)
}
</script>

<template>
  <v-sheet color="transparent" class="sidebar-item__container">
    <v-sheet :color="color" class="before" />
    <v-sheet
      :class="{ active }"
      :height="itemHeight"
      :color="active ? 'transparent' : color"
      class="sidebar-item"
      width="100%"
      @click="routerNavigation()"
    >
      <v-sheet
        :color="active ? color : 'transparent'"
        class="sidebar-item__activator"
      />
      <div height="inherit" class="sidebar-item__content">
        <div class="prepend">
          <v-badge :model-value="!!badge" top color="red" dot>
            <slot
              name="icon"
              :props="{
                class: 'mr-2',
                size: 25,
                color: active ? iconActiveColor : iconColor,
              }"
              :active="active"
            >
              <v-icon
                tile
                size="30"
                class="mr-2"
                :color="active ? iconActiveColor : iconColor"
                :icon="icon"
              />
            </slot>
          </v-badge>
        </div>
        <div :class="['title', active ? activeClass : contentClass]">
          <slot>
            <span class="text-wrap">
              {{ $t(`menus.${title}`) }}
            </span>
          </slot>
        </div>
      </div>
    </v-sheet>
    <v-sheet :color="color" class="after" />
  </v-sheet>
</template>

<style scoped>
.sidebar-item {
  display: flex;
  flex-direction: row;
  justify-items: start;
  align-items: center;
}

.sidebar-item > .sidebar-item__activator {
  width: 60px;
}

.sidebar-item > .sidebar-item__content {
  margin-top: 10px;
  margin-bottom: 10px;
}

.sidebar-item > div {
  height: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.sidebar-item.active > .sidebar-item__activator {
  --size: v-bind(size);
  --mask: radial-gradient(var(--size) at right, #0000 97%, #000) 50%/ 100% calc(var(
          --size
        ) * 2);
  -webkit-mask: var(--mask);
  mask: var(--mask);
}

.sidebar-item__content > .prepend {
  padding: 4px 4px;
  margin-right: 4px;
}

.sidebar-item__content > .title {
  padding: 4px 4px;
}

.sidebar-item__container > :is(.before, .after) {
  height: v-bind(gapHeight);
  width: 100%;
}

.sidebar-item__container > .before:has(+ .sidebar-item.active) {
  border-radius: 0 0 16px 0;
}

.sidebar-item__container > .sidebar-item.active + .after {
  border-radius: 0 16px 0 0;
}

.sidebar-item__container + .sidebar-item__container > .before {
  display: none !important;
}

.sidebar-item__container:has(+ .sidebar-item__container > .sidebar-item.active)
  > .after {
  border-radius: 0 0 16px 0;
}

.sidebar-item:hover {
  cursor: pointer;
  font-weight: 800;
}

.text-wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: normal;
  line-clamp: 1;
}
</style>
