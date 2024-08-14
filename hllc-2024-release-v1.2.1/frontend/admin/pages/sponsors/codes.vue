<script setup lang="ts">
import type { VDataTable } from 'vuetify/components'
import * as XLSX from 'xlsx'
type DataTable = InstanceType<typeof VDataTable>['$props']
const dialog = ref(false)
const EditDialog = ref(false)
const search = ref('')
const deleteDialog = ref(false)
const snackbar = ref(false)
const voucherToDelete = ref<string | null>(null)

definePageMeta({
  auth: false,
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/sponsors', title: 'All Sponsor' },
    { to: '/sponsors/voucher-codes', title: 'All Voucher Codes' },
  ],
})
// headers table
const headers = ref<DataTable['headers']>([
  {
    title: 'StudentId',
    align: 'center',
    key: 'user.username',
  },
  {
    title: 'Name Sponser',
    align: 'center',
    key: 'voucher.sponsor.name',
  },
  {
    title: 'Discount Voucher',
    align: 'center',
    key: 'voucher.discount',
  },
  {
    title: 'Code',
    align: 'center',
    key: 'code',
  },
  {
    title: 'Type',
    align: 'center',
    key: 'type',
  },
  {
    title: 'Actions',
    align: 'center',
    sortable: false,
    key: 'actions',
  },
])
interface CreateSnackbarNotify {
  title: string
  type: string
}
const snackbarNotify = reactive<CreateSnackbarNotify>({
  title: '',
  type: '',
})
const onSnackbar = (title: string, type: string) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  snackbar.value = true
}
interface ICreateVoucher {
  id: string
  acronym: string
  count: string
  voucher: IVoucher
}
const {
  fetchVoucherCode,
  voucherCodes,
  fetchVoucher,
  vouchersData,
  createVoucherCode,
  updateVoucher,
  deleteVoucher,
} = useVoucher()

// onMounted(async () => {
//   await fetchVoucherCode()
//   await fetchVoucher()
// })
const loading = ref(true)
onMounted(async () => {
  try {
    loading.value = true
    await fetchVoucher()
    await fetchVoucherCode()
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
})

const handleCreated = (formData: ICreateVoucher | IEditVoucher) => {
  if (EditDialog.value) {
    const editData: IEditVoucher = {
      id: (formData as IEditVoucher).id,
      user: (formData as IEditVoucher).user,
      type: (formData as IEditVoucher).type,
      acronym: '',
      count: '',
      voucher: '',
    }
    onSnackbar('Update voucher-code successfully !!', 'success')
    updateVoucher(currentVoucher.value!.id, editData) // Example of updating voucher
  } else {
    const createData: ICreateVoucher = {
      id: (formData as ICreateVoucher).id,
      acronym: (formData as ICreateVoucher).acronym,
      count: parseInt((formData as ICreateVoucher).count, 10),
      voucher: (formData as ICreateVoucher).voucher,
    }
    onSnackbar('Create voucher-code successfully !!', 'success')
    createVoucherCode(createData) // Example of creating new voucher code
  }
  // dialog.value = false
}
const handleDelete = async (id: string) => {
  try {
    await deleteVoucher(id)
    // Refresh the data
    await fetchVoucherCode()
    onSnackbar('Delete voucher-code successfully !!', 'success')
    deleteDialog.value = false
  } catch (error) {
    console.error('Error deleting voucher:', error)
  }
}
const save = (formData: ICreateVoucher | IEditVoucher) => {
  handleCreated(formData)
}

const currentVoucher = ref<ICreateVoucher | VoucherCode | null>(null)
// Open create,edit,delete
const openEditDialog = (item: ICreateVoucher | VoucherCode) => {
  EditDialog.value = true
  dialog.value = true
  currentVoucher.value = item
}
const openCreateDialog = () => {
  EditDialog.value = false
  dialog.value = true
  currentVoucher.value = null
}
const openDeleteDialog = (voucherId: string) => {
  voucherToDelete.value = voucherId
  deleteDialog.value = true
}
// Wrap style
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
function wrapHeight(lines: number = 1): string {
  return `${lines * 1.5}rem`
}
// Fillter table
const computedVoucherCodes = computed(() => {
  return voucherCodes.value.map((voucher) => ({
    ...voucher,
    searchString: [
      voucher.user?.username,
      voucher.voucher.sponsor.name?.th,
      voucher.voucher.sponsor.name?.en,
      voucher.voucher.discount.th,
      voucher.voucher.discount.en,
      voucher.type,
      voucher.code,
    ]
      .join(' ')
      .toLowerCase(),
  }))
})

const filteredVoucherCodes = computed(() => {
  if (!search.value) return computedVoucherCodes.value
  return computedVoucherCodes.value.filter((voucher) =>
    voucher.searchString.includes(search.value.toLowerCase())
  )
})
// GroupBy sponsors in table
const groupBy = ref([
  {
    key: 'voucher.sponsor.name.en',
    order: 'asc',
  },
])
// Export file xlsx.

const exportToXlsx = () => {
  // Group by sponsor
  const groupedData = filteredVoucherCodes.value.reduce((acc, voucher) => {
    const sponsorName = voucher.voucher.sponsor.name?.en || 'Unknown Sponsor';
    
    if (!acc[sponsorName]) {
      acc[sponsorName] = [];
    }
    
    acc[sponsorName].push({
      'Sponsor Name': voucher.voucher.sponsor.name?.en,
      Discount: voucher.voucher.discount.en,
      Code: voucher.code,
    });
    
    return acc;
  }, {} as Record<string, unknown[]>);

  const workbook = XLSX.utils.book_new();

  Object.keys(groupedData).forEach(sponsorName => {
    const sanitizedSheetName = sponsorName.length > 31 ? sponsorName.substring(0, 31) : sponsorName;
    
    const worksheet = XLSX.utils.json_to_sheet(groupedData[sponsorName]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sanitizedSheetName);
  });

  XLSX.writeFile(workbook, 'voucher-codes.xlsx');
};


const userPerpage = ref([
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 50, title: '50' },
  { value: 100, title: '100' },
  { value: 500, title: '500' },
  { value: 1000, title: '1000' },
  { value: -1, title: 'All' },
])
</script>
<template>
  <v-container fluid>
    <h1>Voucher Codes</h1>
    <v-card class="pa-4" border rounded="lg" elevation="0">
      <v-data-table
        :headers="headers"
        :items="filteredVoucherCodes"
        :group-by="groupBy"
        :items-per-page-options="userPerpage"
        :loading="loading"
        loading-text="Loading... Please wait"
      >
        <template #top>
          <v-row>
            <v-col cols="12" md="3" sm="3">
              <v-btn
                class="text-none px-6 font-weight-bold rounded-pill"
                prepend-icon="mdi-plus"
                variant="elevated"
                color="black"
                block
                @click="openCreateDialog"
              >
                Add Code
              </v-btn>
            </v-col>
            <v-col cols="12" md="3" sm="3">
              <v-btn
                class="text-none px-6 font-weight-bold rounded-pill"
                prepend-icon="mdi-upload"
                variant="elevated"
                color="black"
                block
                @click="exportToXlsx"
              >
                Export
              </v-btn>
            </v-col>

            <v-col class="pa-0" cols="12" md="3" sm="1"   />

            <v-col cols="12" md="3" sm="5">
              <v-text-field
                v-model="search"
                hide-details
                density="compact"
                variant="outlined"
                placeholder="Search Sponsor"
                prepend-inner-icon="mdi-magnify"
                rounded
            /></v-col>
          </v-row>
        </template>
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
        <template #[`item.user.username`]="{ item }">
          {{ item.user?.username || 'null' }}
        </template>
        <template #[`item.voucher.sponsor.name`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(3)">
            <p :style="wrapStyle(2)">TH : {{ item.voucher.sponsor.name.th }}</p>
            <p :style="wrapStyle(2)">EN :{{ item.voucher.sponsor.name.en }}</p>
          </v-responsive>
        </template>
        <template #[`item.voucher.discount`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(3)">
            <p :style="wrapStyle(2)">TH : {{ item.voucher.discount.th }}</p>
            <p :style="wrapStyle(2)">EN :{{ item.voucher.discount.en }}</p>
          </v-responsive>
        </template>
        <template #[`item.type`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(3)">
            <v-chip
              v-if="item.type === 'UNUSED'"
              variant="outlined"
              color="success"
              >UNUSED</v-chip
            >
            <v-chip v-else variant="outlined" color="error">USED</v-chip>
          </v-responsive>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            icon
            color="primary"
            variant="flat"
            class="rounded-xl mx-2 my-2"
            @click="openEditDialog(item)"
            ><v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            variant="flat"
            class="rounded-xl my-2"
            @click="openDeleteDialog(item.id)"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </template>
      </v-data-table>
      <VoucherCodeCreate
        v-model="dialog"
        :voucher-data="vouchersData"
        :EditDialog="EditDialog"
        :current-voucher="currentVoucher"
        @save="save"
      />
      <VoucherCodeDelete
        v-model="deleteDialog"
        :voucher-item="{ id: voucherToDelete }"
        @delete="handleDelete"
      />
      <SnackbarNotify
        v-model="snackbar"
        :title="snackbarNotify.title"
        :type="snackbarNotify.type"
      />
    </v-card>
  </v-container>
</template>

<style scoped></style>
