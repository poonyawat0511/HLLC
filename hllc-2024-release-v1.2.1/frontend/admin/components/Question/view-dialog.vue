<script setup lang="ts">
const props = defineProps({
  activityDetail: { type: Object, required: true },
  activityId: { type: String, required: true },
  activityName: { type: String, required: true }
})

const emits = defineEmits(['closeDialog'])

const dialogView = defineModel<boolean>({ default: false })

// Function to close the dialog
function closeDialog() {
  dialogView.value = false
  emits('closeDialog') // Emitting the 'closeDialog' event
}
</script>

<template>
  <v-dialog v-model="dialogView" max-width="600px" persistent>
    <v-card class="rounded-xl pa-4" elevation="5">
      <v-card-title class="pa-0 mb-2">
        <span class="font-weight-medium ml-2"
          >View Questions {{ props.activityName }}
        </span>
      </v-card-title>
      <v-divider />
      <v-form>
        <v-row>
          <v-col
            v-for="(item, index) in activityDetail"
            :key="index"
            cols="12"
            class="my-n1"
          >
            <v-card class="rounded-lg pa-2 border" elevation="0">
              <v-card-text>
                <span class="text-body-3 font-weight-bold text-medium-emphasis">
                  {{ index + 1 }}. {{ item.question.en }}
                </span>
                <span v-if="item.required" class="text-red font-weight-bold">
                  *
                </span>
                <!-- ratings -->
                <div v-if="item.type == 'RATINGS'" class="mt-5">
                  <v-radio-group
                    class="d-flex justify-center"
                    color="primary"
                    inline
                  >
                    <div v-for="rating in 5" :key="`rating${index}-${rating}`">
                      <div
                        class="d-flex flex-column align-center justify-center"
                      >
                        <span> {{ rating }} </span>
                        <v-radio :value="rating" />
                      </div>
                    </div>
                  </v-radio-group>
                </div>
                <div v-else>
                  <v-textarea
                    v-model="item.value"
                    label="answer"
                    class="mt-5"
                    counter="300"
                    variant="outlined"
                    rounded
                    auto-grow
                    rows="1"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- Placeholder or error message if no questions are available -->
          <v-col v-if="activityDetail.length === 0" cols="12">
            <v-alert type="error" dense> No questions are available. </v-alert>
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions class="d-flex justify-center mt-5">
        <v-btn
          class="px-4"
          color="error"
          variant="flat"
          rounded="lg"
          @click="closeDialog"
        >
          CLOSE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
