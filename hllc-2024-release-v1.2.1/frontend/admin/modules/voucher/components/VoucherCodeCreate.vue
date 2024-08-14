<script setup lang="ts">
const dialog = defineModel<boolean>({ default: false })
const props = defineProps<{
  voucherData: VoucherModel[]
  EditDialog: boolean
  currentVoucher: IEditVoucher | null
}>()
const formData = ref({
  selectedSponsor: null as string | null,
  voucher: '' as string,
  count: 1 as number,
  acronym: '' as string,
})
const editFormData = ref({
  user: null as string | null,
  type: 'UNUSED' as string,
})

// fillter sponsor and voucher
const filteredVouchers = computed(() => {
  if (!formData.value.selectedSponsor) return []
  return props.voucherData.filter(
    (voucher) => voucher.sponsor.id === formData.value.selectedSponsor
  )
})
const emit = defineEmits(['save'])


const loading = ref(false)
// Save function
const saveVoucher = async () => {
  loading.value = true
  try {
    if (props.EditDialog) {
      // Emit the edit form data
      emit('save', editFormData.value)
    } else {
      // Emit the create form data
      emit('save', formData.value)
    }
    await new Promise<void>(resolve => setTimeout(resolve, 1000))
    dialog.value = false
  } catch (error) {
    console.error('Error saving voucher:', error)
  } finally {
    loading.value = false
  }
}


watch(
  () => formData.value.voucher,
  (newVal) => {
    if (newVal != '') {
      const foundVoucher = props.voucherData.find((v) => v.id === newVal)
      if (foundVoucher) {
        formData.value.acronym = foundVoucher.acronym
      } else {
        formData.value.acronym = ''
      }
    }
  }
)
watch(
  () => dialog.value,
  (newVal) => {
    if (!newVal) {
      // Clear form data when the dialog is closed
      formData.value = {
        selectedSponsor: null,
        voucher: '',
        count: 1,
        acronym: '',
      }
      editFormData.value = {
        user: null,
        type: 'UNUSED',
      }
    }
  }
)
watch(
  () => [dialog.value, props.EditDialog],
  ([dialogValue, isEditDialog]) => {
    if (dialogValue) {
      if (isEditDialog && props.currentVoucher) {
        // Set form data with current voucher data when editing
        formData.value = {
          selectedSponsor: props.currentVoucher.voucher.sponsor,
          voucher: props.currentVoucher.voucher,
          count: parseInt(props.currentVoucher.count, 10),
          acronym: props.currentVoucher.acronym,
        }
        editFormData.value = {
          user: props.currentVoucher.user?.username || null,
          type: props.currentVoucher.type || 'UNUSED',
        }
      } else {
        // Clear form data when switching from edit to create mode
        formData.value = {
          selectedSponsor: null,
          voucher: '',
          count: 1,
          acronym: '',
        }
        editFormData.value = {
          user: null,
          type: 'UNUSED',
        }
      }
    }
  }
)
const formIsValid = computed(() => {
  if (!props.EditDialog) {
    // Validate only for Create Dialog
    return (
      !!formData.value.selectedSponsor &&
      !!formData.value.voucher &&
      formData.value.count >= 1 &&
      formData.value.count <= 5000
    )
  } else {
    // Always consider form valid for Edit Dialog
    return true
  }
})
</script>

<template>
  <v-container>
    <FormDialog
      v-model="dialog"
      icon="mdi-ticket-percent-outline"
      max-width="40rem"
      :header="props.EditDialog ? 'Edit Voucher Code' : 'Add Voucher Code'"
      sub-header="Enter Voucher Information"
    >
      <template #content>
        <!-- {{ formData }} -->
        <v-form ref="formRef">
          <v-autocomplete
            v-model="formData.selectedSponsor"
            :items="
              voucherData
                .map((voucher) => voucher.sponsor)
                .filter(
                  (value, index, self) =>
                    self.findIndex((v) => v.id === value.id) === index
                )
            "
            item-value="id"
            label="Sponsor"
            item-title="name.en"
            density="compact"
            variant="outlined"
            rounded
            :readonly="props.EditDialog"
          />
          <v-autocomplete
            v-if="formData.selectedSponsor"
            v-model="formData.voucher"
            :items="filteredVouchers"
            item-value="id"
            label="Voucher"
            density="compact"
            item-title="discount.en"
            variant="outlined"
            rounded
            :readonly="props.EditDialog"
          />

          <v-text-field
            v-if="!props.EditDialog"
            v-model="formData.count"
            label="Amount Voucher"
            type="number"
            density="compact"
            variant="outlined"
            hint="5000 vouchers max for code generation"
            rounded
            :rules="[(v:number) => v >= 1 && v <= 5000 || 'Invalid value']"
            min="1"
          />
          <!-- {{ editFormData }} -->
          <v-text-field
            v-if="props.EditDialog"
            v-model="editFormData.user"
            label="Search StudentID"
            density="compact"
            maxlength="10"
            variant="outlined"
            rounded
            clearable
          />
          <v-select
            v-if="props.EditDialog"
            v-model="editFormData.type"
            :items="['UNUSED', 'USED']"
            label="Type"
            density="compact"
            variant="outlined"
            rounded
          />
        </v-form>
      </template>
      <template #actions>
        <v-spacer />
        <v-btn rounded @click="dialog = false">Cancel</v-btn>
        <v-btn
          variant="flat"
          class="px-4"
          color="black"
          rounded
          :disabled="!formIsValid"
          @click="saveVoucher()"
          >
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="24"
            width="3"
          />
          <span v-if="!loading">{{ props.EditDialog ? 'Save' : 'Create' }}</span>
        </v-btn>
        <v-spacer />
      </template>
    </FormDialog>
  </v-container>
</template>
