<script setup lang="ts">
const { colors } = useSchool()

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
  item: INotification
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
})

type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)

defineEmits<{
  'click:first': [value: INotification]
}>()

</script>

<template>
  <v-card
    v-if="item"
    :color="colors['card-surface']"
    rounded="xl"
    elevation="0"
    @click="$emit('click:first', item)"
  >
    <template #prepend>
      <v-icon :icon="item.icon" />
    </template>
    <template #title>{{ item.title[lang] }}</template>
    <template #append>
      <span style="font-size: 12px"> {{ item.formattedTimeStamp }} </span>
    </template>
    <v-card-text class="mb-n1">
      <div class="d-flex flex-no-wrap justify-space-between">
        <div style="width: 100%;">
          <div class="box-subtitle">{{ item.subtitle[lang] }}</div>
        </div>
        <v-responsive height="50px" width="50px">
          <v-img :src="item.image" />
        </v-responsive>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.box-subtitle {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
