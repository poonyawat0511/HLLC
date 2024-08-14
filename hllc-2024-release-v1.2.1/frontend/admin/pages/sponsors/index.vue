<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/sponsors', title: 'Sponsors' },
  ],
})

const menus = [
  {
    title: 'Sponsor Settings',
    to: '/sponsors/settings',
    icon: 'mdi-tune',
  },
  {
    title: 'Sponsors Management',
    to: '/sponsors/management',
    icon: 'mdi-card-account-details',
  },
  {
    title: 'Vouchers Management',
    to: '/sponsors/vouchers',
    icon: 'mdi-ticket-percent',
  },
  {
    title: 'Vouchers Code',
    to: '/sponsors/codes',
    icon: 'mdi-ticket-account',
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
