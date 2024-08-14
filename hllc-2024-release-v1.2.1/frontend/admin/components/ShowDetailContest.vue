<script setup lang="ts">
const showDetails = defineModel<boolean>({ default: false })
const item = defineProps({
  selectedContest: { type: Object, default: null },
})

const embedSrc = computed(() => {
  if (item && item.selectedContest.url) {
    return `https://www.youtube-nocookie.com/embed/${item.selectedContest.url}?rel=0`
  } else {
    return null
  }
})
</script>

<template>
  <v-dialog v-model="showDetails" max-width="600">
    <v-card class="pa-4" rounded="lg" color="#FFFFFF9c">
      <v-list-item>
        <template #title>
          <p class="text-h5 font-weight-black">Preview contest</p>
        </template>

        <template #append>
          <v-btn
            variant="text"
            color="black"
            icon="mdi-close"
            @click="showDetails = false"
          />
        </template>
      </v-list-item>
      <!-- card english -->
      <v-card
        :title="item.selectedContest.team"
        class="pa-3"
        rounded="lg"
        color="#FFFFFF5c"
      >
        <template #prepend>
          <v-avatar
            size="35"
            :image="item?.selectedContest.coverImage"
            color="primary"
          />
        </template>
        <template #append>
          <v-chip color="white" variant="flat" class="ma-2 px-5" elevation="0">
            <v-avatar class="pa-1 ml-n1" color="transparent">
              <v-img src="../../public/contest/lamduan.png" />
            </v-avatar>
            <span class="ml-1">0</span>
          </v-chip>
        </template>
        <div class="ma-4 mt-n1">
          <div class="videoWrapper overflow-hidden rounded-xl">
            <iframe
              v-if="embedSrc"
              :src="embedSrc"
              title="YouTube Video Player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              allowfullscreen
              controls
            />
            <div v-else>No video available</div>
          </div>
        </div>
        <v-card-text class="mt-n4">
          <h2 style="color: black" class="pb-2">
            {{ item.selectedContest.title.en }}(
            {{ item.selectedContest.title.th }})
          </h2>
          <h4 style="color: black" class="text-medium-emphasis">
            <span style="color: black" class="font-weight-bold">
              Category(eng) :
            </span>
            {{ item.selectedContest.category.en }}
          </h4>
          <h4 style="color: black" class="text-medium-emphasis">
            <span style="color: black" class="font-weight-bold">
              Category(thai) :
            </span>
            {{ item.selectedContest.category.th }}
          </h4>
          <h4 style="color: black" class="text-medium-emphasis">
            <span style="color: black" class="font-weight-bold">
              Description(eng) :
            </span>
            {{ item?.selectedContest.description.en }}
          </h4>
          <h4 style="color: black" class="text-medium-emphasis">
            <span style="color: black" class="font-weight-bold">
              Description(thai) :
            </span>
            {{ item?.selectedContest.description.th }}
          </h4>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.videoWrapper {
  width: 100%;
  height: auto;
  aspect-ratio: calc(16 / 9);
  position: relative;
}

.videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  aspect-ratio: calc(16 / 9);
}
</style>
