import type { useDate } from '#imports'

/* eslint-disable @typescript-eslint/no-explicit-any */
type DateAdapter = ReturnType<typeof useDate>

const getter = {
  parseText(value: any) {
    if (typeof value !== 'string') return
    return value
  },
  parseNumber(value: any) {
    if (typeof value !== 'number') return
    return value
  },
  parseBoolean(value: any) {
    if (typeof value !== 'boolean') return
    return value
  },
  parseImage(value: any) {
    if (typeof value === 'string') return value
    return
  },
  parseTime(value: any, adapter: DateAdapter) {
    if (!adapter.isValid(value)) return
    const time = adapter.format(value, 'fullTime24h')
    return time.split(':').slice(0, 2).join(':')
  },
  parseDate(value: any, adapter: DateAdapter) {
    const date = adapter.date(value)
    if (!date) return
    return adapter.toJsDate(date)
  },
  parseDateTime(value: any, adapter: DateAdapter) {
    const date = adapter.date(value)
    if (!date) return { date: null, time: null }
    return {
      date: this.parseDate(date, adapter) as Date,
      time: this.parseTime(date, adapter),
    }
  },
  parseArray(
    value: any,
    adapter: DateAdapter,
    plainDate?: boolean,
  ): ArrayValue[] {
    if (!Array.isArray(value)) return [{ type: 'text', value: '' }]
    return value.map((each) => {
      switch (each.type) {
        case 'text':
          return { type: each.type, value: this.parseText(each.value) }
        case 'number':
          return { type: each.type, value: this.parseNumber(each.value) }
        case 'boolean':
          return { type: each.type, value: this.parseNumber(each.value) }
        case 'time':
          return { type: each.type, value: this.parseTime(each.value, adapter) }
        case 'date':
          return { type: each.type, value: this.parseDate(each.value, adapter) }
        case 'timestamp':
          return {
            type: each.type,
            value: plainDate
              ? this.parseDate(value, adapter)
              : this.parseDateTime(value, adapter),
          }
      }
    }) as ArrayValue[]
  },
}

const setter = {
  parseText(value: any) {
    if (typeof value !== 'string') return
    return value
  },
  parseNumber(value: any) {
    if (typeof value === 'string') {
      const number = Number.parseInt(value)
      if (Number.isNaN(number)) return
      return number
    }
    if (typeof value !== 'number') return
    return value
  },
  parseBoolean(value: any) {
    if (typeof value !== 'boolean') return
    return value
  },
  parseImage(value: any) {
    if (typeof value === 'string') return value
    if (value instanceof File) return value
    return ''
  },
  parseDate(value: any, adapter: DateAdapter) {
    if (!adapter.isValid(value)) return
    return adapter.toJsDate(value).toISOString()
  },
  parseTime(value: any) {
    if (typeof value !== 'string') return
    if (!value.includes(':')) return
    const [hour, minute] = value.split(':').map(Number)
    const date = new Date()
    date.setHours(hour, minute, 0)
    return date
  },
  parseDateTime(value: any, adapter: DateAdapter) {
    if (typeof value !== 'object') return
    if (!value?.date || !value?.time) return
    if (!adapter.isValid(value.date) || !value.time.includes(':')) return
    const date = adapter.toJsDate(adapter.date(value.date))
    const [hour, minute] = value.time.split(':').map(Number)
    date.setHours(hour, minute, 0)
    return date
  },
  parseArray(value: any, adapter: DateAdapter, plainDate?: boolean) {
    if (!Array.isArray(value)) return value
    return value
      .filter((each) => !!each.type)
      .map((each) => {
        switch (each.type) {
          case 'text':
            return { type: each.type, value: this.parseText(each.value) }
          case 'number':
            return { type: each.type, value: this.parseNumber(each.value) }
          case 'boolean':
            return { type: each.type, value: this.parseNumber(each.value) }
          case 'date':
            return {
              type: each.type,
              value: this.parseDate(each.value, adapter),
            }
          case 'time':
            return { type: each.type, value: this.parseTime(each.value) }
          case 'timestamp':
            return {
              type: each.type,
              value: plainDate
                ? this.parseDate(each.value, adapter)
                : this.parseDateTime(each.value, adapter),
            }
          default:
            return
        }
      })
  },
}

export const settingParser = {
  fromDB(
    type: SettingType,
    value: unknown,
    adapter: DateAdapter,
    plainDate?: boolean,
  ): SettingValue {
    switch (type) {
      case 'text':
        return getter.parseText(value)
      case 'number':
        return getter.parseNumber(value)
      case 'boolean':
        return getter.parseNumber(value)
      case 'time':
        return getter.parseTime(value, adapter)
      case 'date':
        return getter.parseDate(value, adapter)
      case 'timestamp':
        if (plainDate) return getter.parseDate(value, adapter)
        return getter.parseDateTime(value, adapter)
      case 'image':
        return getter.parseImage(value)
      case 'array':
        return getter.parseArray(value, adapter, plainDate)
      default:
        return value as SettingValue
    }
  },

  toDB(
    type: SettingType,
    value: SettingValue,
    adapter: DateAdapter,
    plainDate?: boolean,
  ) {
    switch (type) {
      case 'text':
        return setter.parseText(value)
      case 'number':
        return setter.parseNumber(value)
      case 'boolean':
        return setter.parseNumber(value)
      case 'date':
        return setter.parseDate(value, adapter)
      case 'time':
        return setter.parseTime(value)
      case 'timestamp':
        if (plainDate) return setter.parseDate(value, adapter)
        return setter.parseDateTime(value, adapter)
      case 'image':
        return setter.parseImage(value)
      case 'array':
        return setter.parseArray(value, adapter, plainDate)
      default:
        return
    }
  },
}
