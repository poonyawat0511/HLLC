import type { Filter, FilterContext, FilterItemsFn } from '../types/filter'
import { VSelect, VAutocomplete } from 'vuetify/components'

export function useFilter<T>(
  options: Filter<T>[],
  mode?: 'union' | 'intersection'
) {
  const filters = reactive<Filter<T>[]>(options)

  const filtersMap = new Map(filters.map((filter) => [filter.key, filter]))

  const forward: FilterContext<T>['forward'] = (key: string) => {
    return filtersMap.get(key) as Filter<T> | undefined
  }

  const ctx = (option: Filter<T>): FilterContext<T> => ({
    forward,
    value: option.model,
  })

  const filterItem = (() => {
    if (mode === 'union') {
      return (item: T) =>
        filters.some((option) => {
          return option.filter(ctx(option), item)
        })
    }
    return (item: T) =>
      filters.every((option) => {
        return option.filter(ctx(option), item)
      })
  })()

  function filter(items: T[]) {
    return items.filter((item) => filterItem(item))
  }

  const components = computed(() =>
    filters.map((option) => {
      return {
        component: option.autoComplete ? VAutocomplete : VSelect,
        key: option.key,
        props: {
          modelValue: option.model,
          persistentPlaceholder: true,
          clearable: true,
          variant: 'outlined',
          hideDetails: true,
          multiple: option.multiple,
          label: option.label,
          items: Array.isArray(option.items)
            ? option.items
            : (option.items as FilterItemsFn)(ctx(option)),
          'onUpdate:modelValue': (value: any) => {
            option.model = value
          },
        } satisfies VSelect['$props'],
      }
    })
  )

  return { filter, forward, components }
}
