interface SnackbarItem {
  icon?: string
  message: string
  open: boolean
  color?: string
  timeout?: number
}

interface Snackbar {
  items: globalThis.Ref<SnackbarItem[]>
  open(items: SnackbarItem[]): void
}
