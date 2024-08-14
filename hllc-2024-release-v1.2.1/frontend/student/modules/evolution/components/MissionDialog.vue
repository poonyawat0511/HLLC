<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

const { missions, success, waiting, coming, failure } = useMission()

const views = ['ALL', 'success', 'waiting', 'coming', 'failure'] as const

const { t } = useI18n()
const menus = computed(() =>
  views.map((view) => ({ title: t(view), value: view }))
)

type View = (typeof views)[number]

const selectedView = ref<View>('ALL')

const items = computed(() => {
  switch (selectedView.value) {
    case 'coming':
      return coming.value
    case 'waiting':
      return waiting.value
    case 'failure':
      return failure.value
    case 'success':
      return success.value
    default:
      return missions.value
  }
})

function getIcon(mission: Mission) {
  switch (mission.status) {
    case 'coming soon':
      return 'mdi-clock'
    case 'failed':
      return 'mdi-close-circle'
    case 'success':
      return 'mdi-check-circle'
    case 'waiting':
      return 'mdi-timer-sand'
  }
}

function getColor(mission: Mission) {
  switch (mission.status) {
    case 'coming soon':
      return 'grey'
    case 'failed':
      return 'error'
    case 'success':
      return 'success'
    case 'waiting':
      return 'warning'
  }
}

function getClass(mission: Mission) {
  switch (mission.status) {
    case 'coming soon':
      return ''
    case 'failed':
      return 'text-error'
    case 'success':
      return 'text-success'
    case 'waiting':
      return 'text-warning'
  }
}

const { colors } = useSchool()
const { current } = useLocale()
const locale = computed(() => current.value as 'th' | 'en')
</script>

<template>
  <v-dialog v-model="dialog" max-width="40rem" scrollable>
    <v-card
      rounded="lg"
      :style="{
        backgroundColor: colors['dialog-surface'],
        '-webkit-backdrop-filter': 'blur(15px)',
        'backdrop-filter': 'blur(15px)',
      }"
      max-height="30rem"
      min-height="30rem"
    >
      <v-card-title class="d-flex">
        {{ $t('Mission') }}
        <v-spacer />
        <v-responsive max-width="7rem">
          <v-select
            v-model="selectedView"
            variant="outlined"
            density="compact"
            hide-details
            :items="menus"
          />
        </v-responsive>
      </v-card-title>
      <v-divider />
      <v-card-text
        v-if="!items.length"
        class="d-flex align-center justify-center flex-column"
      >
        {{ $t('noMission') }}
      </v-card-text>
      <v-card-text v-else>
        <v-row dense>
          <v-col v-for="mission in items" :key="mission.index" cols="12">
            <v-card
              class="cursor-pointer mx-n2"
              :color="colors['card-surface']"
              elevation="0"
              rounded="lg"
              @click="$router.push(`/activities/${mission.id}`)"
            >
              <div class="ma-2">
                <div class="d-flex">
                  <v-avatar class="border" rounded="lg" tile size="90">
                    <v-img :src="mission.image" />
                  </v-avatar>
                  <div class="ml-2">
                    <span class="font-weight-bold text-title">
                      {{ $t('Mission') }}
                    </span>
                    <div>
                      <span style="font-size: 12px" :class="getClass(mission)">
                        "{{ mission.message[locale] }}"
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="mission.start?.[locale]"
                  style="font-size: 14px"
                  class="text-caption mt-2"
                >
                  {{ $t('start') }} : {{ mission.start[locale] }}
                </div>
                <div
                  v-if="mission.end?.[locale]"
                  style="font-size: 14px"
                  class="text-caption"
                >
                  {{ $t('end') }} : {{ mission.end[locale] }}
                </div>
                <div class="d-flex">
                  <v-chip
                    class="ml-auto px-5"
                    :color="getColor(mission)"
                    size="small"
                    :prepend-icon="getIcon(mission)"
                  >
                    {{ $t(mission.status) }}
                  </v-chip>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn rounded variant="flat" color="primary" @click="dialog = false">
          {{ $t('close') }}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style>
.black-image {
  filter: brightness(0) invert(0);
}
</style>
