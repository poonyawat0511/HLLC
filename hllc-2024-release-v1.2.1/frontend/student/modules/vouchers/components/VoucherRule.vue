<script setup lang="ts">
interface Props {
  rules: { th: string[]; en: string[] }
}
defineProps<Props>()

const dialog = defineModel({ type: Boolean, default: false })

type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
</script>
<template>
  <div>
    <v-btn variant="flat" rounded color="primary" @click="dialog = true">
      {{ $t('Rules') }}
    </v-btn>
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
            right: 7rem;
            z-index: 1;
          "
        >
          <!-- <v-img src="../contests/announcement.png" width="5rem"/> -->
        </div>
        <v-card
          rounded="xl"
          flat
          class="blur"
          :style="{
            position: 'relative',
            bottom: $vuetify.display.xs ? '4vh' : '4vh',
          }"
        >
          <v-card-title class="text-center text-primary">{{
            $t('Rules')
          }}</v-card-title>
          <v-card-text class="ma-4">
            <template v-if="rules?.[lang]?.length">
              <ol>
                <!-- eslint-disable vue/no-v-html -->
                <li
                  v-for="(text, index) in rules[lang]"
                  :key="index"
                  v-html="text"
                />
              </ol>
            </template>
            <template v-else>
              {{ $t('noData') }}
            </template>
          </v-card-text>
          <v-card-actions class="mt-n3 mb-3">
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
      </div>
    </v-dialog>
  </div>
</template>
