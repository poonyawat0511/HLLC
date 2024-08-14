<script setup lang="ts">
const { $api } = useApi()
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/contests', title: 'Fresher Contest' },
    { to: '/contests/summary', title: 'Vote Results' },
  ],
})

interface Contest {
  id: string
  team: string
  category: {
    th: string
    en: string
  }
  title: {
    th: string
    en: string
  }
  description: {
    th: string
    en: string
  }
  coverImage: string
  url: string
  members: {
    name: string
    studentId: string
  }[]
  votes: number
}

const contest = ref<Contest[]>([])
const fetchContest = async () => {
  try {
    const response = await $api.get<ApiResponse<Contest[]>>(`/contests`)
    contest.value = response.data.sort((a, b) => b.votes - a.votes)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const getPercentage = (value: number) => {
  const totalVotes = votesCount.value
  return (value / totalVotes) * 100
}

const votesCount = computed(() => {
  return contest.value.reduce((acc, curr) => acc + curr.votes, 0)
})

onMounted(() => {
  fetchContest()
})
</script>

<template>
  <v-container fluid>
    <v-card variant="outlined" class="border" rounded="lg">
      <v-col>
        <v-row class="align-center justify-space-between">
          <v-card-title>Vote Results</v-card-title>
          <v-chip class="mr-2" variant="tonal" color="orange">
            Voters : {{ votesCount }}
          </v-chip>
        </v-row>
      </v-col>
      <v-divider />
      <v-card-text>
        <v-row v-for="item in contest" :key="item.team" class="align-center">
          <v-col xs="4" sm="3" lg="2" class="d-flex flex-row align-start">
            <v-avatar color="primary" size="30" class="mr-2">
              <v-img :src="item.coverImage" />
            </v-avatar>
            <span class="text-truncate">
              {{ item.team }}
            </span>
          </v-col>
          <v-col xs="8" sm="9" lg="10">
            <v-progress-linear
              :model-value="getPercentage(item.votes)"
              background-color="primary lighten-4"
              background-opacity="0.3"
              height="25"
              class="rounded-pill"
              color="primary"
            >
              <template #default>
                <v-responsive
                  width="100%"
                  class="d-flex flex-column align-end pr-3"
                >
                  {{ item.votes }}
                </v-responsive>
              </template>
            </v-progress-linear>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
