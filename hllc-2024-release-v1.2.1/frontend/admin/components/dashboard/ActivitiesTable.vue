<script setup lang="ts">


const props = defineProps({
  activitiesData: {
    type: Array as PropType<Activity[]>,
    required: true,
  },
  loginData: {
    type: Array as PropType<UserLogin[]>,
    required: true,
  },
  checkInData: {
    type: Array as PropType<CheckIn[]>,
    required: true,
  },
  evaluationsData: {
    type: Array as PropType<Evaluation[]>,
    required: true,
  },
    questionsData: {
    type: Array as PropType<Question[]>,
    required: true,
  },
})

const activityCheckinCount = (activity: string) => {
  return props.checkInData.filter(
    (checkIn) => checkIn.activity.name.en === activity
  ).length
}

const evaluationCountForActivity = (activity: string) => {
  const questionIdsForActivity = props.questionsData
    .filter((question) => question.activity.name.en === activity)
    .map((question) => question.id)

  return props.evaluationsData.filter(
    (evaluation) =>
      evaluation.values.some((value) => questionIdsForActivity.includes(value.question))
  ).length
}

const dataWithTotal = computed(() => {
  const activityDataWithCheckin = props.activitiesData.map((activity) => ({
    name: activity.name.en,
    checkin: activityCheckinCount(activity.name.en),
     evaluation: evaluationCountForActivity(activity.name.en),
  }))

  const totalCheckin = activityDataWithCheckin.reduce(
    (sum, activity) => sum + activity.checkin,
    0
  )

  const totalEvaluation = activityDataWithCheckin.reduce(
    (sum, activity) => sum + activity.evaluation,
    0
  )

  return [
    ...activityDataWithCheckin,
    {
      name: 'Total',
      checkin: totalCheckin,
      evaluation: totalEvaluation,
    },
  ]
})

const header = computed(() => [
  { title: 'Activity', value: 'name' },
  { title: 'CheckIn', value: 'checkin' },
  { title: 'Evaluation', value: 'evaluation' },
])
</script>

<template>
  <v-container>
    <v-card class="rounded-xl overflow-hidden" outlined elevation="4">
      <v-card-title class="justify-start mt-2"
        >Activities Overview</v-card-title
      >
      <v-divider class="mt-2 mb-2" color="black" />
      <v-data-table
        :headers="header"
        :items="dataWithTotal"
        hide-default-footer
      ></v-data-table>
    </v-card>
  </v-container>
</template>
