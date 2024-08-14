<template>
  <v-dialog v-model="dialog" max-width="40rem" persistent>
    <v-card rounded="lg">
      <v-card-title class="text-h6 d-flex justify-center mt-2">{{
        type === 'update' ? 'Update Assessment' : 'Create Assessment'
      }}</v-card-title>
      <v-divider class="my-1" />
      <v-card-text>
        <v-text-field
          v-model="formData.question.th"
          label="Question (TH)"
          density="compact"
          variant="outlined"
          rounded="lg"
          clearable
          required
          hide-details
        />
        <v-text-field
          v-model="formData.question.en"
          label="Question (EN)"
          density="compact"
          variant="outlined"
          class="mt-3"
          rounded="lg"
          clearable
          required
          hide-details
        />
        <div class="d-flex justify-end">
          <v-switch
            v-model="formData.required"
            color="black"
            label="Required"
            hide-details
          />
        </div>
        <v-select
          v-model="formData.type"
          :items="['RATINGS', 'TEXT']"
          label="Type"
          density="compact"
          variant="outlined"
          rounded="lg"
          hide-details
        />
        <v-select
          v-model="formData.status"
          :items="['PRETEST', 'POSTTEST']"
          label="Status"
          density="compact"
          variant="outlined"
          rounded="lg"
          class="mt-3"
          hide-details
        />
        <v-autocomplete
          v-if="formData.status === 'PRETEST' || formData.status === 'POSTTEST'"
          v-model="formData.section"
          label="Section"
          :items="props.sectionData"
          item-title="title.en"
          item-value="id"
          density="compact"
          rounded="lg"
          variant="outlined"
          class="mt-3"
          hide-details
        />
      </v-card-text>
      <v-divider class="my-2" />
      <v-card-actions class="mt-n2">
        <v-spacer />
        <v-btn rounded @click="dialog = false">cancel</v-btn>
        <v-btn
          variant="flat"
          class="px-6"
          color="black"
          rounded
          :disabled="!formIsValid"
          @click="onSubmit()"
        >
          save
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
export type AssessmentType = 'post' | 'update' | 'delete';

const dialog = defineModel<boolean>({ default: false })

interface LanguageText {
  th: string;
  en: string;
}

interface AssessmentSection {
  id: string;
  title: LanguageText;
  subtitle: LanguageText;
  order: number;
}

interface Assessment {
  id: string;
  question: {
    th: string;
    en: string;
  };
  status: string;
  type: string;
  required: boolean;
  section: string | null;
  activity: string | null;
}

type Props = {
  item?: Assessment | null;
  loading?: boolean;
  type?: AssessmentType;
  sectionData: AssessmentSection | null;
};

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  type: 'update',
});

const formData = ref<Assessment>({
  id: '',
  question: {
    th: '',
    en: '',
  },
  status: '',
  type: '',
  required: true,
  section: null,
  activity: null,
});

type Events = {
  confirm: [type: AssessmentType, item: Assessment];
};
const emit = defineEmits<Events>();

// Watch edit form
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      formData.value = { ...newItem };
      dialog.value = true;
    } else {
      resetForm(); // Clear form if no item provided
    }
  }
);

watch(
  () => dialog.value,
  (isOpen) => {
    if (!isOpen && props.type === 'post') {
      resetForm();
    }
  }
);

watch(
  () => props.type,
  (newType) => {
    if (newType === 'post') {
      resetForm(); // Reset form when switching to 'post'
    }
  }
);

const resetForm = () => {
  formData.value = {
    id: '',
    question: {
      th: '',
      en: '',
    },
    status: '',
    type: '',
    required: true,
    section: null,
    activity: null,
  };
};

const onSubmit = async () => {
  if (props.type === 'update') {
    const updatedItem = { ...formData.value };
    emit('confirm', 'update', updatedItem as Assessment);
  } else {
    emit('confirm', 'post', formData.value);
  }
};

const formIsValid = computed(() => {
  return (
    formData.value.question.th.trim() !== '' &&
    formData.value.question.en.trim() !== '' &&
    formData.value.type !== '' &&
    formData.value.status !== '' &&
    (formData.value.status !== 'PRETEST' || formData.value.section !== null)
  );
});
</script>

<style scoped>
</style>
