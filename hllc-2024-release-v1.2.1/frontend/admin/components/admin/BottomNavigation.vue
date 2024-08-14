<script setup lang="ts">
interface Props {
  color?: string
  contentClass?: string
  activeClass?: string
  iconColor?: string
  iconActiveColor?: string
  centerBg?: string
  centerIcon?: string
  height?: string
  menus: UserMenuItem[]
}

const props = withDefaults(defineProps<Props>(), {
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

const activeMenu = ref(props.menus[0].title)

function changeActiveMenu(menu: UserMenuItem) {
  activeMenu.value = menu.title
}

const isActive = (menu: UserMenuItem) => menu.title === activeMenu.value

const centerIndex = computed(() => {
  if (props.menus.length % 2 === 0) return -1
  return Math.floor(props.menus.length / 2)
})

const height = computed(() => Object.values(computeSize(props.height)).join(''))
</script>

<template>
  <v-sheet :color="color" class="bottom-nav text-white">
    <div
      v-for="(menu, i) in menus"
      :key="`bottom-${i}`"
      :class="{ active: isActive(menu) }"
      class="nav-box"
      @click.stop="changeActiveMenu(menu)"
    >
      <div
        v-if="i === centerIndex"
        class="d-flex justify-center flex-column align-center"
      >
        <v-sheet
          :color="centerBg"
          class="center"
          :class="{ active: isActive(menu) }"
        >
          <div class="icon">
            <v-icon size="30" :icon="menu.icon" :color="centerIcon" />
          </div>
        </v-sheet>
      </div>
      <div v-else class="nav-item">
        <v-badge :model-value="!!menu.badge" bordered top color="red" dot>
          <v-icon
            size="30"
            :icon="menu.icon"
            :color="isActive(menu) ? iconActiveColor : iconColor"
          />
        </v-badge>
        <span
          :class="[
            'text-caption',
            'mx-1',
            isActive(menu) ? activeClass : contentClass,
          ]"
        >
          {{ menu.title }}
        </span>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: v-bind(height);
}

.bottom-nav .center {
  width: 45px;
  height: 45px;
  position: relative;
  transform: rotate(45deg);
  border-radius: 20%;
  overflow: hidden;
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
  transform: rotate(-45deg);
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
  transform: rotate(-45deg);
}

.bottom-nav .center.active {
  width: 20;
  transform: scale(1.2) rotate(45deg);
  margin-bottom: 10px;
}

.bottom-nav .center:hover:not(.active) {
  transform: scale(1.1) rotate(45deg);
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
