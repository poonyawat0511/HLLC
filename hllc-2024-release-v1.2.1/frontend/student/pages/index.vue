<script setup lang="ts">
definePageMeta({
  menu: {
    active: 'Home',
    display: true,
  },
  background: true,
})

// Injections
const { expansions } = useNavigation()
const { currentLevel } = useEvolution()
const { colors, avatars, assets } = useSchool()
const { $api } = useNuxtApp()

const avatar = computed(() => {
  return avatars[currentLevel.value as 1 | 2 | 3 | 4]
})

// References
const menu = ref(false)
const sponsors = ref<Sponsor[]>([])
const avatarError = ref(false)

const backpack = computed(() => {
  if (import.meta.server) return 'backpack.png'
  return assets['backpack'] || 'backpack.png'
})

const fetchData = async () => {
  try {
    const response = await $api.get<{ data: Sponsor[] }>('/sponsors')
    sponsors.value = response.data
  } catch (error) {
    console.error('Error fetching sposors:', error)
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <ClientOnly>
    <v-container fluid>
      <expansion-menu
        v-model="menu"
        style="position: absolute; z-index: 2"
        :items="expansions"
        :size="
          $vuetify.display.smAndDown ? 'sm' : $vuetify.display.md ? 'md' : 'lg'
        "
        expand-size="40vh"
        :activator-color="colors['expansion-activator']"
        :append-icon-color="colors['bottom-bg']"
        :color="colors['card-surface']"
        menu-bg-color="white"
        menu-icon-color="primary"
        class="text-content"
      >
        <template #activator="{ props }">
          <v-img :src="backpack" v-bind="props" />
        </template>
      </expansion-menu>
    </v-container>
    <div class="content">
      <div class="avatar">
        <div class="stage">
          <v-img src="book.png" contain />
        </div>
        <v-img
          class="image"
          :src="avatarError ? 'mystery-egg.png' : avatar"
          contain
          style="cursor: pointer"
          @error="avatarError = true"
          @click="$router.push('/evolution')"
        />
      </div>
      <div class="sponsor">
        <span
          class="text-white"
          :style="{
            fontSize: $vuetify.display.smAndDown
              ? '8px'
              : $vuetify.display.md
              ? '10px'
              : '12px',
          }"
        >
          {{ $t('Sponesored') }}
        </span>
        <sponsor-list
          class="mt-n2"
          style="font-size: 8px"
          :items="sponsors"
          :size="$vuetify.display.smAndDown ? 20 : 25"
        />
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.avatar {
  position: absolute;
  max-width: 70vw;
  width: 100%;
  left: 50%;
  bottom: 50%;
  transform: translateX(-50%) translateY(50%);
  display: flex;
  justify-content: center;
}

@media (min-aspect-ratio: 1) {
  .avatar {
    max-width: 40vh;
  }
}

.avatar::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  height: 150%;
  /* backdrop-filter: blur(1px);
  background-color: #ffffff2c;
  border-radius: 100%; */
  aspect-ratio: 1;
}

.avatar > .stage {
  position: absolute;
  left: 50%;
  bottom: -50%;
  transform: translateX(-50%);
  height: auto;
  width: 140%;
  display: flex;
  justify-content: center;
}

.avatar > .image {
  animation: linear infinite 1.5s shake;
  transform-origin: center bottom;
}

.sponsor {
  position: absolute;
  width: 100%;
  left: 50%;
  bottom: 10vh;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

@media (min-width: 1280px) {
  .content {
    left: 256px;
    width: calc(100% - 256px);
  }

  .avatar {
    bottom: 50%;
    max-width: 25vw;
  }

  .sponsor {
    bottom: 1vh;
  }
}

@media (min-aspect-ratio: 16/9) and (max-width: 960px) {
  .avatar {
    bottom: 60%;
    max-width: 10rem;
  }

  .sponsor {
    bottom: 18vh;
  }
}

@media (min-aspect-ratio: 16/9) and (max-width: 1280px) {
  .avatar {
    bottom: 55%;
    max-width: 18rem;
  }

  .sponsor {
    bottom: 12vh;
  }
}

@keyframes shake {
  0%,
  100% {
    rotate: 0deg;
  }

  25% {
    rotate: 1deg;
  }

  75% {
    rotate: -1deg;
  }
}
</style>
