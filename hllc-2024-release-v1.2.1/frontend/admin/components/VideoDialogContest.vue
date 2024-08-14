<script setup lang="ts">
const videoDialog = defineModel<boolean>({ default: false })
const props = defineProps({
  currentVideoId: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <v-dialog v-model="videoDialog" max-width="800px">
    <v-card class="rounded-xl">
      <v-responsive>
        <iframe
          width="100%"
          height="400"
          :src="'https://www.youtube.com/embed/' + props.currentVideoId"
          frameborder="0"
          allowfullscreen
        />
      </v-responsive>

      <v-card-actions class="justify-center">
        <v-btn
          rounded
          color="teal"
          dark
          text
          variant="flat"
          @click="videoDialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
