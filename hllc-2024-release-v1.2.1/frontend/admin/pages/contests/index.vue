<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/contests', title: 'Fresher Contest' },
  ],
})

const menus = [
  {
    title: 'Contest Settings',
    to: '/contests/settings',
    icon: 'mdi-tune',
  },
  {
    title: 'Content Management',
    to: '/contests/contents',
    icon: 'mdi-movie-open-cog',
  },
  {
    title: 'Vote Results',
    to: '/contests/summary',
    icon: 'mdi-podium',
  },
]
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <h2 class="text--text">Fresher Contest</h2>
      </v-col>
      <v-col
        v-for="menu in menus"
        :key="menu.to"
        cols="6"
        sm="4"
        md="3"
        lg="2"
        xl="2"
      >
        <menu-item
          :title="menu.title"
          :icon="menu.icon"
          :to="menu.to"
          rounded="lg"
          variant="outlined"
          class="border"
          height="100%"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
