<script setup lang="ts">
import type { NuxtError } from '#app'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const pageNotFound = ref('Oops.. sorry page not found')
const notFoundSrc = ref('/error/404.jpg')

defineProps({
  error: Object as () => NuxtError,
})

const router = useRouter()

const handleError = () => {
  router.push('/')
}
</script>

<template>
  <v-container fluid class="error-container">
    <v-card class="rounded-xl text-center error-card" flat color="transparent">
      <img :src="notFoundSrc" class="img-custom" />
      <v-card-title class="d-flex justify-center font-weight-bold">
        <p
          class="d-flex justify-center font-weight-bold"
          style="font-size: 30px"
        >
          {{ pageNotFound }}
        </p>
      </v-card-title>
      <v-card-text> Please try one of the following home page. </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          rounded
          variant="outlined"
          large
          class="px-5"
          @click="handleError"
        >
          Home page
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.error-card {
  max-width: 600px; /* Adjust the max width as needed */
  margin: auto; /* Center the card horizontally */
}

.img-custom {
  max-width: 20rem; /* Default size for all viewports */
}

/* Customize the size for different viewports */
@media (max-width: 720px) {
  .img-custom {
    max-width: 20rem; /* Large screens (lg) */
  }
}

@media (min-width: 720px) {
  .img-custom {
    max-width: 20rem; /* Medium screens (sm) */
  }
}

@media (min-width: 1280px) {
  .img-custom {
    max-width: 30rem; /* Small screens (md) */
  }
}
</style>
