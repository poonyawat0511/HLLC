<template>
  <v-card
    class="border border-grey rounded-lg bg-white fill-height"
    :variant="isHovering ? 'text' : 'flat'"
    :elevation="isHovering ? 10 : 0"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div v-if="photo">
      <v-img :src="props.photo" :aspect-ratio="3 / 2">
        <v-toolbar color="transparent">
          <v-spacer />
          <VerticalMenu v-if="menuItems" :items="menuItems" class="mr-2" />
        </v-toolbar>
      </v-img>
      <v-card-text class="justify-space-between d-flex flex-column">
        <slot name="contents" />
        <v-spacer />
        <slot name="actions" />
      </v-card-text>
    </div>
    <div v-else>
      <v-card-text>
        <div class="justify-space-between d-flex flex-row">
          <div class="d-flex flex-column">
            <slot name="contents" class="d-flex flex-column" />
          </div>
          <v-spacer />
          <VerticalMenu v-if="menuItems" :items="menuItems" />
        </div>
        <v-spacer />
        <slot name="actions" />
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface Item {
  icon: string
  title: string
  click: () => void
}

const props = withDefaults(
  defineProps<{
    photo?: string | null | undefined
    menuItems?: Item[]
    objectfit?: string
  }>(),
  {
    photo: null,
    menuItems: undefined,
    objectfit: 'fill',
  }
)
const isHovering = ref(false)
</script>

<style scoped></style>
