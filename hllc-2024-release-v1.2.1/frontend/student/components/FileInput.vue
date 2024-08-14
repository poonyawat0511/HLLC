<script setup lang="ts">
// Props
interface Props {
  readonly?: boolean
  contain?: boolean
  placeholder?: string
  aspectRatio?: number | string
  imageClass?: string | string[] | Record<string, unknown>
  color?: string
}
const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  contain: undefined,
  placeholder: 'Click to upload file',
  aspectRatio: undefined,
  imageClass: undefined,
  color: undefined
})

// VModel
const model = defineModel<File | string | null>()

// Events
type Events = { click: [] }
const emit = defineEmits<Events>()

// References
const fileUpload = ref<HTMLInputElement | null>()
const previewSrc = computed(() => {
  if (
    import.meta.client &&
    model.value instanceof File &&
    model.value.type.includes('image')
  ) {
    return URL.createObjectURL(model.value)
  }
  if (typeof model.value === 'string') return model.value
  return ''
})

/**
 * A function that handle card click
 */
function onCardClick() {
  if (props.readonly) emit('click')
  else openFileUpload()
}

/**
 * A function that let file upload open
 */
function openFileUpload() {
  fileUpload.value?.click()
}

/**
 * A function that handle file uploaded
 */
function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] as File
  model.value = file?.type.includes('image') ? file : null
}
</script>

<template>
  <v-card v-bind="$attrs" flat class="rounded-xl" variant="outlined" :color="color">
    <div class="image-container cursor-pointer" @click="onCardClick">
      <v-img
        :aspect-ratio="aspectRatio"
        :src="previewSrc"
        :contain="contain"
        :class="imageClass"
        cover
      >
        <slot name="activator" :src="model">
          <v-card-text
            v-if="!model"
            class="d-flex flex-column align-center justify-center h-100 text-center"
          >
            <v-icon size="50" color="grey" class="mb-2"> mdi-image </v-icon>
            <span class="text-caption text-title"> {{ placeholder }} </span>
          </v-card-text>
        </slot>
      </v-img>
      <div v-show="!readonly && !!model" class="close-icon ma-2">
        <v-avatar color="white" size="30">
          <v-icon color="primary" size="25" @click.stop="model = null">
            mdi-close
          </v-icon>
        </v-avatar>
      </div>
    </div>
    <input
      v-show="false"
      ref="fileUpload"
      type="file"
      accept="image/*"
      @input="onFileChange"
    >
  </v-card>
</template>

<style scoped>
.image-container {
  position: relative;
  width: inherit;
  height: inherit;
}

.close-icon {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
