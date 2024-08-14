<script setup lang="ts">
import type { VCard } from 'vuetify/components'

const colors = defineModel<Record<string, string>>({
  type: Object as PropType<Record<string, string>>,
  default: () => ({}),
})

type VCardProps = InstanceType<typeof VCard>['$props']
type SelectProps = Exclude<VCardProps, 'title' | 'subtitle' | 'action'>

interface Props extends /** @vue-ignore */ SelectProps {
  title?: string
  areaColor?: string
  keys?: string[]
  contentClass?: string
  isChanged?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Color Setting',
  areaColor: 'primary',
  keys: () => [],
  contentClass: '',
  isChanged: false,
})

const DEFAULT_PROPS = {}
const attrs = useAttrs()
const props = computed(() => ({ ...DEFAULT_PROPS, ...attrs }))

const emit = defineEmits(['update', 'click:save', 'click:discard'])

function onUpdate(key: string, value: string) {
  colors.value[key] = value
  emit('update', { key, value })
}
</script>

<template>
  <v-card v-bind="props">
    <v-row dense>
      <v-col cols="12" sm="6" lg="4" style="height: inherit">
        <v-responsive height="auto" width="100%" aspect-ratio="1" class="pa-3">
          <v-sheet
            height="100%"
            width="100%"
            :color="areaColor"
            rounded="lg"
            variant="outlined"
            class="border"
            :class="contentClass"
          >
            <slot :keys="keys" :colors="colors" />
          </v-sheet>
        </v-responsive>
      </v-col>
      <v-divider class="hidden-xs-only" vertical />
      <v-divider class="hidden-sm-and-up" />
      <v-col
        cols="12"
        sm="6"
        lg="8"
        style="height: inherit"
        class="d-flex flex-column justify-start"
      >
        <v-card-title>
          <span>{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col v-for="key in keys" :key="key" cols="12">
              <color-picker
                v-model="colors[key]"
                :label="key"
                rounded
                density="compact"
                location="right"
                @update:model-value="onUpdate(key, $event)"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!isChanged"
            color="error"
            @click="emit('click:discard')"
          >
            <v-icon class="mr-2"> mdi-cancel </v-icon>
            Discard
          </v-btn>
          <v-btn
            :disabled="!isChanged"
            color="success"
            @click="emit('click:save')"
          >
            <v-icon class="mr-2"> mdi-content-save </v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>
