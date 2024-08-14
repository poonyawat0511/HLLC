/* eslint-disable @typescript-eslint/no-explicit-any */

function compareTimestamp(a: any, b: any) {
  // One of them has value, but other not.
  if ((a && !b) || (!a && b)) {
    return false
  }
  // Type of them is not the same
  if (typeof a !== typeof b) {
    return false
  }
  // Both of them is typeof object
  if (typeof a === 'object') {
    // Both of them is null object
    if (!a && !b) return true
    // For now, both are not null objects
    const src = a as TimeStampValue
    const target = b as TimeStampValue
    const sameTime = src.time === target.time
    if (src.date instanceof Date && target.date instanceof Date) {
      return src.date.getTime() === target.date.getTime() && sameTime
    }
    return src.date === target.date && sameTime
  }
  return a === b
}

function compareDate(a: any, b: any) {
  // One of them has value, but other not.
  if ((a && !b) || (!a && b)) {
    return false
  }
  // Type of them is not the same
  if (typeof a !== typeof b) {
    return false
  }
  // Both null
  if (!a && !b) return true

  // Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  return a === b
}

export function compareSetting(
  type: string,
  src: SettingValue,
  target: SettingValue,
  plainDate?: boolean,
): boolean {
  switch (type) {
    case 'array': {
      const isSrcArray = Array.isArray(src)
      const isTargetArray = Array.isArray(target)
      if (isSrcArray !== isTargetArray) return false
      if (isSrcArray && isTargetArray) {
        const srcArray = src as ArrayValue[]
        const targetArray = target as ArrayValue[]
        if (srcArray.length !== targetArray.length) return false
        for (let i = 0; i < srcArray.length; i++) {
          if (srcArray[i].type !== targetArray[i].type) return false
          if (srcArray[i].type === 'timestamp') {
            return compareTimestamp(srcArray[i].value, targetArray[i].value)
          }
          return srcArray[i].value === targetArray[i].value
        }
        return true
      }
      return src === target
    }
    case 'timestamp':
      if (plainDate) return compareDate(src, target)
      return compareTimestamp(src, target)
    case 'date':
      return compareDate(src, target)
    default:
      return src === target
  }
}
