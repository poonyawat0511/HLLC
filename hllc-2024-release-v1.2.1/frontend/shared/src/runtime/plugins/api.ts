import { defineNuxtPlugin, useFetch, useRuntimeConfig } from '#app'
import { useAuth } from '#imports'

export default defineNuxtPlugin((_) => {
  const { baseURL } = useRuntimeConfig().public
  const { token, status, refreshToken, refresh } = useAuth()

  type Fetch<T> = Parameters<typeof useFetch<T>>
  type Request<T> = Parameters<typeof $fetch<T>>
  type Method = 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE'
  type RequestOptions<T> = Request<T>['1'] | Fetch<T>['1']

  async function createRequestOption<T>(
    options?: RequestOptions<T>,
  ): Promise<RequestOptions<T>> {
    const { headers, ...otherOptions } = options || {}
    if (status.value === 'unauthenticated' && refreshToken.value) {
      await refresh()
    }
    const customHeaders = Object.assign({ Authorization: token.value }, headers)
    return {
      baseURL,
      headers: customHeaders,
      ...otherOptions,
    } as RequestOptions<T>
  }

  const createRequestMethod = (method: Method) => {
    return async function <T>(
      path: Request<T>['0'],
      options?: Request<T>['1'],
    ) {
      const requestOptions = (await createRequestOption<T>({
        method,
        ...options,
      })) as Request<T>['1']
      return $fetch<T>(path, requestOptions)
    }
  }
  return {
    provide: {
      api: {
        get: createRequestMethod('GET'),
        post: createRequestMethod('POST'),
        put: createRequestMethod('PATCH'),
        delete: createRequestMethod('DELETE'),
        useFetch<T>(path: Fetch<T>['0'], options?: Fetch<T>['1']) {
          return useFetch<T>(
            path,
            createRequestOption<T>(options) as Fetch<T>['1'],
          )
        },
      },
    },
  }
})
