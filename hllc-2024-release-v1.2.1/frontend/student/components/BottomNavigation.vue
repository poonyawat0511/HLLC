<script setup lang="ts">
import { useRouter } from '#imports'

interface Props {
  activeMenu?: string
  color?: string
  contentClass?: string
  activeClass?: string
  iconColor?: string
  iconActiveColor?: string
  centerBg?: string
  centerIcon?: string
  theme?: string
  height?: string
  menus: NavigationList
}

const props = withDefaults(defineProps<Props>(), {
  activeMenu: undefined,
  color: 'white',
  contentClass: 'text-grey',
  activeClass: 'text-primary',
  iconColor: 'grey',
  iconActiveColor: 'primary',
  centerBg: 'primary',
  centerIcon: 'white',
  theme: undefined,
  height: '64px',
})

const isActive = (menu: MenuItem) => menu.title === props.activeMenu

const router = useRouter()
const emit = defineEmits(['change'])

function routerNavigation(menu: MenuItem) {
  emit('change', menu)
  router.push(menu.to)
}

const height = computed(() => Object.values(computeSize(props.height)).join(''))
</script>

<template>
  <v-sheet :theme="theme" :color="color" class="bottom-nav text-white">
    <div
      v-for="(menu, i) in menus"
      :key="`bottom-${i}`"
      :class="{ active: isActive(menu) }"
      class="nav-box"
      @click="routerNavigation(menu)"
    >
      <div
        v-if="menu.title === 'QR Code'"
        class="d-flex justify-center flex-column align-center"
      >
        <v-sheet
          :color="centerBg"
          class="center"
          :class="{ active: isActive(menu) }"
        >
          <div class="icon">
            <slot
              name="item.center"
              :props="{
                size: 30,
                color: '#FFFFFF',
              }"
              :item="menu"
              :active="isActive(menu)"
            >
              <v-icon size="50" :icon="menu.icon" :color="centerIcon" />
            </slot>
          </div>
        </v-sheet>
      </div>
      <div v-else class="nav-item">
        <v-badge :model-value="!!menu.badge" bordered top color="red" dot>
          <slot
            name="item.icon"
            :props="{
              size: 30,
              color: isActive(menu) ? iconActiveColor : iconColor,
            }"
            :item="menu"
            :active="isActive(menu)"
          >
            <v-icon
              size="30"
              :icon="menu.icon"
              :color="isActive(menu) ? iconActiveColor : iconColor"
            />
          </slot>
        </v-badge>
        <span
          :class="[
            'text-caption',
            'mx-1',
            isActive(menu) ? activeClass : contentClass,
          ]"
        >
          {{ $t(`menus.${menu.title}`) }}
        </span>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  /* border: 2px solid #d9d9d9; */
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: v-bind(height);
}

.bottom-nav .center {
  width: 70px;
  height: 70px;
  margin-bottom: 25px;
  position: absolute;
  border-radius: 100%;
  overflow: hidden;
  border: 1px solid white;
}

.bottom-nav .center .icon {
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-nav .center:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: inherit;
}

.bottom-nav .center.active {
  transform: scale(1.05);
}

.bottom-nav .center:hover:not(.active) {
  transform: scale(1.03);
  cursor: pointer;
}

.bottom-nav .nav-box {
  flex: 1;
}

.bottom-nav .nav-box .nav-item {
  display: flex;
  flex-direction: column;
  justify-items: start;
  text-align: center;
  align-items: center;
  padding: 4px 0;
}

.bottom-nav .nav-box:hover .nav-item {
  transform: scale(1.1);
  cursor: pointer;
}

.bottom-nav .nav-box.active .nav-item {
  font-weight: bold;
  transform: scale(1);
}

.bottom-nav .nav-box.active .nav-item .icon {
  transform: scale(1.2);
}
</style>
