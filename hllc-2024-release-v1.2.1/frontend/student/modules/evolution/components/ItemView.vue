<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

defineProps<{ item: Item }>()

const { current } = useLocale()

const { colors } = useSchool()

function isActive(item: Item) {
  return item.evolution?.isUsed
}

function isAvaiable(item: Item) {
  return item.evolution
}

const locale = computed(() => current.value as 'th' | 'en')
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="20rem">
    <v-card rounded="lg"  :style="{
        backgroundColor: colors['dialog-surface'],
        '-webkit-backdrop-filter': 'blur(15px)',
        'backdrop-filter': 'blur(15px)',
      }">
      <slot name="header" />
      <v-img
        width="100%"
        :class="{
          hidden: !isAvaiable(item),
          used: isActive(item),
        }"
        :src="item.image"
        class="mx-auto"
        contain
        max-width="15rem"
      />
      <v-card-title class="text-title">
        <template v-if="isAvaiable(item)">
          {{ item.name[locale] }}
        </template>
        <template v-else>
          {{ $t('lock item') }}
        </template>
      </v-card-title>
      <v-card-text class="text-content mt-n3">
        <template v-if="isAvaiable(item)">
          {{ item.description[locale] || $t('no description') }}
        </template>
        <template v-else> {{ $t('do mission') }} </template>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <slot name="actions">
          <v-btn color="primary" rounded variant="flat" class="px-5" @click="dialog = false">
            {{ $t('isClose') }}
          </v-btn>
        </slot>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.hidden {
  filter: brightness(0%);
}

.used {
  filter: grayscale(1);
}
</style>
