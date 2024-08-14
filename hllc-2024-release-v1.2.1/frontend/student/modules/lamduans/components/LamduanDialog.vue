<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

export type LamduanType = 'post' | 'update'

interface Props {
  item: Lamduan | null
  loading?: boolean
  type?: LamduanType
}

type Events = {
  confirm: [type: LamduanType, item: Lamduan]
}

const { colors } = useSchool()

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  type: 'update',
})  

const snackbar = ref(false);
const snackbarMessage = ref('');

const emit = defineEmits<Events>()

const formData = ref<Lamduan>({
  id: '',
  user: '',
  text: '',
  lamduanImage: '',
})

const selectedFile = ref<File | string | null>(null)

watchEffect(() => {
  if (props.type === 'update' && props.item) {
    formData.value = { ...props.item };
    selectedFile.value = props.item.lamduanImage;
  } 
});

const resizeImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const maxSize = 255 * 1024;

    const resize = (image: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      let width = image.width;
      let height = image.height;

      const maxWidth = 512;
      const maxHeight = 512;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height *= maxWidth / width));
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width *= maxHeight / height));
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (blob.size > maxSize) {
              snackbarMessage.value = 'Resized file size still exceeds 255 KB';
              snackbar.value = true;
              reject(new Error('Resized file size exceeds 255 KB'));
            } else {
              const newFile = new File([blob], file.name, { type: file.type });
              resolve(newFile);
            }
          } else {
            reject(new Error('Failed to convert canvas to Blob'));
          }
        },
        file.type,
        0.7
      );
    };

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resize(img);
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const urlToFile = async (url: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const filename = url.substring(url.lastIndexOf('/') + 1);
  const file = new File([blob], filename, { type: blob.type });
  return file;
};

watch(selectedFile, async (newValue) => {
  if (newValue instanceof File) {
    try {
      const resizedFile = await resizeImage(newValue);
      formData.value.lamduanImage = resizedFile;
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  } else if (typeof newValue === 'string') {
    formData.value.lamduanImage = newValue;
  }
});

const handleSubmit = async () => {
  if (typeof selectedFile.value === 'string') {
    try {
      const fileFromUrl = await urlToFile(selectedFile.value);
      formData.value.lamduanImage = await resizeImage(fileFromUrl);
    } catch (error) {
      console.error('Error converting image URL to file:', error);
      return;
    }
  } else if (selectedFile.value instanceof File) {
    try {
      formData.value.lamduanImage = await resizeImage(selectedFile.value);
    } catch (error) {
      console.error('Error resizing image:', error);
      return;
    }
  }

  if (props.type === 'update') {
    const updatedItem = { ...formData.value };
    emit('confirm', 'update', updatedItem as Lamduan);
  } else {
    emit('confirm', 'post', formData.value);
  }
};

const isSubmitDisabled = computed(() => !selectedFile.value);
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
        <span class="text-primary">
          {{ $t(type === 'update' ? 'updateLamduan' : 'createLamduan') }}
        </span>
      </v-card-title>
      <v-card-text class="mt-n5">
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" sm="6" md="4">
              <p class="text-title mb-2">{{ $t('flowerLabelLamduan') }}</p>
              <file-input
                v-model="selectedFile"
                :value="formData.lamduanImage"
                :placeholder="$t('flowerPlaceholerLamduan')"
                :aspect-ratio="1 / 1"
                outlined
                :color="colors['card-surface']"
                rounded
                prepend-inner-icon="mdi-image"
                persistent-placeholder
                :accept="'image/*'"
              />
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <p class="text-title mb-2">{{ $t('messageLabelLamduan') }}</p>
              <v-textarea
                v-model="formData.text"
                persistent-placeholder
                rounded
                rows="10"
                auto-grow
                variant="outlined"
                :background-color="colors['transparent']"
                :base-color="colors['card-surface']"
                :color="colors['card-surface']"
                :placeholder="$t('messagePlaceholderLamduan')"
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
          :disabled="isSubmitDisabled"
          @click="handleSubmit()"
        >
          <v-responsive width="6rem">
            {{ $t(type === 'update' ? 'Confirm' : 'Submit') }}
          </v-responsive>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="3000" top color="error">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-dialog>
</template>
