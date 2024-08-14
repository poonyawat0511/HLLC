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
    pretest.values.map((value) => ({
      author: pretest.author,
      assessment: value.assessment,
      value: value.value,
    }))
  )
})

const assessmentAverages = computed(() => {
  const assessmentMap: Record<string, Record<string, number>> = {}

  props.pretestsData.forEach((pretest) => {
    pretest.values.forEach((value) => {
      const numValue = parseFloat(value.value)
      if (!isNaN(numValue)) {
        const assessmentId = value.assessment.id
        const userId = pretest.author.id
        if (!assessmentMap[assessmentId]) {
          assessmentMap[assessmentId] = {}
        }
        assessmentMap[assessmentId][userId] = numValue
      }
    })
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

  return Object.values(uniqueAssessments)
})

console.log(assessmentAverages)
</script>

<template>
  <v-container>
    <v-card class="rounded-xl overflow-hidden" outlined elevation="4">
      <v-card-title class="justify-start mt-2"
        >Average Assessment Prestest Summary</v-card-title
      >
      <v-divider class="mt-2 mb-2" color="black" />
      <v-data-table :headers="header" :items="items"> </v-data-table>
    </v-card>
  </v-container>
</template>
