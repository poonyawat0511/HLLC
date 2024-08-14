/* eslint-disable @typescript-eslint/no-explicit-any */
class PathNotFoundError extends Error {
  constructor(path: string) {
    super(`Path not found: ${path}`)
    this.name = 'PathNotFoundError'
  }
}

export function assignObject(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  let currentObj = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (
      !(key in currentObj) ||
      currentObj[key] === null ||
      currentObj[key] === undefined
    ) {
      currentObj[key] = {}
    }
    currentObj = currentObj[key]
  }

  currentObj[keys[keys.length - 1]] = value
}

export function getObjectValue(
  obj: Record<string, any>,
  path: string,
  throwError: boolean = false,
): any {
  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      if (throwError) {
        throw new PathNotFoundError(path)
      }
      return undefined
    }
  }

  return current
}
