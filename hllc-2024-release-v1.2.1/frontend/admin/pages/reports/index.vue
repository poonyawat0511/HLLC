<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/reports', title: 'User Reports' },
  ],
})

const menus = [
  {
    title: 'Report Categories',
    to: '/reports/categories',
    icon: 'mdi-format-list-group',
  },
  {
    title: 'Reports Tracking',
    to: '/reports/trackings',
    icon: 'mdi-alert-octagon',
  },
  {
    title: 'Report Dashboard',
    to: '/reports/dashboard',
    icon: 'mdi-chart-box-multiple',
  },
]
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <h2 class="text--text">Reports</h2>
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
