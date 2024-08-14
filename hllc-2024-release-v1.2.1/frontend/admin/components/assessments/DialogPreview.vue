<script setup lang="ts">
const dialogPreview = defineModel<boolean>({ default: false })

interface Section {
  id: string
  title: {
    en: string
  }
  details: {
    en: string
  }
}

interface Item {
  section: {
    _id: string
  }
  assessment: {
    en: string
  }
  required: boolean
  type: string
  value?: number
}

const props = defineProps<{
  filteredItems: Item[]
  sections: Section[]
}>()
</script>

<template>
  <v-dialog v-model="dialogPreview" persistent max-width="800px">
    <v-card class="rounded-xl pa-4" elevation="5">
      <v-card-title>
        <span class="text-dark font-weight-medium">Preview Assessments</span>
        <v-divider class="mt-2" />
      </v-card-title>
      <v-card
        class="pa-4 mx-auto"
        max-width="600px"
        elevation="0"
        style="overflow-y: auto"
      >
        <v-card class="rounded-lg">
          <v-img
            src="~/assets/images/background.jpg"
            cover
            :aspect-ratio="3 / 1"
          />
        </v-card>

        <div
          v-for="(section, index) in props.sections"
          :key="`section-${index}`"
        >
          <div
            v-if="
              props.filteredItems.some(
                (item) => item.section.id === section.id
              )
            "
          >
            <v-card class="rounded-lg my-3 overflow-hidden">
              <v-card color="teal" elevation="0" max-height="10px">
                <v-card-title>..</v-card-title>
              </v-card>
              <v-card-text>
                <span class="text-h6 font-weight-bold">
                  {{ section.title.en }}
                </span>
                <div class="text-medium-emphasis font-weight-medium mt-2">
                  {{ section.details.en }}
                </div>
              </v-card-text>
            </v-card>

            <div
              v-for="(item, itemIndex) in props.filteredItems"
              :key="`item-${itemIndex}`"
            >
              <v-card
                v-if="section.id === item.section.id"
                class="rounded-lg pa-2 mb-4 border"
                elevation="0"
              >
                <v-card-text>
                  <span
                    class="text-body-3 font-weight-bold text-medium-emphasis"
                  >
                    {{ itemIndex + 1 }}. {{ item.assessment.en }}
                  </span>
                  <span v-if="item.required" class="text-red font-weight-bold"
                    >*</span
                  >
                  <!-- ratings -->
                  <div v-if="item.type == 'ratings'" class="mt-5">
                    <v-radio-group
                      v-model="item.value"
                      class="d-flex justify-center"
                      color="primary"
                      inline
                    >
                      <div
                        v-for="rating in 5"
                        :key="`rating${itemIndex}-${rating}`"
                      >
                        <div
                          class="d-flex flex-column align-center justify-center"
                        >
                          <span>{{ rating }}</span>
                          <v-radio :value="rating" />
                        </div>
                      </div>
                    </v-radio-group>
                  </div>
                  <!-- text -->
                  <div v-else>
                    <v-textarea
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
            </div>
          </div>
        </div>
      </v-card>

      <v-card-actions class="d-flex justify-center py-0 mt-3">
        <v-btn
          color="error"
          rounded="lg"
          variant="flat"
          @click="dialogPreview = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
