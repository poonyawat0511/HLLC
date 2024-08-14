<script setup lang="ts">
definePageMeta({
  menu: {
    active: 'QR Code',
    display: true,
  },
  background: true,
})
</script>

<template>
  <v-container fluid>
    <qr-code />
  </v-container>
</template>
