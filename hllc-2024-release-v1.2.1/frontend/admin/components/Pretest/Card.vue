<script setup lang="ts">
const props = defineProps({
  type: { type: String, default: '' },
})
</script>

<template>
  <v-col cols="12" md="12">
    <v-card
      v-if="props.type === 'pretest'"
      rounded="xl"
      variant="outlined"
      class="border border-grey"
      elevation="0"
    >
      <v-card-title>
        <div class="d-flex justify-center">
          <span class="ml-1 mt-1 font-weight-bold">Pretest-Summary</span>
        </div>
      </v-card-title>
      <v-divider :thickness="2"  />
      <row>
        <v-col cols="12" md="12" class="d-flex flex-column align-center mt-3">
          <v-progress-circular model-value="20" :size="160" :width="10"
            ><div class="d-flex flex-column align-center">
              <span class="text-h5 font-weight-bold">2000</span>
              <span class="text-h7">Summit Pretest</span>
            </div></v-progress-circular
          >
        </v-col>
      </row>
      <v-card-text class="d-flex flex-column align-start ml-5">
        <ul>
          <li>
            <span class="text-h7">Submit :</span>
            <span class="text-h7 font-weight-bold"> 1000</span>
          </li>
          <li>
            <span class="text-h7">Unsubmit :</span>
            <span class="text-h7 font-weight-bold"> 1000</span>
          </li>
          <li>
            <span class="text-h7">All Users :</span>
            <span class="text-h7 font-weight-bold"> 1000</span>
          </li>
        </ul>
      </v-card-text>
    </v-card>

    <v-card
      v-if="props.type === 'posttest'"
      rounded="xl"
      variant="outlined"
      class="border border-grey"
      elevation="0"
    >
      <v-card-title>
        <div class="d-flex justify-center">
          <span class="ml-1 mt-1 font-weight-bold">Posttest-Summary</span>
        </div>
      </v-card-title>
      <v-divider :thickness="2" />
      <row>
        <v-col cols="12" md="12" class="d-flex flex-column align-center mt-3">
          <v-progress-circular model-value="55" :size="160" :width="10"
            ><div class="d-flex flex-column align-center">
              <span class="text-h5 font-weight-bold">2000</span>
              <span class="text-h7">Summit Posttest</span>
            </div></v-progress-circular
          >
        </v-col>
      </row>
      <v-card-text class="d-flex flex-column align-start ml-5">
        <ul>
          <li>
            <span class="text-h7">Submit :</span>
            <span class="text-h7 font-weight-bold"> 1000</span>
          </li>
          <li>
            <span class="text-h7">Unsubmit :</span>
            <span class="text-h7 font-weight-bold"> 1000</span>
          </li>
          <li>
            <span class="text-h7">All Users :</span>
            <span class="text-h7 font-weight-bold"> 1000</span>
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-col>
</template>
