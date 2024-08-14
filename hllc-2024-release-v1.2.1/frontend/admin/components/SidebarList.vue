<script setup lang="ts">
interface Props {
  items: MenuItem[]
}

const props = defineProps<Props>()
</script>

<template>
  <v-list density="compact" rounded nav>
    <div v-for="(item, i) in props.items" :key="i">
      <div class="mb-2 mt-5">
        <h6 class="ml-2">{{ item.module }}</h6>
      </div>
      <sidebar-item
        v-for="child in item.children"
        :key="child.to"
        :to="child.to"
        :icon="child.icon"
        :title="child.title"
      />
    </div>
  </v-list>
</template>
