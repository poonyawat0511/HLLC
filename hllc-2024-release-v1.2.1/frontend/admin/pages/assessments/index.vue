<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/assessments', title: 'Assessments' },
  ],
})

const menus = [
  {
    title: 'Pretest & Postest Questions',
    to: '/assessments/systems',
    icon: 'mdi-message-question',
  },
  {
    title: 'Activity Questions',
    to: '/assessments/activities/questions',
    icon: 'mdi-message-question',
  },
  {
    title: 'MC Question',
    to: '/assessments/mc-question/mcquestions',
    icon: 'mdi-microphone-question',
  },
  {
    title: 'Answer-Question',
    to: '/assessments/mc-question/answer-question',
    icon: 'mdi-forum',
  },
  {
    title: 'Pretest Result',
    to: '/assessments/pretest',
    icon: 'mdi-file-chart',
  },
  {
    title: 'Posttest Result',
    to: '/assessments/posttest',
    icon: 'mdi-file-chart',
  },
  {
    title: 'Activity Dashboard',
    to: '/assessments/activities/dashboard',
    icon: 'mdi-chart-bar-stacked',
  },
]
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <h2 class="text--text">Assessments</h2>
      </v-col>
      <v-col
        v-for="menu in menus"
        :key="menu.to"
        cols="6"
        sm="4"
        md="3"
        lg="2"
        xl="2"
      >
        <menu-item
          :title="menu.title"
          :icon="menu.icon"
          :to="menu.to"
          rounded="lg"
          variant="outlined"
          class="border"
          height="100%"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
