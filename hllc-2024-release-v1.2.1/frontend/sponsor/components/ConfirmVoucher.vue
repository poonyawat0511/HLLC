<script setup lang="ts">
const dialog = defineModel<boolean>({ default: false })

defineProps<{ voucher: VoucherCode; loading: boolean }>()
defineEmits(['confirm', 'cancel'])
</script>
<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="35rem"
    rounded-xl
    content-class="elevation-0"
  >
    <v-card persistent max-width="35rem" rounded-xl>
      <v-card-title style="justify-content: center">
        <h4>กรุณายืนยันข้อมูล</h4>
      </v-card-title>
      <div class="mt-6 mb-6">
        <h3 class="text-center">{{ voucher.code }}</h3>
      </div>
      <v-card-actions style="justify-content: center">
        <div>
          <v-btn
            variant="text"
            rounded
            :disabled="loading"
            @click="$emit('cancel')"
          >
            cancel
          </v-btn>
          <v-btn
            color="primary"
            class="white--text"
            rounded
            :loading="loading"
            :disabled="loading"
            @click="$emit('confirm')"
          >
            Confirm
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
