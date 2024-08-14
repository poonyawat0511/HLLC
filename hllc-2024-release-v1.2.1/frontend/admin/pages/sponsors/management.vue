<script setup lang="ts">
import type { VDataTable } from 'vuetify/components'
type DataTable = InstanceType<typeof VDataTable>['$props']
const { $api } = useNuxtApp()
const createEditDialog = ref(false)
const isEdit = ref(false)
const deleteDialog = ref(false)
const searchQuery = ref('')
const selectedSponsor = ref<SponsorModel | null>(null)
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/sponsors', title: 'Sponsors' },
    { to: '/sponsors/management', title: 'Sponsors Management' },
  ],
})
const headers = ref<DataTable['headers']>([
  {
    title: 'No',
    align: 'start',
    key: 'no',
    width: '50px',
  },
  {
    title: 'ชื่อสปอนเซอร์(ภาษาไทย)',
    align: 'center',
    key: 'name.th',
    width: '1000px',
  },
  {
    title: 'Name Sponser(EN)',
    align: 'center',
    key: 'name.en',
    width: '1000px',
  },
  {
    title: 'Type',
    align: 'center',
    key: 'type',
    width: '1000px',
  },
  {
    title: 'Show',
    align: 'center',
    key: 'show',
    width: '1000px',
  },
  {
    title: 'Logo Sponsor',
    align: 'center',
    key: 'logo',
    width: '1000px',
  },
  {
    title: 'Actions',
    align: 'center',
    sortable: false,
    key: 'actions',
    width: '300px',
  },
])

/**
 * * fetch data to data table
 */
interface SponsorModel {
  id: string
  name: {
    th: string
    en: string
  }
  logo: string
  type: string
  show: boolean
  no: number
}
const openCreateDialog = () => {
  isEdit.value = false
  selectedSponsor.value = null
  createEditDialog.value = true
}
const openEditDialog = (sponsor: SponsorModel) => {
  isEdit.value = true
  selectedSponsor.value = sponsor
  createEditDialog.value = true
}
const openDeleteDialog = (sponsor: SponsorModel) => {
  selectedSponsor.value = sponsor
  deleteDialog.value = true
}
const items = ref<SponsorModel[]>([])

onMounted(() => {
  fetchSponsor()
})

const fetchSponsor = async () => {
  try {
    const response = await $api.get<{ data: SponsorModel[] }>('/sponsors')
    items.value = response.data
  } catch (error) {
    console.error('Error fetching questions:', error)
  }
}
const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  return items.value.filter(
    (sponsor) =>
      sponsor.name.th.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      sponsor.name.en.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
/**
 * * set funtion style and hight
 */
function wrapHeight(lines: number = 1): string {
  return `${lines * 1.5}rem`
}

function wrapStyle(lines: number = 1): Record<string, string | number> {
  return {
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    'white-space': 'normal',
    '-webkit-line-clamp': lines,
  }
}
</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="7" sm="5"><h1 class="ml-1">Sponsors</h1></v-col>
      <v-col cols="12" md="3" sm="4" >
        <v-text-field
          v-model="searchQuery"
          hide-details
          density="compact"
          variant="outlined"
          placeholder="Search Sponsor"
          prepend-inner-icon="mdi-magnify"
          rounded
        />
      </v-col>
      <v-col cols="12" md="2" sm="3" class="d-flex justify-start">
        <v-btn
          prepend-icon="mdi-plus"
          variant="elevated"
          color="black"
          block
          rounded
          @click="openCreateDialog"
        >
          Sponsor
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="mt-4" rounded="lg" elevation="0" border>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :sort-by="[{ key: 'no' }]"
      >
        <template #[`item.name(TH)`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(4)">
            <p :style="wrapStyle(5)">{{ item.name.th }}</p>
          </v-responsive>
        </template>
        <template #[`item.name(EN)`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(4)">
            <p :style="wrapStyle(5)">{{ item.name.en }}</p>
          </v-responsive>
        </template>
        <template #[`item.type`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(4)">
            <v-chip
              :color="item.type === 'NORMAL' ? 'success' : 'warning'"
              variant="flat"
            >
              <p :style="wrapStyle(5)">{{ item.type }}</p>
            </v-chip>
          </v-responsive>
        </template>
        <template #[`item.show`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(4)">
            <v-chip
              :color="item.show === true ? 'success' : 'error'"
              variant="flat"
            >
              <p :style="wrapStyle(5)">
                {{ item.show === true ? 'SHOW' : 'CLOSE' }}
              </p>
            </v-chip>
          </v-responsive>
        </template>
        <template #[`item.logo`]="{ item }">
          <v-card
            color="black"
            max-width="6rem"
            max-height="6rem"
            class="mx-auto my-3"
            rounded="lg"
          >
            <v-img
              :src="item.logo"
              class="mx-auto"
              max-width="6rem"
              max-height="6rem"
            />
          </v-card>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            icon
            color="primary"
            class="mx-2 my-2"
            @click="openEditDialog(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            class="my-2"
            @click="openDeleteDialog(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <sponsors-Create
      :dialog="createEditDialog"
      :is-edit="isEdit"
      :sponsor-data="selectedSponsor"
      :fetch-sponsor="fetchSponsor"
      @update:dialog="createEditDialog = $event"
    />
    <sponsors-Delete
      :dialog="deleteDialog"
      :sponsor-id="selectedSponsor?.id"
      @update:dialog="deleteDialog = $event"
      @delete="fetchSponsor"
    />
  </v-container>
</template>
<!-- <style scoped>
.lowercase-text {
  text-transform: lowercase;
}
</style> -->
