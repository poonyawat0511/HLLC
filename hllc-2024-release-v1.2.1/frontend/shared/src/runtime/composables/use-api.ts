import { useNuxtApp } from '#app'

export const useApi = () => {
  const { $api } = useNuxtApp()
  return { $api }
}
