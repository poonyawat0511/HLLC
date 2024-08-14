<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })
const { colors } = useSchool()

interface Props {
  useRules: { th: string[]; en: string[] }
  getRules: { th: string[]; en: string[] }
  note: { th: string; en: string } | null
}
defineProps<Props>()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
</script>
<template>
  <div>
    <v-icon
      icon="mdi-alert-circle"
      size="40"
      class="mt-4"
      color="white"
      @click="dialog = true"
    />
    <v-dialog
      v-model="dialog"
      content-class="elevation-0"
      max-width="30rem"
      max-hight="30rem"
      scrollable
    >
      <v-card
        rounded="xl"
        :style="{
          backgroundColor: colors['dialog-surface'],
          '-webkit-backdrop-filter': 'blur(15px)',
          'backdrop-filter': 'blur(15px)',
        }"
        elevation="0"
        class="pa-2"
      >
        <v-card-title class="text-primary text-center">
          {{ $t('howtoVoucher') }}</v-card-title
        >
        <v-divider />
        <v-card-text class="mr-2 ml-4">
          <template v-if="useRules?.[lang]?.length || getRules?.[lang]?.length">
            <span class="text-title font-weight-bold">{{
              $t('howPickVoucher')
            }}</span>
            <ol class="text-subtitle mb-3">
              <!-- eslint-disable vue/no-v-html -->
              <li
                v-for="(text, index) in getRules[lang]"
                :key="index"
                v-html="text"
              />
            </ol>
            <span class="text-title font-weight-bold">{{
              $t('howUseVoucher')
            }}</span>
            <ol class="text-subtitle mb-3">
              <!-- eslint-disable vue/no-v-html -->
              <li
                v-for="(text, index) in useRules[lang]"
                :key="index"
                v-html="text"
              />
            </ol>
            <span class="text-title font-weight-bold text-error d-flex">
              <template v-if="note">
                *{{ note[lang] || $t('noData') }}*
              </template>
              <template v-else>
                <span class="text-center">
                  {{ $t('noData') }}
                </span>
              </template></span
            >
          </template>
          <template v-else>
            <span class="text-center">
              {{ $t('noData') }}
            </span>
          </template>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            rounded
            variant="flat"
            class="px-5"
            @click="dialog = false"
          >
            {{ $t('Accept') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
