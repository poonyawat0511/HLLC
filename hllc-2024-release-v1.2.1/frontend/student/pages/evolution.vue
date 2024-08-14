<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
definePageMeta({
  menu: {
    display: true,
    pcOnly: true,
  },
  background: true,
})

// Injections
const { avatars, colors } = useSchool()
const {
  init,
  items,
  currentLevel,
  itemsPerLevel,
  currentItems,
  readyItems,
  setting,
  evolve,
} = useEvolution()

const itemsCount = computed(() => itemsPerLevel.value[currentLevel.value])

// References
const copyItems = ref<Item[]>([])
const avatarError = ref(false)

const itemFill = ref({})

function fill(height: string, duraton: number) {
  return {
    clipPath: `polygon(0 100%, 100% 100%, 100% ${height}, 0% ${height})`,
    transition: `clip-path ${duraton}s`,
  }
}

interface Menu {
  title: string
  image: string
  onClick: () => void
}

const menus = computed<Menu[]>(() => [
  {
    title: 'Mission',
    image: setting.value.images.mission,
    onClick() {
      mission.dialog = true
    },
  },
  {
    title: 'Item',
    image: setting.value.images.item,
    onClick() {
      list.dialog = true
    },
  },
])

const currentAvatar = computed(() => {
  return avatars[currentLevel.value as 1 | 2 | 3 | 4]
})

const nextAvatar = computed(() => {
  if (currentLevel.value === 4) {
    return avatars[4]
  }
  return avatars[(currentLevel.value + 1) as 1 | 2 | 3]
})

const mission = reactive({
  dialog: false,
})

const list = reactive({
  dialog: false,
})

const view = reactive({
  dialog: false,
  item: null as Item | null,
  open(item: Item) {
    this.item = item
    this.dialog = true
  },
})

const evolution = reactive({
  dialog: false,
  loading: false,
  async start() {
    status.value = 'updating'
    itemFill.value = fill('100%', 2)
    await wait(10)
    itemFill.value = fill('0%', 2)
    await wait(1800)
    itemFill.value = {}
  },
})

const nextLevel = reactive({
  dialog: false,
  final: false,
  async open(isFinal: boolean) {
    this.final = isFinal
    this.dialog = true
    status.value = 'evolving'
    itemFill.value = fill('100%', 2)
    await wait(10)
    itemFill.value = fill('0%', 2)
    await wait(2000)
  },

  close() {
    itemFill.value = {}
    this.dialog = false
    status.value = undefined
  },
})

const snackbar = inject<Snackbar>('snackbar')

const status = ref<'updating' | 'evolving'>()

function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

async function onEvolve(item: Item) {
  try {
    evolution.loading = true
    await evolve(item, async (updatedItem, next) => {
      evolution.dialog = false
      evolution.loading = false
      copyItems.value.push(updatedItem!)
      // Show fill book animation
      await evolution.start()
      // Show evolve animation
      if (copyItems.value.length === itemsCount.value) {
        evolution.dialog = false
        nextLevel.close = function () {
          itemFill.value = {}
          this.dialog = false
          next()
          if (currentLevel.value < 4) {
            copyItems.value = []
            status.value = undefined
          }
        }
        await nextLevel.open(currentLevel.value === 4)
      } else {
        next()
        // copyItems.value.push(updatedItem)
      }
    })
  } catch (error) {
    snackbar?.open(getErrorMessage(error))
  }
}

onMounted(async () => {
  await init()
  copyItems.value = currentItems.value.map((item) =>
    JSON.parse(JSON.stringify(item))
  )
})
</script>

<template>
  <ClientOnly>
    <!-- Evolve dialog -->
    <evolve-dialog
      v-model="evolution.dialog"
      :items="readyItems"
      @evolve="onEvolve"
    />

    <!-- List items -->
    <items-list-dialog
      v-model="list.dialog"
      :items="items"
      @click:item="view.open($event)"
    />

    <!-- Mission dialog -->
    <mission-dialog v-model="mission.dialog" />

    <!-- Item View -->
    <item-view v-model="view.dialog" :item="view.item!" />

    <v-dialog v-model="nextLevel.dialog" persistent max-width="40rem">
      <v-card color="white" rounded="lg">
        <v-card-title class="d-flex justify-center">
          {{ $t('congrate') }}
        </v-card-title>
        <v-img
          :src="nextLevel.final ? 'logo-sdad.png' : nextAvatar"
          height="30vh"
          contain
          :style="status === 'evolving' ? itemFill : {}"
        />
        <v-card-text>
          {{ nextLevel.final ? $t('success level') : $t('full collection') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            rounded
            color="primary"
            variant="flat"
            @click="nextLevel.close()"
          >
            {{ $t('Confirm') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container fluid class="d-flex flex-column justify-start align-end">
      <div class="menu-container" style="z-index: 2">
        <evaluation-menu
          v-for="menu in menus"
          :key="menu.title"
          :title="$t(menu.title)"
          :image="menu.image"
          :color="colors['evolution-menu']"
          :color-text="colors['evolution-text-menu']"
          class="mb-2"
          @click="menu.onClick()"
        />
      </div>
    </v-container>
    <div class="content">
      <div class="upgrade d-flex flex-column align-center pa-5">
        <div class="avatar">
          <div class="stage">
            <v-img src="book.png" contain />
          </div>
          <v-img
            class="image"
            :src="avatarError ? 'mystery-egg.png' : currentAvatar"
            contain
            @error="avatarError = true"
          />
        </div>
        <!-- Evolve button -->
        <v-btn
          color="primary"
          class="mb-3"
          rounded
          @click="evolution.dialog = true"
        >
          {{ $t('evolution') }}
        </v-btn>
        <!-- Preview card -->
        <v-card
          max-width="50rem"
          rounded="xl"
          :color="colors['evolution-card']"
          width="100%"
          class="mx-auto card-preview"
        >
          <v-card-text>
            <v-row dense>
              <v-col
                v-bind="
                  currentLevel === 4 ? { cols: 12 } : { cols: 6, sm: 7, md: 8 }
                "
                class="d-flex flex-column"
              >
                <div class="text-center text-evolution-text-card">
                  <template v-if="currentLevel !== 4">
                    {{ $t('ItemForUpLevel') }}
                  </template>
                  <template v-else>
                    {{ $t('Congratulations') }}
                  </template>
                </div>
                <div
                  class="d-flex align-center justify-center h-100 overflow-scroll"
                >
                  <v-responsive
                    v-for="(_, i) in itemsCount"
                    :key="i"
                    max-width="5rem"
                  >
                    <v-img
                      :src="
                        i < copyItems.length
                          ? copyItems[i].image
                          : setting?.images.secret
                      "
                      class="mx-2"
                      :style="
                        status === 'updating' && copyItems.length - 1 === i
                          ? itemFill
                          : {}
                      "
                    />
                  </v-responsive>
                </div>
                <div class="text-center text-caption text-evolution-text-card">
                  <template v-if="currentLevel !== 4">
                    {{ $t('joinMore') }}
                    {{ itemsCount - copyItems.length }}
                    {{ $t('activity') }}
                  </template>
                  <template v-else>
                    {{ $t('there are more') }}
                    {{ itemsCount - copyItems.length }}
                    {{ $t('activity to collect') }}
                  </template>
                </div>
              </v-col>
              <v-divider v-if="currentLevel !== 4" vertical />
              <v-col
                v-if="currentLevel !== 4"
                cols="6"
                sm="5"
                md="4"
                class="d-flex flex-column align-center"
              >
                <div class="text-center text-evolution-text-card">
                  {{ $t('nextLevel') }}
                </div>
                <v-img
                  max-height="7rem"
                  width="100%"
                  :src="nextAvatar"
                  style="filter: brightness(0%)"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.menu-container {
  position: absolute;
}

.hidden {
  filter: brightness(0%);
}

.content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.avatar {
  position: relative;
  max-width: 45vw;
  margin-bottom: 10vh;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
}

.upgrade {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

@media (max-aspect-ratio: 1) and (min-width: 768px) and (max-width: 1280px) {
  .avatar {
    max-width: 45vw;
    margin-bottom: 10rem;
  }
}

@media (min-aspect-ratio: 1) {
  .avatar {
    max-width: 40vh;
    margin-bottom: 6rem;
  }
}

.avatar > .stage {
  position: absolute;
  left: 50%;
  bottom: -50%;
  transform: translateX(-50%);
  height: auto;
  width: 150%;
  display: flex;
  justify-content: center;
}

@media (min-width: 1280px) {
  .content {
    left: 256px;
    width: calc(100% - 256px);
  }

  .avatar {
    max-width: 20vw;
    margin-bottom: 5rem;
  }
}

@media (min-aspect-ratio: 16/9) and (max-width: 960px) {
  .avatar {
    max-width: 12rem;
  }

  .card-preview {
    display: none;
  }
}

@media (min-aspect-ratio: 16/9) and (max-width: 1280px) {
  .avatar {
    max-width: 12rem;
    margin-bottom: 3rem;
  }
}
</style>
