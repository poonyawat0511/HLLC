<script setup lang="ts">
import type { VBtn, VCard } from 'vuetify/components'

const dialog = defineModel<boolean>({ default: false })
type VCardProps = InstanceType<typeof VCard>['$props']

export interface ButtonOption {
  text: string
  actions?: Record<string, () => void>
  props?: InstanceType<typeof VBtn>['$props']
}

interface Props extends /* @vue-ignore */ VCardProps {
  image?: string
  title?: string
  details?: string
  buttons: ButtonOption[]
}

const props = withDefaults(defineProps<Props>(), {
  image: '',
  title: '',
  details: '',
})

const cardProps = computed(() => {
  const { image, title, details, buttons, ...cardProps } = props
  return cardProps
})
</script>

<template>
  <v-dialog v-model="dialog" max-width="25rem" persistent>
    <v-card class="rounded-xl text-center" v-bind="cardProps">
      <div class="d-flex justify-center mt-4">
        <v-img
          :src="image"
          :max-width="$vuetify.display.smAndDown ? '4rem' : '5rem'"
        />
      </div>
      <v-card-text>
        <h2 class="mt-4 mb-4">{{ title }}</h2>
        <span class="text-body-1 font-weight-bold" style="color: gray">
          <slot name="title" :title="title"> {{ details }} </slot>
        </span>
      </v-card-text>
      <v-card-actions class="justify-center">
        <div class="my-4">
          <slot name="actions">
            <v-btn
              v-for="(button, i) in buttons"
              :key="i"
              v-bind="button.props"
              v-on="button.actions ?? {}"
            >
              <v-responsive min-width="7rem"> {{ button.text }} </v-responsive>
            </v-btn>
          </slot>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
