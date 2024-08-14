<script setup lang="ts">
const SIZE_DEFINITION = ['xs', 'sm', 'md', 'lg', 'xl'] as const
type SizeDefinition = (typeof SIZE_DEFINITION)[number]

interface Props {
  color?: string
  image?: string
  title?: string
  size?: string | number | SizeDefinition
  colorText?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  color: 'white',
  image: '',
  title: 'Menu',
  size: 'md',
  colorText: 'black'
})

const menu = defineModel({ type: Boolean, default: false })
const toggleMenu = () => (menu.value = !menu.value)

const createSize = (
  xs: string,
  sm: string,
  md: string,
  lg: string,
  xl: string,
  size?: number
) => {
  const options: Record<SizeDefinition, string> = { xs, sm, md, lg, xl }
  if (typeof props.size === 'string') {
    if (SIZE_DEFINITION.includes(props.size as SizeDefinition)) {
      return options[props.size as SizeDefinition]
    }
    const { number, unit } = computeSize(props.size)
    return `${number * (size ?? 1)}${unit}`
  }
  return `${props.size}px`
}

const SIZE = computed(() => {
  return createSize('52px', '60px', '70px', '80px', '90px')
})

const ICON_SIZE = computed(() => {
  return createSize('30px', '35px', '40px', '45px', '50px', 0.5)
})

const TEXT_SIZE = computed(() => {
  return createSize('6px', '8px', '10px', '12px', '12px', 0.1)
})
</script>

<template>
  <ClientOnly>
    <v-sheet class="menu" :color="color" v-bind="$attrs">
      <div class="menu__item border-b" @click="toggleMenu()">
        <slot
          name="activator"
          :props="{ style: { width: ICON_SIZE, height: ICON_SIZE } }"
        >
          <v-avatar :size="ICON_SIZE">
            <v-img :src="image" />
          </v-avatar>
        </slot>
        <div
          :style="{ fontSize: TEXT_SIZE, color: colorText}"
        >
          {{ title }}
        </div>
      </div>
    </v-sheet>
  </ClientOnly>
</template>

<style scoped>
.menu {
  width: v-bind(SIZE);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: start;
  overflow: hidden;
  border-radius: 12px;
}

.menu__item {
  width: v-bind(SIZE);
  height: v-bind(SIZE);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer !important;
}
</style>
