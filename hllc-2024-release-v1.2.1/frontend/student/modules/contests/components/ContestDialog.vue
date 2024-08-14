<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

export type VoteType = 'vote' | 'cancel'

interface Props {
  item: Contest
  loading?: boolean
  type?: VoteType
}

type Events = {
  confirm: [type: VoteType, item: Contest]
}
const { colors } = useSchool()
withDefaults(defineProps<Props>(), {
  loading: false,
  type: 'vote',
})

defineEmits<Events>()

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
    <div style="position: relative">
      <div
        style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: end;
          z-index: 1;
        "
      >
        <v-img
          :src="type === 'vote' ? '../icons/Like.png' : '../contests/unVote.png'"
          style="width: 30rem"
        />
      </div>
      <v-card
        rounded="xl"
        class="text-center"
        :style="{
          backgroundColor: colors['dialog-surface'],
          '-webkit-backdrop-filter': 'blur(15px)',
          'backdrop-filter': 'blur(15px)',
          position: 'relative',
          bottom: $vuetify.display.xs ? '10vh' : '7vh',
        }"
      >
        <div style="height: 4rem" />
        <v-card-text class="justify-center">
          <p class="font-weight-bold text-content">
            {{ $t(type === 'vote' ? 'doVote' : 'doUnVote') }}
            <span
              style="font-weight: bold; font-size: 2rem"
              class="text-primary  contest-description "
            >
              {{ item.title[lang] }}
            </span>
            {{ $t('Right') }}
          </p>
        </v-card-text>
        <v-card-actions class="mb-5">
          <v-spacer />
          <v-btn
            rounded
            variant="plain"
            class="mx-2 white--text"
            @click="dialog = false"
          >
            <v-responsive width="6rem"> {{ $t('Cancel') }} </v-responsive>
          </v-btn>
          <v-btn
            rounded
            variant="flat"
            color="primary"
            class="mx-2 text-white"
            @click="$emit('confirm', type, item)"
          >
            <v-responsive width="6rem"> {{ $t('Confirm') }} </v-responsive>
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<style scoped>
.contest-description {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
