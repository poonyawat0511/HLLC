<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

interface Props {
  item: IAnswer | null
}
defineProps<Props>()

type Events = {
  confirm: [item: IAnswer]
}

const emit = defineEmits<Events>()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
const { colors } = useSchool()
</script>
<template>
  <v-dialog
    v-model="dialog"
    content-class="elevation-0"
    max-width="30rem"
    persistent
    scrollable
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
        <v-img src="/icons/warning-red.png" style="width: 8rem" />
      </div>
      <v-card
      rounded="xl"
      :style="{
        backgroundColor: colors['dialog-surface'],
        '-webkit-backdrop-filter': 'blur(15px)',
        'backdrop-filter': 'blur(15px)',
        position: 'relative',
        bottom: $vuetify.display.xs ? '4vh' : '3.5vh',
      }"
      elevation="0"
    >
    <div style="height:2rem"></div>
      <v-card-text class="text-center text-error">
        <h3>{{ $t('deleteQuestion') }}</h3>
      </v-card-text>
      <v-card-actions class="mb-4 mt-n1">
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
          @click="item && emit('confirm', item)"
        >
          <v-responsive width="6rem">
            {{ $t('Confirm') }}
          </v-responsive>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </div>
    
  </v-dialog>
</template>
