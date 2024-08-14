<script setup lang="ts">
import type { VDataTable } from 'vuetify/components'
import * as XLSX from 'xlsx'
type DataTable = InstanceType<typeof VDataTable>['$props']
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/assessments', title: 'Assessments' },
    {
      to: '/assessments/activiities/answer-question',
      title: 'Answer-Questions',
    },
  ],
})
const { fetchAnswer, AnswerQuestion } = useAnswerQuestion()
onMounted(async () => {
  await fetchAnswer()
})
const headers = ref<DataTable['headers']>([
  {
    title: 'Question(TH)',
    align: 'start',
    key: 'question.title.th',
    sortable: false,
  },
  {
    title: 'Question(EN)',
    align: 'start',
    key: 'question.title.en',
    sortable: false,
  },
  {
    title: 'StudentId',
    align: 'start',
    key: 'user.username',
  },
  {
    title: 'Value',
    align: 'start',
    key: 'value',
    sortable: false,
  },
])
const groupBy = ref([
  {
    key: 'question.title.en',
    order: 'asc',
  },
])

const exportToXlsx = () => {
  const groupedData = AnswerQuestion.value.reduce(
    (acc: Record<string, unknown[]>, answer) => {
      const question = answer.question.title.en
      if (!acc[question]) {
        acc[question] = []
      }
      acc[question].push({
        'Question(EN)': answer.question.title.en,
        'Question(TH)': answer.question.title.th,
        'Value(Answer)': answer.value,
      })
      return acc
    },
    {}
  )

  const workbook = XLSX.utils.book_new()

  Object.keys(groupedData).forEach((question) => {
    const sheetName =
      question.length > 31 ? question.substring(0, 31) : question
    const worksheet = XLSX.utils.json_to_sheet(groupedData[question])
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  })

  XLSX.writeFile(workbook, 'answer-question.xlsx')
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="9" sm="8" class="d-flex justify-space-between">
        <h1 class="ml-1">Answer-Question</h1>
      </v-col>

      <v-col cols="12" md="3" sm="4" class="d-flex justify-end">
        <v-btn
          variant="elevated"
          prepend-icon="mdi-download"
          color="black"
          rounded
          block
          @click="exportToXlsx"
          >Export File</v-btn
        >
      </v-col>
    </v-row>
    <v-card class="pa-4 mt-2" border rounded="lg" elevation="0">
      <v-data-table
        :headers="headers"
        :items="AnswerQuestion"
        :group-by="groupBy"
      >
        <template #group-header="{ item, columns, toggleGroup, isGroupOpen }">
          <tr class="group-header">
            <td :colspan="columns.length">
              <v-btn
                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                size="small"
                variant="text"
                text="item"
                hide-details
                @click="toggleGroup(item)"
              />
              <span class="ml-2">{{ item.value }}</span>
            </td>
          </tr>
        </template>
        <template #[`item.question`]="{ item }">
          <v-responsive>
            <p>{{ item.question }}</p>
          </v-responsive>
        </template>
        <template #[`item.user`]="{ item }">
          <v-responsive>
            <p>{{ item.user }}</p>
          </v-responsive>
        </template>
        <template #[`item.value`]="{ item }">
          <v-responsive>
            <p>{{ item.value }}</p>
          </v-responsive>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
