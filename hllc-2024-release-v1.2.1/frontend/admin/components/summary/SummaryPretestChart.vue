<script setup lang="ts">
const header = computed(() => [
  { title: 'Assessment TH', value: 'assessment.assessment.th', sortable: true },
  { title: 'Assessment EN', value: 'assessment.assessment.en', sortable: true },
  { title: 'Average', value: 'average', sortable: true },
])

const props = defineProps({
  pretestsData: {
    type: Array as PropType<PretestModel[]>,
    require: true,
  },
  assessmentData: {
    type: Array as PropType<AssessmentModel[]>,
    require: true,
  },
  averageData: {
    type: Array as PropType<AverageModel[]>,
    require: true,
  },
})

const pretestItems = computed(() => {
  return props.pretestsData.flatMap((pretest) =>
    pretest.values
      .filter((value) => !isNaN(parseFloat(value.value)))
      .map((value) => ({
        author: pretest.author,
        assessment: value.assessment,
        value: parseFloat(value.value),
      }))
  )
})

const assessmentAverages = computed(() => {
  const assessmentMap: Record<string, Record<string, number>> = {}

  pretestItems.value.forEach((item) => {
    const numValue = item.value
    const assessmentId = item.assessment.id
    const userId = item.author.id
    if (!assessmentMap[assessmentId]) {
      assessmentMap[assessmentId] = {}
    }
    assessmentMap[assessmentId][userId] = numValue
  })

  const averages: Record<string, number> = {}
  Object.keys(assessmentMap).forEach((assessmentId) => {
    const userValues = Object.values(assessmentMap[assessmentId])
    const total = userValues.reduce((sum, val) => sum + val, 0)
    averages[assessmentId] = total / userValues.length
  })

  return averages
})

const items = computed(() => {
  const uniqueAssessments: Record<string, any> = {}

  pretestItems.value.forEach((item) => {
    const assessmentId = item.assessment.id
    if (!uniqueAssessments[assessmentId]) {
      uniqueAssessments[assessmentId] = {
        ...item,
        average:
          assessmentAverages.value[assessmentId] || 'Unable to calculate',
      }
    }
  })

  return Object.values(uniqueAssessments).filter(
    (item) => typeof item.average === 'number'
  )
})

console.log(assessmentAverages.value)
</script>

<template>
  <v-container>
    <v-card class="rounded-xl overflow-hidden" outlined elevation="4">
      <v-card-title class="justify-start mt-2"
        >Average Assessment Pretest Summary display</v-card-title
      >
      <v-divider class="mt-2 mb-2" color="black" />
      
      <v-row>
        <v-col
          v-for="item in items"
          :key="item.assessment.id"
          cols="12"
          md="6"
          lg="4"
        >
        
          <v-sheet
            class="d-flex align-center px-5 py-0 mx-6"
            color="#181a1b"
            rounded="lg"
          >
            <v-progress-linear
              v-if="typeof item.average === 'number'"
              :model-value="(item.average / 5) * 100"
              color="grey"
              height="8"
              rounded
              class="ma-2"
            ></v-progress-linear>
            <div class="ms-4 text-h6">
              {{ item.average.toFixed(2) }}
            </div>
          </v-sheet>
          <v-col>
          <div class="ms-4 text">{{ item.assessment.assessment.en }}</div></v-col>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
