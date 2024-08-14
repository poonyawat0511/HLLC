export function useEvolution() {
  const setting = useState<EvolutionSetting>('evolution:setting', () => ({
    level1: 99,
    level2: 99,
    level3: 99,
    images: {
      mission: '',
      item: '',
      secret: '',
    },
  }))
  const settingOptions: SettingOptions[] = [
    {
      path: 'level1',
      key: 'level1',
      type: 'number',
    },
    {
      path: 'level2',
      key: 'level2',
      type: 'number',
    },
    {
      path: 'level3',
      key: 'level3',
      type: 'number',
    },
    {
      key: 'image:mission',
      path: 'images.mission',
      type: 'image',
    },
    {
      key: 'image:item',
      path: 'images.item',
      type: 'image',
    },
    {
      key: 'image:secret',
      path: 'images.secret',
      type: 'image',
    },
  ]

  const { $api } = useApi()
  const { data: user } = useAuth()
  const { fetch: fetchSettings, toObject } = useSetting('evolution')

  const items = useState<Item[]>('evolution:items', () => [])

  const usedItems = computed(() => {
    return items.value.filter((item) => item.evolution?.isUsed)
  })

  const itemsPerLevel = computed<Record<number, number>>(() => {
    return {
      1: setting.value.level1,
      2: setting.value.level2 - setting.value.level1,
      3: setting.value.level3 - setting.value.level2,
      4: items.value.length - setting.value.level3,
    }
  })

  const readyItems = computed(() => {
    return items.value.filter(
      (item) => item.evolution && !item.evolution.isUsed
    )
  })

  const currentLevel = computed<number>(() => {
    if (items.value.length === 0) return 1
    if (usedItems.value.length >= setting.value.level3) return 4
    if (usedItems.value.length >= setting.value.level2) return 3
    if (usedItems.value.length >= setting.value.level1) return 2
    return 1
  })

  const currentItems = computed<Item[]>(() => {
    if (usedItems.value.length >= setting.value.level3) {
      return usedItems.value.slice(setting.value.level3)
    }
    if (usedItems.value.length >= setting.value.level2) {
      return usedItems.value.slice(setting.value.level2)
    }
    if (usedItems.value.length >= setting.value.level1) {
      return usedItems.value.slice(setting.value.level1)
    }
    return usedItems.value
  })

  async function fetchItems() {
    try {
      const response = await $api.get<ApiResponse<Item[]>>(
        `/users/${user.value.id}/items`
      )
      items.value = response.data
    } catch (error) {
      console.error('Error fetching items', error)
      items.value = []
    }
  }

  async function getSettings() {
    await fetchSettings()
    setting.value = toObject<EvolutionSetting>(settingOptions)
  }

  async function evolve(
    item: Item,
    callback: (item: Item, next: () => void) => void
  ) {
    const response = await $api.put<ApiResponse<Evolution>>(
      `/evolutions/${item.evolution!.id}`,
      {
        body: { isUsed: true },
      }
    )
    const index = items.value.findIndex((each) => each.id === item.id)!
    const target = items.value[index]
    callback(
      JSON.parse(JSON.stringify({ ...target, evolution: response.data })),
      () => {
        target.evolution = response.data
      }
    )
  }

  async function init() {
    await getSettings()
    await fetchItems()
  }

  return {
    init,
    evolve,
    items,
    setting,
    usedItems,
    currentLevel,
    readyItems,
    itemsPerLevel,
    currentItems,
  }
}
