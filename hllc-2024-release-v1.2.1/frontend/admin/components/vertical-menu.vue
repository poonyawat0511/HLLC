<template>
  <div>
    <v-menu>
      <template #activator="{ props }">
        <v-btn
          class="text-none font-weight-bold rounded-pill bg-white"
          icon="mdi-dots-vertical"
          variant="text"
          density="comfortable"
          color="black"
          elevation="0"
          v-bind="props"
        />
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="index"
          @click="handleItemClick(item)"
        >
          <v-list-item-title>
            <v-icon>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
interface Item {
  icon: string;
  title: string;
  click: () => void;
}
interface Props {
  items: Item[];
}

const { items } = defineProps<Props>()
const handleItemClick = (item:Item) => {
  item.click();
}
</script>

<style scoped></style>
