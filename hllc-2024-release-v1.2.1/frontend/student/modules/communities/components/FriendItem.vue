<!-- FriendItem.vue -->
<template>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{ props.rank }}. {{ props.fullName }}</v-list-item-title>
        <v-list-item-subtitle>{{ props.major.en }}</v-list-item-subtitle>
        <v-list-item-subtitle>Friends: {{ props.friendCount }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    rank: number;
    fullName: string;
    major: { th: string; en: string };
    friendCount: number;
  }>();
  </script>
  