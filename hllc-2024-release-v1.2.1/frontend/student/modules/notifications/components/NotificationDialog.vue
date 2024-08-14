<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

interface Props {
  item: NotificationEntity
  loading?: boolean
}

const { colors } = useSchool()
type Events = {
  close: []
}
const emit = defineEmits<Events>()
const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)

function close() {
  emit('close')
}

const router = useRouter()
function redirect() {
  const url = props.item?.redirect?.url
  if (!url) return
  if (/^https?:\/\//.test(url)) {
    return window.open(url, '_blank')
  }
  return router.push(url)
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    content-class="elevation-0"
    max-width="30rem"
    persistent
  >
    <v-card
      v-if="item"
      rounded="xl"
      :style="{
        backgroundColor: colors['dialog-surface'],
        '-webkit-backdrop-filter': 'blur(15px)',
        'backdrop-filter': 'blur(15px)',
        position: 'relative',
        bottom: $vuetify.display.xs ? '10vh' : '7vh',
      }"
    >
      <template #prepend>
        <v-icon :icon="item.icon" />
      </template>
      <template #title>{{ item.title[lang] }}</template>
      <template #append>
        <span style="font-size: 12px"> {{ item.timestamp[lang] }} </span>
      </template>
      <v-card-text class="mb-3">
        <div class="d-flex flex-no-wrap justify-space-between">
          <div style="width: 100%">
            <div>{{ item.subtitle[lang] }}</div>
          </div>
          <v-avatar class="mt-n1 rounded-lg" size="60" tile>
            <v-img :src="item.image" />
          </v-avatar>
        </div>
        <div class="text-subtitle">{{ item.detail[lang] }}</div>
        <div v-if="item.redirect?.url" class="d-flex flex-no-wrap justify-end">
          <v-btn
            variant="flat"
            rounded
            color="primary"
            class="px-7 mt-3"
            @click="redirect"
          >
            {{ item.redirect.btnMessage[lang] }}
          </v-btn>
        </div>
      </v-card-text>
      <v-divider class="mt-n4" />
      <v-card-actions class="mb-4 mt-3">
        <v-spacer />
        <v-btn
          rounded
          variant="flat"
          class="mx-2 white--text"
          color="error"
          :loading="loading"
          @click="close"
        >
          <v-responsive width="6rem"> {{ $t('isClose') }} </v-responsive>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
