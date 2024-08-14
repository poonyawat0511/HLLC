<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })
const { colors } = useSchool()

type Props = {
  item?: voucherExists | null
}
defineProps<Props>()
const emits = defineEmits(['confirm'])
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
      rounded="xl"
      :style="{
        backgroundColor: colors['dialog-surface'],
        '-webkit-backdrop-filter': 'blur(15px)',
        'backdrop-filter': 'blur(15px)',
        position: 'relative',
        bottom: $vuetify.display.xs ? '10vh' : '7vh',
      }"
    >
      <v-card-title>
        <v-card
          variant="outlined"
          color="white"
          rounded="xl"
          class="mx-auto"
          width="60%"
        >
          <v-card-title class="text-center font-weight-bold">
            {{ item?.voucher.sponsor.name[lang] }}
          </v-card-title>
        </v-card>
      </v-card-title>
      <v-card-text class="mx-auto">
       <v-img :src="item?.voucher.voucherImages.main" class="text-center" />
        <p class="mt-7 text-center text-title">{{ $t('questionPick') }}</p>
      </v-card-text>
      <v-card-actions class="mb-6 mt-n2">
        <v-spacer />
        <v-btn variant="plain" class="mx-2" @click="dialog = false">
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn
          rounded
          variant="flat"
          class="px-2 white--text"
          color="primary"
          @click="$emit('confirm', item)"
        >
          {{ $t('Pick') }}
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
