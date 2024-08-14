<script setup lang="ts">
const snackbars = defineModel<Array<SnackbarItem>>({
  default: [],
})

function close(index: number) {
  snackbars.value.splice(index, 1)
}

function calcMargin(index: number) {
  return index * 60 + 'px'
}
</script>

<template>
  <div>
    <v-snackbar
      v-for="(snackbar, index) in snackbars"
      :key="index"
      v-model="snackbar.open"
      :timeout="snackbar.timeout ?? 3000"
      :color="snackbar.color"
      transition="slide-x-transition"
      rounded
      :style="{ 'margin-bottom': calcMargin(index) }"
    >
      <v-icon v-if="snackbar.icon" class="mr-2" color="white">{{
        snackbar.icon
      }}</v-icon>
      <span class="text--white custom-font">{{ snackbar.message }}</span>
      <template #actions>
        <v-btn color="red" variant="text" @click="close(index)">
          <v-icon color="white" size="1rem">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
