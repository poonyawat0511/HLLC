<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :location="location"
      :max-width="maxWidth"
    >
      <template #activator="{ props: activator }">
        <v-text-field v-model="color" v-bind="{ ...props, ...activator }">
          <template #prepend-inner>
            <v-avatar size="20" :color="color" class="border" />
          </template>
        </v-text-field>
      </template>

      <v-card min-width="300">
        <v-color-picker v-model="color" width="100%" :modes="['hexa']" />
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import type { VTextField, VMenu } from 'vuetify/components'

type TextFieldProps = InstanceType<typeof VTextField>['$props']
type MenuProps = InstanceType<typeof VMenu>['$props']

// Define fake props to let developers know this component can use props of TextFieldProps
interface Props extends /* @vue-ignore */ TextFieldProps {
  location?: MenuProps['location']
  maxWidth?: MenuProps['maxWidth']
}

// Model value definition
const color = defineModel({
  type: String,
  default: '#000000',
})

// Define components props
withDefaults(defineProps<Props>(), {
  location: 'end',
  maxWidth: '300',
})

// Combind fake props with attributes to use as props
const DEFUALT_PROPS: TextFieldProps = {
  variant: 'outlined',
  hideDetails: 'auto',
  rounded: true,
  class: 'text-black',
  clearable: true,
}
const attrs = useAttrs()
const props = computed(() => ({ ...DEFUALT_PROPS, ...attrs }))

const menu = ref(false)
</script>

<style scoped>
/* Add any custom styles here */
</style>
