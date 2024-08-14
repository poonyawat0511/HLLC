<script setup lang="ts">
interface Props {
  item: Lamduan | null
  evaluation: string | null
}
const props = defineProps<Props>()
const { colors } = useSchool()
const emits = defineEmits(['confirm'])

const fallbackImage = ref(false)
const lamduanImageSrc = computed(() => {
  if (fallbackImage.value || !props.item?.lamduanImage) {
    return '/no-img.png'
  }

  if (typeof props.item?.lamduanImage === 'string') {
    return props.item?.lamduanImage
  }

  if (props.item?.lamduanImage instanceof File) {
    return URL.createObjectURL(props.item?.lamduanImage)
  }
  return '/no-img.png'
})
</script>
<template>
  <div>
    <v-card title="" rounded="xl" elevation="0" :color="colors['card-surface']">
      <template v-slot:title>
        <span class="text-title">{{ $t('myLamduan') }}</span>
      </template>
      <template v-slot:prepend>
        <v-avatar size="45px" class="pa-1">
          <v-img src="/icons/lamduan.png" />
        </v-avatar>
      </template>

      <template v-slot:append>
        <slot name="actions" />
      </template>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6" md="4">
            <v-card rounded="xl" outlined border elevation="0">
              <v-img
                width="100%"
                :aspect-ratio="1 / 1"
                cover
                :src="lamduanImageSrc"
                @error="fallbackImage = true"
              ></v-img>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="8">
            <v-card rounded="xl" outlined border elevation="0">
              <v-card-title>
                <span class="text-subtitle-1">{{ $t('textLamduan') }}</span>
              </v-card-title>
              <v-card-text>
                <p class="primary--text">
                  {{ item?.text || $t('noMessage') }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-n1 mb-3">
        <v-spacer />
        <v-btn
          rounded
          variant="flat"
          class="px-5 mr-2"
          color="primary darken-2"
          @click="$emit('confirm')"
          :disabled="evaluation == 'success'"
        >
          <v-icon left> mdi-pencil </v-icon>
          {{ $t('Edit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
