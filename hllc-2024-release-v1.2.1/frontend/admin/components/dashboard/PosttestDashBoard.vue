<script setup lang="ts">
const props = defineProps({
  posttestData: {
    type: Array as PropType<Posttest[]>,
    required: true,
  },
  loginData: {
    type: Array as PropType<UserLogin[]>,
    required: true,
  },
})
const posttests = computed(() => props.posttestData.length)

const persentages = computed(() => (posttests.value / allUsersCount.value)*100)
const allUsersCount = computed(() => props.loginData.totalUsers)
</script>
<template>
  <v-container>

      <v-card class="rounded-xl" elevation="4">
        <v-card-title class="justify-start mt-2">Post Test</v-card-title>
        <v-divider class="mt-2 mb-5" color="black" />
        <v-card-text class="d-flex flex-row align-center mb-5">
          <v-icon left>mdi-file-document-check</v-icon>
          <div class="mr-auto pa-2">{{posttests}}</div>
          <v-chip color="teal">{{persentages}} %</v-chip>
        </v-card-text>
      </v-card>
 </v-container
  >
</template>
