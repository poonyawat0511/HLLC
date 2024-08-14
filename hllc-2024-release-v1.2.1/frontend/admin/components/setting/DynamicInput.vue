<script setup lang="ts">
import type { VTextField } from 'vuetify/components'

type TextFieldProps = InstanceType<typeof VTextField>['$props']

interface Props extends /** @vue-ignore */ TextFieldProps {
  type: SettingType
}
const props = defineProps<Props>()

const model = defineModel<Setting[typeof props.type]>()

watch(
  () => props.type,
  (type) => {
    if (type === 'array') {
      if (!Array.isArray(model.value) || model.value.length === 0) {
        model.value = [{ value: '', type: 'text' }]
      }
    }
  }
)

function onChangeArrayType(item: ArrayValue, type: ArrayValue['type']) {
  item.type = type
  item.value = undefined
}

function insertItemAt(index: number) {
  if (props.type === 'array' && Array.isArray(model.value)) {
    model.value.splice(index, 0, { value: '', type: 'text' })
  }
}

function removeItemAt(index: number) {
  if (props.type === 'array' && Array.isArray(model.value)) {
    model.value.splice(index, 1)
  }
}
</script>

<template>
  <div>
    <template v-if="type === 'boolean'">
      <v-select
        v-model="model"
        v-bind="$attrs"
        placeholder="Boolean"
        :items="[
          { title: 'True', value: true },
          { title: 'False', value: false },
        ]"
        v-on="$attrs"
      >
        <template
          v-for="(slot, name) in $slots"
          :key="name"
          #[name]="slotProps"
        >
          <component :is="slot" v-bind="slotProps" />
        </template>
      </v-select>
    </template>
    <template v-else-if="type === 'date'">
      <date-input
        v-model="model"
        placeholder="Select date"
        v-bind="$attrs"
        v-on="$attrs"
      >
        <template
          v-for="(slot, name) in $slots"
          :key="name"
          #[name]="slotProps"
        >
          <component :is="slot" v-bind="slotProps" />
        </template>
      </date-input>
    </template>
    <template v-else-if="type === 'time'">
      <time-input
        v-model="model"
        placeholder="Select date"
        v-bind="$attrs"
        v-on="$attrs"
      >
        <template
          v-for="(slot, name) in $slots"
          :key="name"
          #[name]="slotProps"
        >
          <component :is="slot" v-bind="slotProps" />
        </template>
      </time-input>
    </template>
    <template v-else-if="type === 'array'">
      <v-row dense :no-gutters="$vuetify.display.smAndDown">
        <template v-for="(item, i) in model as ArrayValue[]" :key="i">
          <v-col cols="12" md="4">
            <v-select
              v-bind="$attrs"
              density="compact"
              hide-details
              :model-value="item.type"
              :items="[
                'text',
                'number',
                'boolean',
                'date',
                'time',
                'timestamp',
              ]"
              @update:model-value="onChangeArrayType(item, $event)"
            >
              <template #prepend>
                <v-avatar> {{ i }} </v-avatar>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="8">
            <setting-dynamic-input
              v-model="item.value"
              v-bind="$attrs"
              :type="item.type"
              hide-details
              density="compact"
              @click:append="() => {}"
            >
              <template #prepend>
                <v-avatar class="hidden-md-and-up" />
              </template>
              <template #append>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  :disabled="i === 0"
                  @click.stop="removeItemAt(i)"
                >
                  <v-icon> mdi-minus </v-icon>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click.stop="insertItemAt(i)"
                >
                  <v-icon> mdi-plus </v-icon>
                </v-btn>
              </template>
            </setting-dynamic-input>
          </v-col>
        </template>
      </v-row>
    </template>
    <template v-else>
      <v-text-field
        v-model="model"
        v-bind="$attrs"
        :placeholder="type"
        :type="type"
        v-on="$attrs"
      >
        <template
          v-for="(slot, name) in $slots"
          :key="name"
          #[name]="slotProps"
        >
          <component :is="slot" v-bind="slotProps" />
        </template>
      </v-text-field>
    </template>
  </div>
</template>
