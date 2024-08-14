<template>
  <div>
    <v-file-input
      ref="fileInput"
      v-model="localFile"
      accept="image/*"
      style="display: none"
      @change="handleImageChange"
    />
    <div v-if="imagePreview" class="image-preview">
      <v-img
        :src="imagePreview"
        max-width="200"
        max-height="200"
        @click="triggerFileInput"
      />
    </div>
    <div
      v-else
      class="image-placeholder"
      @click="triggerFileInput"
    >
      Click to upload an image
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  field: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:data']);
const localFile = ref(null);
const imagePreview = ref(null);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    localFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
    emit('update:data', { field: props.field.model, file });
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

watch(
  () => props.data[props.field.model],
  (newVal) => {
    if (newVal) {
      imagePreview.value = URL.createObjectURL(newVal);
    } else {
      imagePreview.value = null;
    }
  },
  { immediate: true }
);
</script>

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
  color: #aaa;
}
.image-preview {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
