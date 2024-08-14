<script setup lang="ts">
// import { FetchError } from 'ofetch'

// Injections
const { $api } = useNuxtApp()
const { data: user } = useAuth()
const snackbar = inject<Snackbar>('snackbar')
const route = useRoute()
const router = useRouter()

// get data sponsor and voucher
const sponsor = ref<string | null>(null)
const selectedVoucher = ref<Voucher[]>([])
const voucherCodes = ref<VoucherCode>()
const { fetchVoucher, vouchers } = useVoucher()

const checkRole = (userType: string) => {
  if (!['AE', 'ADMIN'].includes(userType)) {
    router.push('/')
  }
}

onMounted(() => {
  checkRole(user.value.role)
  fetchVoucher()
})

const filteredVouchers = computed(() => {
  if (!sponsor.value) return []
  return vouchers.value.filter(
    (voucher) => voucher.sponsor.id === sponsor.value
  )
})

// Tab

const tab = computed({
  get() {
    return route.query.tab === 'typing' ? 'typing' : 'camera'
  },
  set(value: string) {
    router.push({ query: { tab: value } })
  },
})

const form = reactive({
  user: null as User | null,

  async findUser(data: string) {
    const response = await $api.get<ApiResponse<User>>(`/users/search/${data}`)
    return response.data
  },

  async confirm(data: string) {
    try {
      const user = await this.findUser(data)
      this.user = user
      confirm.open()
    } catch (error) {
      const message = getErrorMessage(error)
      snackbar?.open([{ message, color: 'error', open: true }])
      this.preventNext()
    }
  },

  async voucher(voucher: Voucher): Promise<Partial<SnackbarItem>> {
    try {
      confirm.loading = true
      const response = await $api.get<{ data: VoucherCode }>(
        `/voucher-codes/${voucher.id}/voucher`
      )
      voucherCodes.value = response.data

      await $api.put(`/voucher-codes/${voucherCodes.value.id}`, {
        body: {
          user: this.user!.id,
        },
      })
      return {
        message: `Add voucher to "${user.value.username}" successfully`,
        color: 'green darken-2',
        icon: 'mdi-checkbox-marked-circle-outline',
      }
    } catch (error) {
      const err = error as ErrorResponse
      const message = getErrorMessage(error)

      if (
        err.response._data.message ===
        `Voucher code not found for voucher ID ${voucher.id}`
      ) {
        return {
          message: `Voucher is out of stock`,
          color: 'red darken-1',
          icon: 'mdi-alert-circle-outline',
        }
      }

      return {
        message,
        color: 'red darken-1',
        icon: 'mdi-alert-circle-outline',
      }
    }
  },

  preventNext() {},

  async save() {
    confirm.loading = true
    const responses = await Promise.all(
      selectedVoucher.value.map((voucherCode) => this.voucher(voucherCode))
    )
    snackbar?.open(
      responses.map((response) => ({ ...response, open: true } as SnackbarItem))
    )
    confirm.loading = false
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
          <v-card
            class="mx-auto"
            rounded="xl"
            variant="outlined"
            max-width="45rem"
          >
            <v-card-title class="text-center pt-5">Voucher</v-card-title>
            <v-divider class="my-3" />
            <v-card-text>
              <v-select
                v-model="sponsor"
                :items="
                  vouchers
                    .map((voucher) => voucher.sponsor)
                    .filter(
                      (value, index, self) =>
                        self.findIndex((v) => v.id === value.id) === index
                    )
                "
                item-value="id"
                hide-details="auto"
                rounded="pill"
                label="Select sponsor"
                density="comfortable"
                item-title="name.en"
                variant="outlined"
              />
              <v-select
                v-if="sponsor"
                v-model="selectedVoucher"
                :items="filteredVouchers"
                class="mt-3"
                rounded="pill"
                label="Select voucher"
                density="comfortable"
                item-title="discount.en"
                variant="outlined"
                item-value="id"
                return-object
                chips
                hide-details
                clearable
                multiple
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <scanner-tabs
            v-model="tab"
            rounded="xl"
            :force="!selectedVoucher?.length"
            :input-props="{
              density: 'comfortable',
              rounded: 'pill',
            }"
            force-message="Please select an sponsor and voucher"
            @decode="onDecode"
          />
        </v-col>
      </v-row>
      <confirm-voucher-code
        v-if="form.user"
        v-model="confirm.dialog"
        :loading="confirm.loading"
        :user="form.user"
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
