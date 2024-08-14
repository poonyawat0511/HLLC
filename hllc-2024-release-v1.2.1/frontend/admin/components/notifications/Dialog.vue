<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

enum RecipientType {
  Major = 'MAJOR',
  School = 'SCHOOL',
  Individual = 'INDIVIDUAL',
}

interface Recipient {
  type: RecipientType
  id: string
}

interface INotification {
  title: { th: string, en: string }
  subtitle: { th: string, en: string}
  detail: { th: string, en: string }
  icon: string
  image: string
  redirect: {
    url: string
    btnMessage: {
      th: string
      en: string
    }
  } | null
  recipients: 'everyone' | Recipient[]
  timestamp: Date
  formattedTimeStamp?: string
}

interface Props {
  item: INotification | null
  dialog: boolean
  loading?: boolean
}

const { colors } = useSchool()
withDefaults(defineProps<Props>(), {
  loading: false,
})

type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
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
        <span style="font-size: 12px"> {{ item.formattedTimeStamp }} </span>
      </template>
      <v-card-text class="mb-3">
        <div class="d-flex flex-no-wrap justify-space-between">
          <div style="width: 100%">
            <div>{{ item.subtitle[lang] }}</div>
          </div>
          <div class="mt-n1" style="width: 60px; height: 60px">
            <v-img :src="item.image" />
          </div>
        </div>
        <div class="text-subtitle">{{ item.detail[lang] }}</div>
        <div v-if="item.redirect?.url" class="d-flex flex-no-wrap justify-end">
          <v-btn
            variant="flat"
            :to="item.redirect.url"
            rounded
            color="primary"
            class="px-7 mt-3"
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
          @click="dialog = false"
        >
          <v-responsive width="6rem"> Cancel </v-responsive>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
