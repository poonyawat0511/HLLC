type SettingType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'timestamp'
  | 'image'
  | 'array'

type TimeStampValue = { date?: Date | string | null; time?: string | null }

type SettingValue =
  | Date
  | number
  | string
  | boolean
  | ArrayValue[]
  | null
  | undefined
  | TimeStampValue

type ArrayValueType = Exclude<SettingType, 'array' | 'image'>

type ArrayValue = {
  [K in ArrayValueType]: {
    type: K
    value?: SettingPick[K]
  }
}[ArrayValueType]

interface SettingPick extends Record<SettingType, SettingValue> {
  text: string | null | undefined
  number: number | null | undefined
  date: Date | null | undefined
  time: Date | null | undefined
  timestamp: TimeStampValue | null | undefined
  image: string | null | undefined
  boolean: boolean | null | undefined
  array: ArrayValue[] | null | undefined
}

type Setting = {
  [K in SettingType]: {
    value?: SettingPick[K]
    type: K
  }
}[SettingType]

type SettingEntity = {
  [K in SettingType]: {
    id?: string
    key: string
    value?: Setting[K]
    type: K
    group?: string
    description?: string
  }
}[SettingType]

interface SettingOptions {
  path: string
  type: SettingType
  key: string
  description?: string
  plainDate?: boolean
}
