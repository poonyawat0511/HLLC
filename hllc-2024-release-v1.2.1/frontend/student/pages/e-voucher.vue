<script setup lang="ts">
definePageMeta({
  menu: {
    active: 'E-voucher',
    display: true,
  },
  background: true,
})

const { data: user } = useAuth()
const { colors } = useSchool()
const router = useRouter()
const route = useRoute()

const {
  fetchVoucherGift,
  voucherGifts,
  fetchVouchers,
  sortedVoucher,
  submit,
  use,
  isOpen,
  setting,
  loadSetting,
} = useVoucher()

onMounted(async () => {
  await fetchVoucherGift()
  await fetchVouchers()
  await loadSetting()
})

interface TabItem {
  value: string
  title: { en: string; th: string }
}

const tabs = reactive<TabItem[]>([
  {
    value: 'available',
    title: {
      en: 'Available',
      th: 'Available',
    },
  },
  {
    value: 'myVoucher',
    title: {
      en: 'My vouchers',
      th: 'My vouchers',
    },
  },
])

function changeTab(value: string) {
  tab.value = value
}

const tab = computed<string>({
  get() {
    return route.query.view ? String(route.query.view) : tabs[0]?.value
  },
  set(value) {
    router.push({ query: { view: value } })
  },
})

const selectedEvoucher = ref<voucherExists | null>(null)
const dialog = reactive<{ value: boolean }>({ value: false })
const openDialog = (evoucher: voucherExists) => {
  selectedEvoucher.value = evoucher
  dialog.value = true
}
async function onConfirm(item: voucherExists) {
  await submit(item)
  dialog.value = false
}

const selectedEvoucherCode = ref<VoucherCode | null>(null)
const useDialog = reactive<{ value: boolean }>({
  value: false,
})
const openUseDialog = (evoucherCode: VoucherCode) => {
  selectedEvoucherCode.value = evoucherCode
  useDialog.value = true
}
async function onUse(item: VoucherCode) {
  await use(item)
  dialog.value = false
}
</script>

<template>
  <ClientOnly>
    
    <v-container v-if="isOpen" fluid>
      <h1 class="text-center text-white">{{ $t('Evouchers') }}</h1>
      <div class="d-flex justify-space-between">
        <tab-switch :tabs="tabs" :active-tab="tab" @change-tab="changeTab" />
        <voucher-how-dialog
          :use-rules="setting.howToUseVoucher"
          :getRules="setting.howToGetVoucher"
          :note="setting.note || { th: '', en: '' }"
        />
      </div>
      <v-window v-model="tab">
        <v-window-item value="available">
          <v-card
            rounded="xl"
            elevation="0"
            class="mt-2"
            :color="$vuetify.display.mobile ? 'transparent' : colors['card-bg']"
            :class="$vuetify.display.mobile ? '' : 'pa-5'"
          >
            <v-row dense class="mx-auto">
              <v-col
                v-if="voucherGifts.length > 0"
                cols="12"
                md="4"
                sm="4"
                lg="4"
                xl="3"
                
                v-for="(evoucherGift, index) in voucherGifts"
                :key="index"
              >
                <voucher-card
                  :item="evoucherGift"
                  @click:pick="openDialog(evoucherGift)"
                />
              </v-col>
              <v-card-text v-else>
                <v-col cols="12" class="text-white text-center">
                  {{ $t('noVoucher') }}
                </v-col>
              </v-card-text>
            </v-row>
          </v-card>
        </v-window-item>
        <v-window-item value="myVoucher">
          <v-card
            rounded="xl"
            elevation="0"
            class="mt-2"
            :color="$vuetify.display.mobile ? 'transparent' : colors['card-bg']"
            :class="$vuetify.display.mobile ? '' : 'pa-5'"
          >
            <v-row dense class="mx-auto">
              <v-col
                cols="12"
                md="4"
                sm="4"
                lg="4"
                xl="3"
                v-for="(evoucher, index) in sortedVoucher"
                :key="index"
                v-if="sortedVoucher.length > 0"
              >
                <voucher-my-card
                  :item="evoucher"
                  @click="openUseDialog(evoucher)"
                />
              </v-col>
              <v-card-text v-else>
                <v-col cols="12" class="text-white text-center">
                  {{ $t('noVoucher') }}
                </v-col>
              </v-card-text>
            </v-row>
          </v-card>
        </v-window-item>
      </v-window>
      <voucher-pick-dialog
        v-if="selectedEvoucher"
        v-model="dialog.value"
        :dialog="dialog.value"
        :item="selectedEvoucher"
        @confirm="onConfirm"
      />
      <voucher-use-dialog
        v-model="useDialog.value"
        :item="selectedEvoucherCode"
        @confirm="onUse"
      ></voucher-use-dialog>
    </v-container>
    <v-container v-else fluid>
      <v-card :color="colors['card-surface']" rounded="xl" elevation="0">
        <v-card-text>
          <p class="text-center">{{ $t('voucherComing') }}</p>
        </v-card-text>
      </v-card>
    </v-container>
  </ClientOnly>
</template>
