<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

interface Props {
  item: AnswerQuestion | null
}
const props = defineProps<Props>()

const emit = defineEmits(['confirm'])
const onSubmit = async () => {
  emit('confirm')
}

type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
const { colors } = useSchool()
</script>
<template>
  <v-dialog v-model="dialog" max-width="35rem" scrollable>
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
        class="ml-6"
      >
        <v-img src="/icons/edit-lamduan.png" style="width: 18rem" />
      </div>
      <v-card
        :style="{
          backgroundColor: colors['dialog-surface'],
          '-webkit-backdrop-filter': 'blur(15px)',
          'backdrop-filter': 'blur(15px)',
          position: 'relative',
          bottom: $vuetify.display.xs ? '7vh' : '4vh',
        }"
        class="pr-4 pl-4"
        rounded="xl"
        elevation="0"
      >
        <div style="height: 3rem" />
        <v-card-text class="text-primary text-center font-weight-bold">
          <h3>{{ $t('noteLamduan') }}</h3>
        </v-card-text>
        <v-card-actions class="mb-3">
          <v-spacer />
          <v-btn
            variant="plain"
            rounded="xl"
            class="px-5"
            @click="dialog = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            rounded-lg
            variant="flat"
            class="px-5"
            rounded="xl"
            @click="onSubmit()"
          >
            {{ $t('Confirm') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>
