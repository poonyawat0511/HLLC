<script setup lang="ts">
const props = defineProps({
  pretestData: {
    type: Array as PropType<Pretest[]>,
    required: true,
  },
  loginData: {
    type: Array as PropType<UserLogin[]>,
    required: true,
  },
})
const pretests = computed(() => props.pretestData.length)

const persentages = computed(() => (pretests.value / allUsersCount.value)*100)
const allUsersCount = computed(() => props.loginData.totalUsers)
</script>
<template>
  <v-container>
    <v-card class="rounded-xl" elevation="4">
      <v-card-title class="justify-start mt-2">Pre Test</v-card-title>
      <v-divider class="mt-2 mb-5" color="black" />
      <v-card-text class="d-flex flex-row align-center mb-5">
        <v-icon icon="mdi-file-document-check" />
        <div class="mr-auto pa-2">{{ pretests }}</div>
        <v-chip color="teal">{{ persentages }} %</v-chip>
      </v-card-text>
    </v-card>
  </v-container>
</template>
