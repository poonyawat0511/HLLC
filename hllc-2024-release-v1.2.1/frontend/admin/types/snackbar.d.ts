interface Snackbar {
  model: globalThis.Ref<boolean>
  message: globalThis.Ref<string>
  color: globalThis.Ref<string | undefined>
  open(message: string, color?: string): void
}
