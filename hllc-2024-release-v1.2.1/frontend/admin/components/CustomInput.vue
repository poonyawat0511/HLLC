<template>
    <v-col :cols="cols" :md="md" class="py-0 my-2 px-0">
      <v-text-field
        v-model="localModel"
        density="compact"
        hide-details="auto"
        :label="label"
        :rules="rules"
        variant="outlined"
        :required="required"
        :autofocus="autofocus"
        :maxlength="maxlenght"
        :type="type"
        hide-spin-buttons
        rounded
        clearable
        class="mb-0 mx-2"
      />
    </v-col>
  </template>
  
  <script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
  
  const props = defineProps<{
    cols?: string | number;
    md?: string | number;
    label: string;
    rules?: Array<(v: string) => boolean | string>;
    required: boolean;
    modelValue: string | number;
    autofocus: boolean;
    maxlenght?: string;
    type?: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
  }>();
  
  const localModel = ref(props.modelValue);
  
  watch(localModel, (newValue) => {
    emit('update:modelValue', newValue);
  });
  
  watch(() => props.modelValue, (newValue) => {
    localModel.value = newValue;
  });
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>
  