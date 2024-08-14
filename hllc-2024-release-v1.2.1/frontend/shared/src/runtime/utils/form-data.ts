import { serialize } from 'object-to-formdata'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectToFormData<T extends Record<string, any>>(obj: T) {
  return serialize(obj, { indices: true })
}
