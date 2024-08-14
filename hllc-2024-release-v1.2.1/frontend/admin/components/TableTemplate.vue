<template>
  <div>
    <div class="d-flex align-center ga-6 my-3">
      <slot name="header-actions-left" />
      <v-spacer />
      <slot name="header-actions-right" />
      <v-text-field
        v-if="searchBar"
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded
        hide-details="auto"
        density="compact"
        single-line
        max-width="300"
      />
    </div>
    <v-sheet class="border rounded-lg">
      <v-data-table
        v-model="selected"
        :headers="props.headers"
        :items="props.items"
        :search="search"
        :group-by="props.groupBy"
        height="auto"
        item-value="id"
        :show-select="props.showSelect"
      >
        <template #[`item.actions`]="{ item }">
          <slot name="actions" :item="item" />
        </template>
      </v-data-table>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
const search = ref('')
const selected = ref<string[]>([])

const props = withDefaults(
  defineProps<{
    headers: { title: string; align: string; value: string }[]
    items?: object[]
    groupBy?: object[]
    showSelected?: boolean
    searchBar?: boolean
    showSelect: boolean
  }>(),
  {
    headers: undefined, // Default value for headers
    items: undefined, // Default value for items
    groupBy: undefined, // Default value for groupBy
    showSelected: false, // Default value for showSelected
    searchBar: true, // Default value for search
    showSelect: true
  }
)

const emits = defineEmits(['selectWatcher'])

watch(selected, () => {
  emits('selectWatcher', selected.value)
})
</script>
