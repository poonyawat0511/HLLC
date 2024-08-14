<script setup lang="ts">
import type { VTextField, VForm } from 'vuetify/components'
import backgroundImage from '@/assets/images/bg.jpg'

const { $api } = useNuxtApp()

definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/notifications', title: 'Notifications' },
  ],
})

const menus = [
  {
    title: 'Push Notification',
    to: '/notifications/push',
    icon: 'mdi-bell-ring',
  },
  {
    title: 'Notification Management',
    to: '/notifications/management',
    icon: 'mdi-bell-cog',
  },
]
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <h2 class="text--text">Notifications</h2>
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
