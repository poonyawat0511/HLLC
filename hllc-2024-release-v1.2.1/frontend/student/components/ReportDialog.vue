<script setup lang="ts">
import type { VForm } from 'vuetify/components'

const reportDialog = defineModel({
  type: Boolean,
  default: false,
})
const confirmDialog = ref(false)
const successDialog = ref(false)
const category = ref<CategoryModel[]>([])
const { $api } = useNuxtApp()
const { data: user } = useAuth()
const form = ref<VForm | null>(null)
const { t } = useI18n()
const { colors } = useSchool()

interface DialogModel {
  reporter: string
  message: string
  category: string | null
}

const dialogModel = ref<DialogModel>({
  reporter: '',
  message: '',
  category: null,
})
interface CategoryModel {
  name: {
    th: string
    en: string
  }
}

onMounted(() => {
  fetchCategories()
})

const fetchCategories = async () => {
  try {
    const response = await $api.get<{ data: CategoryModel[] }>(
      `/report-categories`
    )
    category.value = response.data
  } catch (e) {
    console.error('Error fetching reports:', e)
  }
}

const submitReport = async () => {
  const reportData = {
    reporter: user.value.id,
    category: dialogModel.value.category,
    message: dialogModel.value.message,
  }
  try {
    await $api.post(`/reports`, {
      body: JSON.stringify(reportData),
    })
    reportDialog.value = false
    confirmDialog.value = false
    successDialog.value = true
    resetForm()
  } catch (error) {
    console.error('Error submitting report:', error)
  }
}

const clean = () => {
  reportDialog.value = false
  resetForm()
}
const resetForm = () => {
  dialogModel.value.category = null
  dialogModel.value.reporter = ''
  dialogModel.value.message = ''
}

const nameRules = [(v: string) => !!v || t('report.topic_required')]
const descriptionRules = [
  (v: string) => !!v || t('report.description_required'),
]
const isFormValid = computed(() => {
  return !!dialogModel.value.category && !!dialogModel.value.message
})
</script>

<template>
  <v-dialog v-model="reportDialog" max-width="450" persistent>
    <div style="position: relative">
      <div
        style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: end;
          z-index: 1;
        "
      >
        <v-img src="icons/warning-red.png" style="width: 8rem" />
      </div>
      <v-card
        class="rounded-xl pa-2"
        elevation="0"
        scrollable
        :style="{
          backgroundColor: colors['dialog-surface'],
          '-webkit-backdrop-filter': 'blur(15px)',
          'backdrop-filter': 'blur(15px)',
          position: 'relative',
          bottom: $vuetify.display.xs ? '4vh' : '3.5vh',
        }"
      >
        <v-card-title class="text-center text-h4 text-title mt-4 mb-n4">{{
          $t('report.title')
        }}</v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="form">
            <p class="ml-3 text-subtitle-2 text-subtitle" :color="colors['title']">
              {{ $t('report.topic') }}
            </p>
            <v-autocomplete
              v-model="dialogModel.category"
              :items="category"
              :rules="nameRules"
              :item-title="$i18n.locale === 'th' ? 'name.th' : 'name.en'"
              item-value="id"
              class="mx-auto"
              density="comfortable"
              :placeholder="$t('report.topic')"
              theme="light"
              variant="solo"
              auto-select-first
              hide-details="auto"
              rounded
              :no-data-text="$t('report.no_data')"
            />
            <div class="ml-3 text-subtitle-2 text-subtitle mt-2 mb-n4">
              {{ $t('report.description') }}
            </div>
            <v-textarea
              v-model="dialogModel.message"
              class="mt-4"
              :placeholder="$t('report.description')"
              :rules="descriptionRules"
              maxlength="300"
              row-height="10"
              rows="4"
              variant="solo"
              hide-details="auto"
              rounded
              required
              counter
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="plain" rounded="xl" class="px-5" @click="clean()">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            rounded-lg
            variant="flat"
            class="px-5"
            rounded="xl"
            :disabled="!isFormValid"
            @click="confirmDialog = true"
          >
            {{ $t('Confirm') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
  <!-- confirm dialog -->
  <v-dialog v-model="confirmDialog" max-width="400">
    <v-card class="blur" rounded="xl" elevation="0">
      <v-card-title class="text-center py-3 bg-primary">
        {{ $t('Confirm') }}
      </v-card-title>
      <v-card-text class="mt-4 text-center text-title">
        {{ $t('report.comfirm_detail') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="plain"
          class="px-3"
          rounded="xl"
          @click="confirmDialog = false"
          >{{ $t('Cancel') }}</v-btn
        >
        <v-btn
          color="primary"
          rounded="xl"
          variant="flat"
          class="px-3"
          @click="submitReport()"
          >{{ $t('Confirm') }}</v-btn
        >
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- successDialog -->
  <v-dialog v-model="successDialog" max-width="400">
    <v-card class="rounded-xl text-center text-title" elevation="0">
      <v-card-text>
        <v-img src="icons/success.png" class="mx-auto" max-width="7rem" />
        <h3 class="text-h5 font-weight-bold mt-3">
          {{ $t('report.title_completed') }}
        </h3>
        <span>{{ $t('report.completed_detail') }}</span>
      </v-card-text>
      <v-card-actions class="mt-n2 mb-3">
        <v-spacer />
        <v-btn
          rounded-lg
          color="success"
          variant="flat"
          class="px-5"
          @click="successDialog = false"
          >{{ $t('Confirm') }}</v-btn
        >
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.blur {
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.4);
}
</style>
