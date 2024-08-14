<script setup lang="ts">
const { locale } = useI18n()
const dialog = defineModel<boolean>({ default: false })
const emit = defineEmits(['confirm'])
const props = defineProps({
  req: {
    required: true,
    type: Object,
    default: null,
  },
})

const confirm = () => {
  emit('confirm', props.req, 'accept')
  dialog.value = false
}
const { colors } = useSchool()
</script>

<template>
  <v-col>
    <v-dialog
      v-model="dialog"
      max-width="25rem"
      persistent
      content-class="elevation-0"
    >
      <v-card
        :style="{
          backgroundColor: colors['dialog-surface'],
          '-webkit-backdrop-filter': 'blur(15px)',
          'backdrop-filter': 'blur(15px)',
        }"
        class="pr-4 pl-4"
        rounded="xl"
        elevation="0"
      >
        <v-card-title class="d-flex">
          <span>{{ $t('The answer of your friend') }}</span>
        </v-card-title>
        <v-card-text class="mt-n3 mb-n5">
          <div v-for="(question, i) in props.req.questions" :key="i">
            <p>
              <strong
                >{{ question.questionnaire.questionnaire[locale] }}:</strong
              >
              {{ question.messages }}
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-end mt-n5">
          <v-btn rounded  @click="dialog = false">
            {{ $t('isClose') }}
          </v-btn>
          <v-btn rounded @click="confirm" color="primary"> {{ $t('Confirm') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>
