import type { VSelect } from 'vuetify/components'

type FilterContext<T> = {
  forward: (key: string) => Filter<T> | undefined
  value: VSelect['$props']['modelValue']
}

interface FilterItem {
  title: string
  value: unknown
}

type FilterItemsFn = (ctx: FilterContext<T>) => FilterItem[]

interface Filter<T> {
  multiple?: boolean
  model: VSelect['$props']['modelValue']
  autoComplete?: boolean
  key: string
  label: string
  items: FilterItem[] | FilterItemsFn
  filter: (ctx: FilterContext<T>, item: T) => boolean
}
