<script setup lang="ts">
// import { FetchError } from 'ofetch'

// Injections
const { $api } = useNuxtApp()

const snackbar = inject<Snackbar>('snackbar')

// Tab
const route = useRoute()
const router = useRouter()
const tab = computed({
  get() {
    return route.query.tab === 'typing' ? 'typing' : 'camera'
  },
  set(value: string) {
    router.push({ query: { tab: value } })
  },
})

const selecteVoucherCode = ref<VoucherCode[]>([])
const form = reactive({
  voucher: null as VoucherCode | null,

  async findVoucher(data: string) {
    const response = await $api.get<ApiResponse<VoucherCode>>(
      `/voucher-codes/${data}/code`
    )
    return response.data
  },

  async confirm(data: string) {
    try {
      const voucher = await this.findVoucher(data)
      this.voucher = voucher
      confirm.open()
    } catch (error) {
      const message = getErrorMessage(error)
      snackbar?.open([{ message, color: 'error', open: true }])
      this.preventNext()
    }
  },

  async voucherCode(voucherCode: VoucherCode): Promise<Partial<SnackbarItem>> {
    try {
      confirm.loading = true

      await $api.put<VoucherCode>(`/voucher-codes/${voucherCode.id}`, {
        body: JSON.stringify({ type: "USED" }),
      })
      return {
        message: `Add voucher to "${voucherCode.code}" successfully`,
        color: 'green darken-2',
        icon: 'mdi-checkbox-marked-circle-outline',
      }
    } catch (error) {
      const message = getErrorMessage(error)
      return {
        message,
        color: 'red darken-1',
        icon: 'mdi-alert-circle-outline',
      }
    }
  },

  preventNext() {},

  async save() {
    selecteVoucherCode.value = [this.voucher as VoucherCode]
    confirm.loading = true
    const responses = await Promise.all(
      selecteVoucherCode.value.map((voucher) => this.voucherCode(voucher))
    )
    snackbar?.open(
      responses.map((response) => ({ ...response, open: true } as SnackbarItem))
    )
    confirm.close()
    this.preventNext()
  },
})

const confirm = reactive({
  dialog: false,
  loading: false,

  open() {
    this.dialog = true
  },

  close() {
    this.dialog = false
    form.preventNext()
  },
})

/**
 * A function to handle the decoded data
 * @param data decoded data
 * @param next a function to call for next reader
 */
async function onDecode(data?: string, next?: () => void) {
  if (!data) return
  form.preventNext = async function () {
    await new Promise((resolve) => setTimeout(resolve, 500))
    next?.()
  }
  await form.confirm(data)
}
</script>

<template>
  <client-only>
    <v-container>
      <v-row>
        <v-col cols="12">
          <scanner-tabs
            v-model="tab"
            rounded="xl"
            :input-props="{
              density: 'comfortable',
              rounded: 'pill',
            }"
            force-message="Please select an sponsor and voucher"
            @decode="onDecode"
          />
        </v-col>
      </v-row>

      <confirm-voucher
        v-if="form.voucher"
        v-model="confirm.dialog"
        :loading="confirm.loading"
        :voucher="form.voucher"
        @cancel="confirm.close()"
        @confirm="form.save()"
      />
    </v-container>
  </client-only>
</template>

<style scoped>
.camera-inner {
  height: inherit;
  width: inherit;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.camera {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
