/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ref,
  useApi,
  useDate,
  assignObject,
  getObjectValue,
  objectToFormData,
} from '#imports'
import { compareSetting } from '../utils/compare-setting'
import { settingParser } from '../utils/setting-parser'

class Setting {
  constructor(private item: SettingEntity) {}

  get id() {
    return this.item.id
  }

  get value() {
    return this.item.value
  }

  get key() {
    return this.item.key
  }

  get type() {
    return this.item.type
  }

  toEntity() {
    return this.item
  }

  clone() {
    return new Setting(JSON.parse(JSON.stringify(this.item)))
  }
}

export function useSetting(group: string) {
  const items = ref<Setting[]>([])
  const itemMap = ref<Map<string, Setting>>(new Map())
  const { $api } = useApi()
  const adpater = useDate()

  async function fetch() {
    try {
      const response = await $api.get<ApiResponse<SettingEntity[]>>(
        `settings/group/${group}`,
      )
      items.value = response.data.map(
        (setting: SettingEntity) => new Setting(setting),
      )
      itemMap.value = new Map(
        items.value.map((setting) => [setting.key, setting]),
      )
    } catch (error) {
      items.value = []
    }
  }

  async function update(settings: SettingEntity[]) {
    const response = await Promise.all(
      settings.map(async (setting) => {
        const apiPath = setting.id ? `/settings/${setting.id}` : '/settings'
        const api = setting.id ? $api.put : $api.post
        const response = await api<ApiResponse<SettingEntity>>(apiPath, {
          body: objectToFormData(setting),
        })
        return response.data
      }),
    )
    const updateItemMap = new Map(response.map((item) => [item.id, true]))
    const oldItems = items.value.filter((item) => !updateItemMap.has(item.id))
    items.value = [...oldItems, ...response.map((item) => new Setting(item))]
    itemMap.value = new Map(
      items.value.map((setting) => [setting.key, setting]),
    )
  }

  function toObject<T extends Record<string, any>>(options: SettingOptions[]) {
    const obj = {}
    options.forEach((option) => {
      const item = itemMap.value?.get(`${group}:${option.key}`)
      assignObject(
        obj,
        option.path,
        settingParser.fromDB(
          option.type,
          item?.clone().value,
          adpater,
          option.plainDate,
        ),
      )
    })
    return obj as T
  }

  function toSettings(
    obj: Record<string, any>,
    options: SettingOptions[],
  ): SettingEntity[] {
    return options.map((option) => {
      const value = getObjectValue(obj, option.path)
      const item = itemMap.value?.get(`${group}:${option.key}`)
      return {
        id: item?.id,
        group,
        key: `${group}:${option.key}`,
        value: settingParser.toDB(
          option.type,
          value,
          adpater,
          option.plainDate,
        ),
        type: option.type,
        description: option.description,
      }
    })
  }

  function compare(
    options: SettingOptions[],
    obj: Record<string, any>,
    obj2: Record<string, any>,
  ) {
    return options.every((option) => {
      return compareSetting(
        option.type,
        getObjectValue(obj, option.path),
        getObjectValue(obj2, option.path),
      )
    })
  }

  return { fetch, items, toObject, toSettings, compare, update }
}
