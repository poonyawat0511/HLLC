<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

defineProps<{ items: Item[] }>()
defineEmits<{ evolve: [item: Item] }>()

const selectedItem = ref<Item | null>(null)

function isActive(item: Item) {
  if (!selectedItem.value) return false
  return selectedItem.value.id === item.id
}

function toggleSelect(item: Item) {
  if (isActive(item)) selectedItem.value = null
  else selectedItem.value = item
}
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="40rem">
    <v-card rounded="lg" color="white">
      <v-card-title class="d-flex">
        {{ $t('evolution') }}
        <v-spacer />
        <v-icon icon="mdi-close" @click="dialog = false" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <div v-if="!items.length">{{ $t('noItem') }}</div>
        <v-row v-else dense class="container mx-auto">
          <v-col cols="12">
            <h3>{{ $t('select item') }}</h3>
          </v-col>
          <v-col v-for="item in items" :key="item.id" cols="3" sm="2">
            <v-card
              theme="light"
              :color="isActive(item) ? 'primary' : undefined"
              class="pa-4 border"
              rounded="lg"
              variant="flat"
              @click="toggleSelect(item)"
            >
              <v-img :src="item.image" />
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="flat"
          color="primary"
          elevation="0"
          :disabled="!selectedItem"
          rounded
          class="px-5"
          @click="$emit('evolve', selectedItem!)"
        >
          {{ $t('evolution') }}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
