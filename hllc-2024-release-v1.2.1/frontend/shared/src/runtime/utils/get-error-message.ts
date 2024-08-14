import { FetchError } from 'ofetch'

export function getErrorMessage(error: FetchError | Error | unknown) {
  if (error instanceof FetchError) {
    return error.response?._data?.message
  }
  return 'Unknown error occurred'
}
