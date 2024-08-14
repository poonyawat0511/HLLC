export function useRules() {
  const { $rules } = useNuxtApp()
  return { $rules }
}
