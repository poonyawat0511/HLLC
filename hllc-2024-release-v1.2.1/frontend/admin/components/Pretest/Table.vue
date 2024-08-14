<script setup lang="ts">
// Reactive variable for search input
const props = defineProps<{
  headers: { title: string; align: string; key: string }[]
  items: Item[]
  majors: {
    name: { th: string; en: string }
    schoolName: string
  }[]
  schools: {
    name: { th: string; en: string }
  }[]
}>()

const Pretest = ref('')
const Posttest = ref('')
const School = ref('All')
const Major = ref('')
const searchQuery = ref('')

interface Item {
  username: string
  fullName: string
  schoolName: string
  majorName: string
  pretest: string
  posttest: string
}

const items1 = ref(['All', 'Done', 'Not Finished']) // Replace with actual items
const items2 = ref(['All', 'Done', 'Not Finished']) // Replace with actual items

const schoolItems = computed(() => [
  'All',
  ...props.schools.map((school) => school.name.en),
])

const majorItems = computed(() => {
  if (School.value === 'All') {
    return ['All', ...props.majors.map((major) => major.name.en)]
  } else {
    const selectedSchool = props.schools.find(
      (school) => school.name.en === School.value
    )
    if (selectedSchool) {
      return [
        'All',
        ...props.majors
          .filter((major) => major.schoolName === selectedSchool.name.en)
          .map((major) => major.name.en),
      ]
    } else {
      return ['All']
    }
  }
})

watch(School, () => {
  Major.value = ''
})

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return props.items.filter((item: Item) => {
    const matchesQuery =
      item.username.toLowerCase().includes(query) ||
      item.fullName.toLowerCase().includes(query) ||
      item.schoolName.toLowerCase().includes(query) ||
      item.majorName.toLowerCase().includes(query)
    const matchesSchool =
      School.value === 'All' || item.schoolName === School.value
    const matchesMajor =
      Major.value === 'All' || !Major.value || item.majorName === Major.value
    return matchesQuery && matchesSchool && matchesMajor
  })
})
</script>

<template>
  <v-container>
    <v-card
      variant="outlined"
      class="ml-n4 mb-3 mt-n1 rounded-lg border border-grey elevation-0"
    >
      <v-col cols="12" class="d-flex align-center">
        <span class="text-h5 font-weight-medium ml-1">User Assessment</span>
        <v-spacer />
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            density="compact"
            label="Search"
            placeholder="Search data"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details="auto"
            rounded
          />
        </v-col>
        <v-btn color="primary" rounded variant="outlined">Export</v-btn>
      </v-col>
      <v-row class="px-3 py-n2">
        <v-col cols="12" md="3">
          <v-autocomplete
            v-model="Pretest"
            :items="items1"
            label="Pretest"
            hide-details="auto"
            density="compact"
            variant="outlined"
            rounded
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            v-model="Posttest"
            :items="items2"
            label="Posttest"
            hide-details="auto"
            density="compact"
            variant="outlined"
            rounded
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            v-model="School"
            :items="schoolItems"
            label="School"
            hide-details="auto"
            density="compact"
            variant="outlined"
            rounded
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            v-model="Major"
            :items="majorItems"
            label="Major"
            hide-details="auto"
            density="compact"
            variant="outlined"
            rounded
          />
        </v-col>
      </v-row>
      <v-divider :thickness="2" class="mt-5" />
      <v-data-table
        :headers="props.headers"
        :items="filteredItems"
        class="elevation-0"
      />
    </v-card>
  </v-container>
</template>
