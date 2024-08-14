<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

defineProps<{ items: Item[] }>()
const emit = defineEmits<{ 'click:item': [item: Item] }>()

const { colors } = useSchool()

function isActive(item: Item) {
  return item.evolution?.isUsed
}

function isAvaiable(item: Item) {
  return item.evolution
}

function open(item: Item) {
  emit('click:item', item)
}
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="50rem">
    <v-card
      rounded="lg"
      :style="{
        backgroundColor: colors['dialog-surface'],
        '-webkit-backdrop-filter': 'blur(15px)',
        'backdrop-filter': 'blur(15px)',
      }"
    >
      <v-card-title class="d-flex text-title">
        <v-spacer />
        {{ $t('items') }}
        <v-spacer />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <div v-if="!items.length">{{ $t('noItem') }}</div>
        <v-row v-else dense class="container mx-auto">
          <v-col cols="12">
            <h4 class="text-title">{{ $t('select item') }}</h4>
          </v-col>
          <v-col v-for="item in items" :key="item.id" cols="4" sm="2">
            <v-card
              theme="light"
              class="pa-4 border"
              rounded="lg"
              elevation="0"
              variant="outlined"
              @click="open(item)"
            >
              <v-img
                :src="item.image"
                :class="{ used: isActive(item),hidden: !isAvaiable(item) }"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <slot name="actions">
          <v-btn
            color="primary"
            rounded
            variant="flat"
            class="px-5"
            @click="dialog = false"
          >
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
