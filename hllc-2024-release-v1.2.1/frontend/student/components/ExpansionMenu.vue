<script setup lang="ts">
const SIZE_DEFINITION = ['xs', 'sm', 'md', 'lg', 'xl'] as const
type SizeDefinition = (typeof SIZE_DEFINITION)[number]

interface Props {
  items?: ExpansionMenu[]
  color?: string
  avtivatorColor?: string
  openIcon?: string
  closeIcon?: string
  expandSize?: string | number
  appendIcon?: string
  appendOpenIcon?: string
  appendIconColor?: string
  appendColor?: string
  menuIconColor?: string
  menuBgColor?: string
  size?: string | number | SizeDefinition
  axis?: 'vertical' | 'horizontal'
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  color: 'white',
  avtivatorColor: 'primary',
  openIcon: 'mdi-book-open-blank-variant',
  closeIcon: 'mdi-book-open-page-variant',
  axis: 'vertical',
  expandSize: '50vh',
  appendIcon: 'mdi-menu-down',
  appendOpenIcon: 'mdi-menu-up',
  appendIconColor: 'white',
  appendColor: 'primary',
  menuIconColor: 'primary',
  menuBgColor: 'white',
  text: 'black',
  size: 'md',
})

const { data: user } = useAuth()
const menu = defineModel({ type: Boolean, default: false })
const toggleMenu = () => (menu.value = !menu.value)
const { assets } = useSchool()

const maxHeight = computed(() => {
  const { number, unit } = computeSize(props.expandSize)
  return `${number}${unit}`
})

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

const EXPAND_SIZE = computed(() => {
  return createSize('52px', '60px', '70px', '80px', '90px')
})

const ICON_SIZE = computed(() => {
  return createSize('30px', '35px', '40px', '45px', '50px', 0.5)
})

const TEXT_SIZE = computed(() => {
  return createSize('6px', '8px', '10px', '12px', '12px', 0.1)
})

const emit = defineEmits<{ 'click:menu': [menu: ExpansionMenu] }>()

const router = useRouter()
function onClick(item: ExpansionMenu) {
  emit('click:menu', item)
  router.push(item.to)
}

const expansions = computed(() => [
  {
    title: 'Fresher Contest',
    icon: assets['contest'],
    to: '/contest',
  },
  {
    title: 'Lamduan Origami',
    icon: assets['lamduan'],
    to: '/lamduan',
  },
  {
    title: 'Special Activity',
    icon: assets['khantoke'],
    to: '/khantoke',
  },
  {
    title: 'Community',
    icon: assets['community'],
    to: '/communities',
  },
  {
    title: 'Questions',
    icon: assets['question'],
    to: '/questions',
  },
])
</script>

<template>
  <ClientOnly>
    <v-sheet class="expansion-menu" :color="color" v-bind="$attrs">
      <div class="expansion-menu__item border-b" @click="toggleMenu()">
        <slot
          name="activator"
          :props="{ style: { width: ICON_SIZE, height: ICON_SIZE } }"
        >
          <v-avatar :size="EXPAND_SIZE">
            <v-img :src="user.theme?.assets.backpack" />
          </v-avatar>
        </slot>
      </div>
      <v-expand-transition>
        <div
          v-show="menu"
          :style="{ maxHeight, width: '100%' }"
          class="overflow-y-scroll pa-2"
        >
          <v-row dense>
            <v-col
              v-for="(item, i) in expansions"
              :key="i"
              cols="12"
              style="height: min-content"
            >
              <v-card
                height="auto"
                width="100%"
                rounded="lg"
                variant="flat"
                :color="menuBgColor"
                class="d-flex flex-column align-center justify-center pa-1"
                @click="onClick(item)"
              >
                <slot name="item" :item="item">
                  <v-avatar :size="ICON_SIZE" class="pa-1">
                    <v-img :src="item.icon" class="mb-1" />
                  </v-avatar>

                  <span
                    :style="{ fontSize: TEXT_SIZE, color: text }"
                    class="text-center"
                  >
                    {{ $t(`expansions.${item.title}`) }}
                  </span>
                </slot>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
      <v-sheet
        class="expansion-menu__append"
        :color="appendColor"
        @click="toggleMenu()"
      >
        <slot name="append">
          <v-icon
            :color="appendIconColor"
            :icon="menu ? appendOpenIcon : appendIcon"
          />
        </slot>
      </v-sheet>
    </v-sheet>
  </ClientOnly>
</template>

<style scoped>
.expansion-menu {
  width: v-bind(EXPAND_SIZE);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: start;
  overflow: hidden;
  border-radius: 12px;
}

.expansion-menu__item {
  width: v-bind(EXPAND_SIZE);
  height: v-bind(EXPAND_SIZE);
  display: flex;
  flex: column;
  justify-content: center;
  align-items: center;
  cursor: pointer !important;
}

.expansion-menu__append {
  height: 12px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer !important;
}
</style>
