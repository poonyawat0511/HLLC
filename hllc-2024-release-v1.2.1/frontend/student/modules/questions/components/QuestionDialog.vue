<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

export type AnswerType = 'post' | 'update'

interface Props {
  item?: IAnswer | null
  loading?: boolean
  type?: AnswerType
  id?: string
}

type Events = {
  confirm: [type: AnswerType, item: IAnswer]
}

const { colors } = useSchool()

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  type: 'update',
})

const emit = defineEmits<Events>()

const formData = ref<IAnswer>({
  id: '',
  question: '',
  user: '',
  value: '',
})

watchEffect(() => {
  if (props.type === 'update' && props.item) {
    formData.value = { ...props.item }
  } else {
    formData.value = {
      id: '',
      question: '',
      user: '',
      value: '',
    }
  }
})

const formIsValid = computed(() => {
  if (!props.item?.value) {
    // Validate only for Create Dialog
    return (
      !!formData.value.value
    )
  } else {
    // Always consider form valid for Edit Dialog
    return true
  }
})

const handleSubmit = async () => {
  if (props.id) {
    formData.value.question = props.id
  }
  if (props.type === 'update') {
    const updatedItem = { ...formData.value }
    emit('confirm', 'update', updatedItem as IAnswer)
  } else {
    emit('confirm', 'post', formData.value)
  }
}

watch(
  () => dialog.value,
  (newValue) => {
    if (!newValue && props.type === 'post') {
      formData.value = {
        id: '',
        question: '',
        user: '',
        value: '',
      }
    }
  }
)
</script>
<template>
  <v-dialog
    v-model="dialog"
    content-class="elevation-0"
    max-width="50rem"
    persistent
    scrollable
  >
    <v-card
      rounded="xl"
      :style="{
        backgroundColor: colors['dialog-surface'],
        '-webkit-backdrop-filter': 'blur(15px)',
        'backdrop-filter': 'blur(15px)',
        position: 'relative',
      }"
      elevation="0"
    >
      <v-card-title>
        <span class="text-primary ml-2">
          {{ $t(type === 'update' ? 'updateQuestion' : 'createQuestion') }}
        </span>
      </v-card-title>
      <v-card-text class="mt-n5">
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12">
              <p class="text-title mb-2">{{ $t('textLabelQuestion') }}</p>
              <v-textarea
                v-model="formData.value"
                persistent-placeholder
                rounded
                rows="10"
                auto-grow
                variant="outlined"
                :background-color="colors['transparent']"
                :base-color="colors['card-surface']"
                :color="colors['card-surface']"
                :placeholder="$t('textPlaceholderQuestion')"
                counter
                maxlength="1000"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-4 mt-n5">
        <v-spacer />
        <v-btn
          rounded
          variant="plain"
          class="mx-2 white--text"
          @click="dialog = false"
        >
          <v-responsive width="6rem"> {{ $t('Cancel') }} </v-responsive>
        </v-btn>
        <v-btn
          rounded
          variant="flat"
          color="primary"
          class="mx-2 text-white"
          :disabled="!formIsValid"
          @click="handleSubmit()"
        >
          <v-responsive width="6rem">
            {{ $t(type === 'update' ? 'Confirm' : 'Submit') }}
          </v-responsive>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
