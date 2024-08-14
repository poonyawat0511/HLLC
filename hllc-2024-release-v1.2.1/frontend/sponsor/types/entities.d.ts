interface SchoolEntity {
  id: string
  name: {
    th: string
    en: string
  }
  acronym: string
  detail: {
    th: string
    en: string
  }
  photos: {
    first?: string
    second?: string
    third?: string
    fourth?: string
  }
}

interface MajorEntity {
  id: string
  name: {
    th: string
    en: string
  }
  acronym: string
  detail: {
    th: string
    en: string
  }
  school?: SchoolEntity
}

interface ThemeEntity {
  id: string
  school: string | SchoolEntity
  assets: Record<string, string>
  colors: Record<string, string>
}

type SettingType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'timestamp'
  | 'image'
  | 'array'

type ArrayValueType = Exclude<SettingType, 'array' | 'image'>

type ArrayValue = {
  [K in ArrayValueType]: {
    type: K
    value?: Setting[K]
  }
}[ArrayValueType]

type SettingValue =
  | Date
  | number
  | string
  | boolean
  | ArrayValue[]
  | null
  | undefined

interface Setting extends Record<SettingType, SettingValue> {
  text: string | null | undefined
  number: number | null | undefined
  date: Date | null | undefined
  time: Date | null | undefined
  timestamp: Date | null | undefined
  image: string | null | undefined
  boolean: boolean | null | undefined
  array: ArrayValue[] | null | undefined
}

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
