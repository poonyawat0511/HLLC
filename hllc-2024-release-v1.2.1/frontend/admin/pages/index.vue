<script setup lang="ts">
definePageMeta({
  breadcrumbs: [{ to: '/', title: 'Home' }],
})

const appConfig = useAppConfig()
const menus = computed(() => appConfig.menus)
</script>

<template>
  <v-container fluid>
    <v-row v-for="(menu, i) in menus" :key="`menu-${i}`" dense>
      <v-col cols="12">
        <h2 class="text--text">{{ menu.module }}</h2>
      </v-col>
      <v-col cols="12">
        <v-row dense>
          <v-col
            v-for="child in menu.children"
            :key="child.to"
            cols="6"
            sm="4"
            md="3"
            lg="2"
            xl="2"
          >
            <menu-item
              :title="child.title"
              :icon="child.icon"
              :to="child.to"
              rounded="lg"
              variant="outlined"
              class="border"
              height="100%"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
