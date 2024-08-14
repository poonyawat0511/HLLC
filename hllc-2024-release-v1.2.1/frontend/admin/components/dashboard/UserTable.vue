<script setup lang="ts">
import { utils, writeFile, type WorkBook } from 'xlsx';


const props = defineProps({
  progressData: {
    type: Array as PropType<Progress[]>,
    required: true,
  },
})

const search = ref('')

const headers = computed(() => [
  { title: 'Student ID', align: 'start', sortable: true, key: 'student_id', width: '10' },
  { title: 'Name', align: 'start', sortable: true, key: 'name', width: '10' },
  { title: 'Pre test', align: 'center', sortable: true, key: 'pretest' },
  { title: 'Post test', align: 'center', sortable: true, key: 'posttest' },
  { title: 'Meet the President', align: 'center', sortable: true, key: 'meet_the_president' },
  { title: 'Follow The Royal Determination', align: 'center', sortable: true, key: 'follow_the_royal_determination' },
  { title: 'Origami Lamduan Flower', align: 'center', sortable: true, key: 'origami_lamduan_flower' },
  { title: 'Lesson For Teenagers', align: 'center', sortable: true, key: 'lesson_for_teenagers' },
  { title: 'Meet the Alumni', align: 'center', sortable: true, key: 'meet_the_alumni' },
  { title: 'The Inspiration', align: 'center', sortable: true, key: 'the_inspiration' },
  { title: 'Graceful Intelligence', align: 'center', sortable: true, key: 'graceful_intelligence' },
  { title: 'Grow up, Glow up!', align: 'center', sortable: true, key: 'grow_up_glow_up' },
  { title: 'MFU Fresher Night', align: 'center', sortable: true, key: 'mfu_fresher_night' },
  { title: 'MFU Freshers Contest', align: 'center', sortable: true, key: 'mfu_freshers_contest' },
  { title: 'Meet the Dean', align: 'center', sortable: true, key: 'meet_the_dean' },
  { title: 'Khantoke', align: 'center', sortable: true, key: 'khantoke' },
  { title: 'Progress', align: 'center', sortable: true, key: 'progress' },
])

const filteredItemsProgress = computed(() => {
  return props.progressData.filter((item) => {
    return Object.values(item).some((val) => 
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
  })
})

const exportToExcel = () => {
  const ws = utils.json_to_sheet(filteredItemsProgress.value)
  const wb: WorkBook = utils.book_new()
  utils.book_append_sheet(wb, ws, 'ProgressData')
  writeFile(wb, 'ProgressData.xlsx')
}
</script>

<template>
  <v-container fluid>
    <v-card class="rounded-xl overflow-hidden" outlined elevation="4">
      <v-row>
        <v-col col="12">
          <v-card-title class="justify-start mt-2 pa-4">Progress</v-card-title>
        </v-col>
        <v-row dense class="d-flex flex-row align-center">
          <v-col cols="9">
            <v-text-field
              v-model="search"
              class="small-text-field mt-2 align-center"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              variant="solo"
              hide-details
              rounded
              density="compact"
              single-line
            />
          </v-col>
          <v-col cols="3">
            <v-btn variant="flat" color="teal" class="rounded-xl mt-2" @click="exportToExcel">
              <v-icon icon="mdi-upload" start></v-icon>
              Export
            </v-btn>
          </v-col>
        </v-row>
      </v-row>
      <v-divider class="mt-2 mb-2" color="black" />
      <v-data-table
        :headers="headers"
        :items="filteredItemsProgress"
        hide-default-footer
      ></v-data-table>
    </v-card>
  </v-container>
</template>
