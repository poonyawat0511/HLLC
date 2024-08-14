<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

interface Props {
  loading?: boolean
  saving?: boolean
  questions: ActivityQuestion[]
}
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  saving: false,
})

defineEmits<{ cancel: []; submit: [items: ActivityQuestion[]] }>()

type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
const { colors } = useSchool()

const items = ref<ActivityQuestion[]>([])
watch(
  () => props.questions,
  (questions) => {
    items.value = questions
      .filter((item) => !!item && typeof item === 'object')
      .map((item) => JSON.parse(JSON.stringify(item)))
      .map((item) => {
        switch (item.type) {
          case 'ratings':
            return { ...item, value: undefined }
          case 'typing':
            return { ...item, value: '' }
          default:
            return item
        }
      })
  }
)

const isFormValid = computed(() => {
  return items.value.every((question) => {
    if (question.required) {
      return (
        question.value !== null &&
        question.value !== undefined &&
        question.value !== ''
      )
    }
    return true
  })
})
</script>
<template>
  <v-dialog v-model="dialog" max-width="35rem" scrollable>
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
        <v-img src="/icons/assessment.png" style="width: 25rem" />
      </div>
      <v-card
        :style="{
          '-webkit-backdrop-filter': 'blur(15px)',
          'backdrop-filter': 'blur(15px)',
          position: 'relative',
          bottom: $vuetify.display.xs ? '5vh' : '4vh',
        }"
        color="white"
        class="pr-4 pl-4"
        rounded="xl"
        elevation="0"
      >
        <div style="height: 3rem" />
        <v-card-title class="text-primary text-center font-weight-bold"
          >{{ $t('questionActivity') }}
        </v-card-title>
        <template v-if="loading">
          {{ $t('loading') }}
        </template>
        <template v-else>
          <v-responsive class="overflow-y-auto" max-height="45vh">
            <div v-for="(item, index) in items" :key="`question-${index}`">
              <span class="text-body-3 font-weight-bold text-title">
                {{ index + 1 }}. {{ item.question[lang] }}
              </span>
              <span v-if="item.required" class="text-error font-weight-bold"
                >*</span
              >

              <v-row v-if="item.type === 'RATINGS'" dense class="mt-4">
                <v-col
                  cols="2"
                  class="align-self-end text-right mb-6 text-title"
                >
                  {{ $t('Low') }}
                </v-col>
                <v-col cols="8" class="align-self-end">
                  <v-radio-group
                    v-model="item.value"
                    class="d-flex justify-center mb-4"
                    color="primary"
                    inline
                    hide-details="auto"
                  >
                    <div v-for="rating in 5" :key="`rating-${index}-${rating}`">
                      <div
                        class="d-flex flex-column align-center justify-center mr-n2"
                      >
                        <span class="text-title">{{ rating }}</span>
                        <v-radio :value="rating" />
                      </div>
                    </div>
                  </v-radio-group>
                </v-col>
                <v-col
                  cols="2"
                  class="align-self-end text-title text-left mb-6"
                >
                  {{ $t('High') }}
                </v-col>
              </v-row>

              <!-- Text -->
              <div v-else>
                <v-textarea
                  v-model="item.value"
                  :label="$t('Answer')"
                  class="mt-5"
                  counter="300"
                  :background-color="colors['transparent']"
                  :base-color="colors['content']"
                  :color="colors['content']"
                  variant="outlined"
                  rounded
                  auto-grow
                  rows="1"
                />
              </div>
            </div>
          </v-responsive>
        </template>
        <v-divider />
        <v-card-actions class="mb-2">
          <v-spacer />
          <v-btn
            class="px-5"
            rounded
            :disabled="saving"
            @click="$emit('cancel')"
          >
            {{ $t('Cancel') }}</v-btn
          >
          <v-btn
            variant="flat"
            class="px-5"
            rounded
            color="primary"
            :disabled="!isFormValid"
            :loading="saving"
            @click.stop="$emit('submit', items)"
          >
            {{ $t('Submit') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>
