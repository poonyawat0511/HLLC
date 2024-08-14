<script setup lang="ts">
const { colors } = useSchool()

const props = withDefaults(
  defineProps<{
    activity: IActivity
    tracking?: boolean
    hideHeader?: boolean
  }>(),
  { hideHeader: false, tracking: false }
)

const { current } = useLocale()
type Locales = 'th' | 'en'
const lang = computed(() => current.value as Locales)

const startDate = computed(() => {
  const startDateString = props.activity.dateTime.start
    ? new Date(props.activity.dateTime.start)
    : undefined
  return {
    en: startDateString
      ? new Intl.DateTimeFormat('en-gb', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(startDateString)
      : textMessage.noTime.en,
    th: startDateString
      ? new Intl.DateTimeFormat('th', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(startDateString)
      : textMessage.noTime.th,
  }
})
const textMessage = {
  noTime: {
    th: 'แล้วพบกันเร็วๆนี้',
    en: 'Coming Soon.',
  },
  unknownLocation: {
    th: 'จะแจ้งให้ทราบในภายหลัง',
    en: 'To be informed later.',
  },
}
</script>
<template>
  <v-card
    rounded="xl"
    elevation="0"
    class="fill-height"
    :color="colors['card-surface']"
  >
    <v-responsive :aspect-ratio="16 / 9" class="bg-primary">
      <v-img
        :src="activity.banner ? activity.banner : '../no-img.png'"
        :aspect-ratio="16 / 9"
        cover
        :class="activity.banner ? 'bg-primary' : 'bg-white'"
      >
        <v-toolbar color="transparent" class="px-2 mt-n2">
          <v-chip variant="flat" :color="colors['card-surface']">
            <v-icon color="primary" size="small" class="mr-1"
              >mdi-calendar-month</v-icon
            >
            <p style="font-size: 12px;font-weight: bold;" class="text-primary">
              {{ startDate[lang] || textMessage.noTime[lang] }}
            </p>
          </v-chip>
          <v-spacer />
          <v-chip
            v-if="activity.code === 'KHANTOKE'"
            variant="flat"
            :color="colors['card-surface']"
          >
            <v-icon color="primary" size="small" class="mr-1">mdi-star</v-icon>
            <p style="font-size: 12px" class="text-primary">Spacial</p>
          </v-chip>
        </v-toolbar>
      </v-img>
    </v-responsive>

    <!-- Show tracking -->
    <v-card-text v-if="tracking" class="fill-height">
      <h2 v-if="!hideHeader" class="h2-one-line-text text-center">
        {{ $t(activity.name[lang]) }}
      </h2>
      <div class="py-4">
        <ActivityDotTracking :activity="activity" class="fill-height" />
      </div>
    </v-card-text>
    <!-- Show details -->
    <v-card-text v-else>
      <div class="d-flex ma-1 ga-4 h-100 align-center">
        <div class="rounded-xl">
          <v-img
            :src="activity.icon || '/no-img.png'"
            :aspect-ratio="1 / 1"
            width="75"
            class="border rounded-xl"
          />
        </div>
        <div class="fill-height d-flex flex-column ga-1">
          <h2 class="h2-one-line-text text-title">
            {{ activity.name[lang] }}
          </h2>
          <p class="p-two-line-text text-subtitle">
            {{ activity.shortDesc[lang] }}
          </p>
          <div class="d-flex ga-1 align-center text-subtitle py-1">
            <v-icon color="subtitle">mdi-map-marker-outline</v-icon>
            <p v-if="activity.location">
              {{ activity.location[lang] }}
            </p>
            <p v-if="activity.location[lang] === ''">
              {{ textMessage.unknownLocation[lang] }}
            </p>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.h2-one-line-text {
  line-height: 1.5;
  max-height: 3em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
.p-two-line-text {
  font-size: 1em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: normal;
  height: 3em;
}
</style>
