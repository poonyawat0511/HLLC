<script setup lang="ts">
const header = computed(() => [
  { title: 'Assessment TH', value: 'assessment.assessment.th', sortable: true },
  { title: 'Assessment EN', value: 'assessment.assessment.en', sortable: true },
  { title: 'Value', value: 'value', sortable: true },
])

const props = defineProps({
  posttestData: {
    type: Array as PropType<PosttestModel[]>,
    required: true,
  },
  posttestAssessmentsData: {
    type: Array as PropType<AssessmentModel[]>,
    required: true,
  },
})

const groupBy = ref([
  {
    key: 'author.username',
    order: 'asc',
  },
])

const posttestItems = computed(() => {
  return props.posttestData.flatMap((posttest) =>
    posttest.values.map((value) => ({
      author: posttest.author,
      assessment: value.assessment,
      value: value.value,
    }))
  )
})

const assessmentAverages = computed(() => {
  const assessmentMap: Record<string, Record<string, number>> = {}

  props.posttestData.forEach((posttest) => {
    posttest.values.forEach((value) => {
      const numValue = parseFloat(value.value)
      if (!isNaN(numValue) && value.assessment && posttest.author) {
        const assessmentId = value.assessment.id
        const userId = posttest.author.id
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
  return posttestItems.value.map((item) => ({
    ...item,
    average:
      item.assessment && item.assessment.id
        ? assessmentAverages.value[item.assessment.id] || 0
        : 0,
  }))
})

console.log(assessmentAverages)
</script>

<template>
  <v-container>
    <v-card class="rounded-xl overflow-hidden" outlined elevation="4">
      <v-card-title class="justify-start mt-2">Posttest Summary</v-card-title>
      <v-divider class="mt-2 mb-2" color="black" />
      <v-data-table :headers="header" :items="items" :group-by="groupBy">
        <template #group-header="{ item, columns, toggleGroup, isGroupOpen }">
          <tr class="group-header">
            <td :colspan="columns.length">
              <v-btn
                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                size="small"
                variant="text"
                text="item"
                @click="toggleGroup(item)"
              />
              <span class="ml-2">{{ item.value }}</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
