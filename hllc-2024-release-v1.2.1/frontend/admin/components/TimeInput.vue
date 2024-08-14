<script setup lang="ts">
import type { VList, VTextField } from 'vuetify/components'

type TextFieldProps = VTextField['$props']

interface Props extends /** @vue-ignore */ TextFieldProps {
  readonly?: boolean
  activatorColor?: string
}

withDefaults(defineProps<Props>(), {
  readonly: false,
  activatorColor: 'grey-lighten-2',
})

const input = ref<VTextField | null>(null)

const model = defineModel<string>()

type ListProps = VList['$props']

const hour = ref<string>()
const minute = ref<string>()

const hours: ListProps['items'] = Array(24)
  .fill(0)
  .map((_, index) => `${index}`.padStart(2, '0'))
  .map((time) => ({ title: time, value: time }))

const minutes: ListProps['items'] = Array(60)
  .fill(0)
  .map((_, index) => `${index}`.padStart(2, '0'))
  .map((time) => ({ title: time, value: time }))

const menu = reactive({
  hour: false,
  minute: false,
})

const attrs = useAttrs()

const selectProps = computed(() => {
  return { density: attrs.density as ListProps['density'] }
})

const props = computed(() => {
  const { readonly, placeholder, rules, ...props } = attrs
  return props
})

const rules = computed(() => {
  if (!Array.isArray(attrs.rules)) return
  return attrs.rules.map((rule) => rule(model.value))
})

watch(
  () => menu.hour,
  (v) => {
    if (v) menu.minute = false
  }
)

watch(
  () => menu.minute,
  (v) => {
    if (v) menu.hour = false
  }
)

function getValue() {
  if (!hour.value || !minute.value) return undefined
  return `${hour.value}:${minute.value}`
}

watch(
  () => model.value,
  (value) => {
    if (value && value.includes(':')) {
      const [hourStr, minuteStr] = value.split(':')
      hour.value = hourStr
      minute.value = minuteStr
    } else {
      hour.value = undefined
      minute.value = undefined
    }
  },
  { immediate: true }
)

const onSelectHour: ListProps['onClick:activate'] = ({ id }) => {
  hour.value = id as string
  model.value = getValue()
  nextTick(() => {
    input.value?.validate()
  })
}

const onSelectMinute: ListProps['onClick:activate'] = ({ id }) => {
  minute.value = id as string
  model.value = getValue()
  nextTick(() => {
    input.value?.validate()
  })
}
</script>

<template>
  <div>
    <v-text-field
      ref="input"
      readonly
      persistent-placeholder
      :rules="rules"
      v-bind="props"
    >
      <template v-for="(slot, name) in $slots" :key="name" #[name]="slotProps">
        <component :is="slot" v-bind="slotProps" />
      </template>
      <div class="d-flex">
        <v-btn height="inherit" block variant="flat" :color="activatorColor">
          {{ hour || '--' }}
          <v-menu
            v-model="menu.hour"
            location="bottom"
            activator="parent"
            height="20rem"
          >
            <v-list
              v-bind="selectProps"
              activatable
              :activated="hour"
              :items="hours"
              @click:activate="onSelectHour"
            />
          </v-menu>
        </v-btn>
        <span class="mx-2"> : </span>
        <v-btn height="inherit" variant="flat" block :color="activatorColor">
          {{ minute || '--' }}
          <v-menu
            v-model="menu.minute"
            location="bottom"
            activator="parent"
            height="20rem"
          >
            <v-list
              v-bind="selectProps"
              activatable
              :activated="minute"
              :items="minutes"
              @click:activate="onSelectMinute"
            />
          </v-menu>
        </v-btn>
      </div>
    </v-text-field>
  </div>
</template>
