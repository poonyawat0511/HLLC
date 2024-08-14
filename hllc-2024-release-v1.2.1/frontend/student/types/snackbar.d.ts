interface Snackbar {
  model: globalThis.Ref<boolean>
  message: globalThis.Ref<string>
  color: globalThis.Ref<string | undefined>
  action: globalThis.Ref<string | undefined>
  onClickAction: globalThis.Ref<(() => void) | undefined>
  open(
    message: string,
    color?: string,
    action?: { label: string; event: () => void }
  ): void
}
