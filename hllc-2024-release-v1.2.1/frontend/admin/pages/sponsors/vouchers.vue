<script setup lang="ts">
definePageMeta({
  breadcrumbs: [
    { to: '/', title: 'Home' },
    { to: '/sponsors', title: 'Sponsors' },
    { to: '/sponsors/vouchers', title: 'Vouchers Management' },
  ],
})
const { $api } = useNuxtApp()
const snackbar = ref(false)
const Deletedialog = ref(false)

const{
 vouchersData,
 fetchVoucher
} = useVoucher()

const headers = ref([
  {
    title: 'searchString',
    align: ' d-none',
    key: 'searchString',
    width: '100px',
  },
  {
    title: 'Sponsor',
    align: 'start',
    key: 'sponsor.name.en',
    width: '100px',
  },
  {
    title: 'Discount',
    align: 'center',
    key: 'discount',
    width: '300px',
  },
  {
    title: 'Condition',
    align: 'center',
    key: 'condition',
    width: '300px',
  },
  {
    title: 'Expired Date',
    align: 'center',
    key: 'exp',
    width: '200px',
  },
  {
    title: 'Acronym',
    align: 'center',
    key: 'acronym',
    width: '200px',
  },
  {
    title: 'Type',
    align: 'center',
    key: 'type',
    width: '200px',
  },
  {
    title: 'Voucher Image Main',
    align: 'center',
    key: 'voucherImages.main',
    width: '200px',
  },
  {
    title: 'Voucher Image Front',
    align: 'center',
    key: 'voucherImages.front',
    width: '200px',
  },
  {
    title: 'Voucher Image Back',
    align: 'center',
    key: 'voucherImages.back',
    width: '200px',
  },
  {
    title: 'Actions',
    align: 'center',
    sortable: false,
    key: 'actions',
    width: '200px',
  },
])

const dialog = ref(false)
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
onMounted(async () => {
  await fetchVoucher()
  await fetchSponsors()
})
const sponsors = ref<ISponsor[]>([])
const fetchSponsors = async () => {
  try {
    const response = await $api.get<ApiResponse<ISponsor[]>>('/sponsors')
    sponsors.value = response.data
  } catch (error) {
    console.error('Error fetching sponsors:', error)
  }
}
// CreateVoucher
const CreateVoucher = async (voucher: VoucherModel) => {
  let url = 'vouchers/'
  let method = $api.post
  let snackbarMessage = 'Voucher created successfully'
  if (selectVoucherId.value !== '') {
    url += selectVoucherId.value
    method = $api.put
    snackbarMessage = 'Voucher updated successfully'
  }
  const formData = new FormData()
  formData.append('discount[th]', voucher.discount.th.toString())
  formData.append('discount[en]', voucher.discount.en.toString())
  voucher.condition.forEach((condition, index) => {
    formData.append(`condition[${index}][th]`, condition.th.toString())
    formData.append(`condition[${index}][en]`, condition.en.toString())
  })
  if (voucher.voucherImages.main instanceof File) {
    formData.append('voucherImages[main]', voucher.voucherImages.main)
  }
  if (voucher.voucherImages.front instanceof File) {
    formData.append('voucherImages[front]', voucher.voucherImages.front)
  }
  if (voucher.voucherImages.back instanceof File) {
    formData.append('voucherImages[back]', voucher.voucherImages.back)
  }
  if (typeof voucher.sponsor == 'object' && voucher.sponsor.id !== undefined) {
    formData.append('sponsor', voucher.sponsor.id.toString())
  } else {
    formData.append('sponsor', voucher.sponsor.toString())
  }

  formData.append('exp', toDate(voucher.exp).toISOString())
  formData.append('acronym', voucher.acronym.toString())
  formData.append('type', voucher.type.toString())

  try {
    await method<ApiResponse<VoucherModel>>(url, {
      body: formData,
    })
    dialog.value = false
    await fetchVoucher()
    onSnackbar(snackbarMessage, 'success')
  } catch (error) {
    console.error('Error posting voucher:', error)
    // Handle error scenario
  }
}

const deleteVoucher = async (id: string) => {
  try {
    await $api.delete(`/vouchers/${id}`)
    await fetchVoucher()
    onSnackbar('Delete voucher successfully', 'success')
    Deletedialog.value = false
  } catch (error) {
    console.error('Error deleting voucher:', error)
  }
}

const groupBy = ref([
  {
    key: 'sponsor.name.en',
    order: 'asc',
  },
])
const toDate = (value: string | Date): Date => {
  return value instanceof Date ? value : new Date(value)
}
const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString('en-US', options)
}

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
const voucherDelete = ref()
const selectVoucher = ref<VoucherModel | null>(null)
const selectVoucherId = ref('')
const openEditDialog = (voucher: VoucherModel) => {
  selectVoucherId.value = voucher.id
  selectVoucher.value = voucher
  dialog.value = true
}
const openDeleteDialog = (voucherId: string) => {
  voucherDelete.value = vouchersData.value.find((item) => item.id === voucherId)
  Deletedialog.value = true
}
const openNewDialog = () => {
  selectVoucherId.value = ''
  selectVoucher.value = null
  dialog.value = true
}

const search = ref('')
const computedVouchers = computed(() => {
  return vouchersData.value.map((voucher) => ({
    ...voucher,
    searchString: [
      voucher.discount.th,
      voucher.discount.en,
      voucher.condition.map((condition) => condition.th).join(' '),
      voucher.condition.map((condition) => condition.en).join(' '),
      voucher.sponsor.name?.en,
      formatDate(voucher.exp),
    ]
      .join(' ')
      .toLowerCase(),
  }))
})

const filteredVoucherCodes = computed(() => {
  if (!search.value) return computedVouchers.value
  return computedVouchers.value.filter((voucher) =>
    voucher.searchString.includes(search.value.toLowerCase())
  )
})
</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="7" sm="5" class="d-flex justify-space-between">
        <h1 class="ml-1">Voucher Tickets</h1>
      </v-col>
      <v-col cols="12" md="3" sm="4">
        <v-text-field
          v-model="search"
          hide-details="auto"
          density="compact"
          variant="outlined"
          placeholder="Search Voucher"
          prepend-inner-icon="mdi-magnify"
          rounded
        />
      </v-col>
      <v-col cols="12" md="2" sm="3" class="d-flex justify-start">
        <v-btn
          variant="elevated"
          prepend-icon="mdi-plus"
          color="black"
          block
          rounded
          @click="openNewDialog()"
        >
          New Voucher
        </v-btn>
      </v-col>
    </v-row>

    <v-card
      class="mt-4"
      rounded="lg"
      elevation="0"
      block
      border
      style="overflow-y: auto; max-height: 80vh"
    >
      <v-data-table
        :headers="headers"
        :items="filteredVoucherCodes"
        :group-by="groupBy"
        :search="search"
      >
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
        <template #[`item.discount`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(6)">
            <p :style="wrapStyle(5)">TH : {{ item.discount.th }}</p>
            <p :style="wrapStyle(5)">EN :{{ item.discount.en }}</p>
          </v-responsive>
        </template>
        <template #[`item.condition`]="{ item }">
          <v-responsive>
            <div class="scroll-container">
              <div
                v-for="(condition, index) in item.condition"
                :key="index"
                class="scroll-item"
              >
                <p :style="wrapStyle(5)">
                  {{ index + 1 }}.TH : {{ condition.th }}
                </p>
                <p :style="wrapStyle(5)">
                  {{ index + 1 }}.EN : {{ condition.en }}
                </p>
              </div>
            </div>
          </v-responsive>
        </template>
        <template #[`item.exp`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(6)">
            <p :style="wrapStyle(5)">{{ formatDate(item.exp) }}</p>
          </v-responsive>
        </template>
        <template #[`item.type`]="{ item }">
          <v-responsive class="d-flex align-center" :height="wrapHeight(4)">
            <v-chip
              :color="item.type === 'GLOBAL' ? 'success' : 'warning'"
              variant="flat"
            >
              <p :style="wrapStyle(5)">{{ item.type }}</p>
            </v-chip>
          </v-responsive>
        </template>   
        <template #[`item.voucherImages.main`]="{ item }">
          <v-card
            color="black"
            max-width="6rem"
            max-height="6rem"
            class="mx-auto my-3"
            rounded="lg"
          >
            <v-img
              :src="item.voucherImages.main"
              class="mx-auto"
              max-width="6rem"
              max-height="6rem"
            />
          </v-card>
        </template>
        <template #[`item.voucherImages.front`]="{ item }">
          <v-card
            color="black"
            max-width="6rem"
            max-height="6rem"
            class="mx-auto my-3"
            rounded="lg"
          >
            <v-img
              :src="item.voucherImages.front"
              class="mx-auto"
              max-width="6rem"
              max-height="6rem"
            />
          </v-card>
        </template>
        <template #[`item.voucherImages.back`]="{ item }">
          <v-card
            color="black"
            max-width="6rem"
            max-height="6rem"
            class="mx-auto my-3"
            rounded="lg"
          >
            <v-img
              :src="item.voucherImages.back"
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
    </v-card>
    <VouchersCreate
      v-model="dialog"
      :voucher-data="selectVoucher"
      :sponsors="sponsors"
      @save="CreateVoucher"
    />
    <VouchersDelete
      v-model="Deletedialog"
      :voucher-item="voucherDelete"
      @delete="deleteVoucher"
    />
    <SnackbarNotify
      v-model="snackbar"
      :title="snackbarNotify.title"
      :type="snackbarNotify.type"
    />
  </v-container>
</template>
<style scoped>
.scroll-item {
  margin-bottom: 10px;
}
.scroll-container {
  max-height: 120px;
  overflow-y: auto;
}
</style>
