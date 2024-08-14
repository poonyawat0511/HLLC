<script setup lang="ts">
import type { VForm } from 'vuetify/components'
const dialog = defineModel<boolean>({ default: false })
const formRef = ref<VForm | null>(null)
const showDatePicker = ref(false)
const snackbar = ref(false)
const props = defineProps<{
  voucherData?: VoucherModel | null
  sponsors?: ISponsor[]
}>()

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
const invalidateForm = () => {
  if (!voucher.value.sponsor) {
    onSnackbar('Sponsor is required', 'error')
    return
  }
  if (!voucher.value.discount.en || !voucher.value.discount.th) {
    onSnackbar('Discount values are required', 'error')
    return
  }
  if (!voucher.value.acronym) {
    onSnackbar('Acronym is required', 'error')
    return
  }
  if (!voucher.value.type) {
    onSnackbar('Type is required', 'error')
    return
  }
  if (!voucher.value.exp) {
    onSnackbar('Expiry Date is required', 'error')
    return
  }
  if (
    !voucher.value.voucherImages.main ||
    !voucher.value.voucherImages.back ||
    !voucher.value.voucherImages.front
  ) {
    onSnackbar('Voucher Image All fields are required.', 'error')
    return
  }
  // Check conditions
  for (const condition of voucher.value.condition) {
    if (!condition.en || !condition.th) {
      onSnackbar('Conditions are required', 'error')
      return
    }
  }

  saveVoucher()
}
const voucher = ref<VoucherModel>({
  id: '',
  discount: { th: '', en: '' },
  condition: [
    {
      th: '',
      en: '',
      id: '',
    },
  ],
  voucherImages: {
    main: '',
    front: '',
    back: '',
  },
  sponsor: {
    name: {
      en: '',
    },
    id: '',
  },
  exp: new Date(),
  acronym: '',
  type: 'GLOBAL',
})

const emit = defineEmits(['save', 'edit'])
const saveVoucher = () => {
  emit('save', voucher.value)
}

const imagePreview = reactive({
  main: null as string | File | null,
  front: null as string | File | null,
  back: null as string | File | null,
})

const resetForm = () => {
  voucher.value = {
    id: '',
    discount: { th: '', en: '' },
    condition: [
      {
        th: '',
        en: '',
        id: '',
      },
    ],
    voucherImages: {
      main: '',
      front: '',
      back: '',
    },
    sponsor: {
      name: {
        en: '',
      },
      id: '',
    },
    exp: new Date(),
    acronym: '',
    type: 'GLOBAL',
  }
  imagePreview.main = null
  imagePreview.front = null
  imagePreview.back = null
  showDatePicker.value = false
}

watch(dialog, (newVal) => {
  if (newVal === false) {
    resetForm()
  } else if (newVal === true && props.voucherData) {
    voucher.value = { ...props.voucherData }
    voucher.value.sponsor.id = props.voucherData.sponsor.id
    imagePreview.main = props.voucherData.voucherImages.main || null
    imagePreview.front = props.voucherData.voucherImages.front || null
    imagePreview.back = props.voucherData.voucherImages.back || null
    showDatePicker.value = false
  }
})
const addCondition = () => {
  voucher.value.condition.push({
    th: '',
    en: '',
    id: '',
  })
}

const removeCondition = (index: number) => {
  voucher.value.condition.splice(index, 1)
}
</script>
<template>
  <FormDialog
    v-model="dialog"
    icon="mdi-ticket-percent-outline"
    max-width="40rem"
    :header="props.voucherData ? 'Edit Voucher' : 'Add Voucher'"
    sub-header="Enter Voucher Information"
  >
    <template #content>
      <v-form ref="formRef">
        <v-row>
          <v-col cols="12" md="4">
            <h3>Main</h3>
            <base-image-upload
              v-model="voucher.voucherImages.main"
              :aspect-ratio="1 / 1"
              color="gray"
            />
          </v-col>
          <v-col cols="12" md="4">
            <h3>Front</h3>
            <base-image-upload
              v-model="voucher.voucherImages.front"
              :aspect-ratio="1 / 1"
              color="gray"
            />
          </v-col>
          <v-col cols="12" md="4">
            <h3>Back</h3>
            <base-image-upload
              v-model="voucher.voucherImages.back"
              :aspect-ratio="1 / 1"
              color="gray"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-autocomplete
              v-model="voucher.sponsor"
              :items="sponsors"
              item-title="name.en"
              item-value="id"
              density="compact"
              label="Sponsor"
              :rules="[(v: string) => !!v || 'Select sponsor']"
              variant="outlined"
              rounded="lg"
              clearable
              required
            />
            <v-text-field
              v-model="voucher.discount.en"
              label="Discount (EN)"
              density="compact"
              variant="outlined"
              rounded="lg"
              clearable
              required
            />
            <v-text-field
              v-model="voucher.discount.th"
              label="Discount (TH)"
              density="compact"
              variant="outlined"
              rounded="lg"
              clearable
              required
            />
            <v-text-field
              v-model="voucher.acronym"
              label="Acronym"
              density="compact"
              variant="outlined"
              rounded="lg"
              clearable
              required
            />
            <v-select
              v-model="voucher.type"
              :items="['GLOBAL', 'INDIVIDUAL']"
              label="Type"
              density="compact"
              variant="outlined"
              rounded="lg"
              :rules="[(v: string) => !!v || 'Select type']"
              clearable
              required
            />
            <date-input
              v-model="voucher.exp"
              label="Expiry Date"
              type="date"
              rounded="lg"
              density="compact"
              variant="outlined"
              clearable
            />
          </v-col>
          <v-row>
            <v-col cols="12">
              <v-card elevation="0" border rounded="lg">
                <v-card-title>Condition (TH)</v-card-title>
                <v-divider />
                <v-card-text>
                  <v-row>
                    <template
                      v-for="(condition, index) in voucher.condition"
                      :key="index"
                    >
                      <v-col cols="12" class="pa-0 mt-2">
                        <v-text-field
                          v-model="condition.th"
                          density="compact"
                          variant="outlined"
                          rounded="lg"
                          @click:append="() => {}"
                        >
                          <template #prepend>
                            <v-avatar> {{ index + 1 }} </v-avatar>
                          </template>
                          <template #append>
                            <v-btn
                              icon
                              variant="text"
                              size="small"
                              :disabled="index === 0"
                              @click="removeCondition(index)"
                            >
                              <v-icon> mdi-minus </v-icon>
                            </v-btn>
                            <v-btn
                              icon
                              variant="text"
                              size="small"
                              @click="addCondition()"
                            >
                              <v-icon> mdi-plus </v-icon>
                            </v-btn>
                          </template>
                        </v-text-field>
                      </v-col>
                    </template>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card elevation="0" border rounded="lg">
                <v-card-title>Condition (EN)</v-card-title>
                <v-divider />
                <v-card-text>
                  <v-row>
                    <template
                      v-for="(condition, index) in voucher.condition"
                      :key="index"
                    >
                      <v-col cols="12" class="pa-0 mt-2">
                        <v-text-field
                          v-model="condition.en"
                          density="compact"
                          variant="outlined"
                          rounded="lg"
                          @click:append="() => {}"
                        >
                          <template #prepend>
                            <v-avatar> {{ index + 1 }} </v-avatar>
                          </template>
                          <template #append>
                            <v-btn
                              icon
                              variant="text"
                              size="small"
                              :disabled="index === 0"
                              @click="removeCondition(index)"
                            >
                              <v-icon> mdi-minus </v-icon>
                            </v-btn>
                            <v-btn
                              icon
                              variant="text"
                              size="small"
                              @click="addCondition()"
                            >
                              <v-icon> mdi-plus </v-icon>
                            </v-btn>
                          </template>
                        </v-text-field>
                      </v-col>
                    </template>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-row>
      </v-form>
    </template>
    <template #actions>
      <v-spacer />
      <v-btn rounded @click="dialog = false">Cancel</v-btn>
      <v-btn
        color="black"
        variant="flat"
        class="px-4"
        rounded
        @click="invalidateForm()"
        >{{ voucherData ? 'Save' : 'Create' }}</v-btn
      >
      <v-spacer />
    </template>
  </FormDialog>
  <SnackbarNotify
    v-model="snackbar"
    :title="snackbarNotify.title"
    :type="snackbarNotify.type"
  />
</template>
<style scoped>
.image-placeholder {
  width: 100%;
  height: 200px;
  border: 1px dashed #ccc;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  background-color: #aaa;
}
</style>
