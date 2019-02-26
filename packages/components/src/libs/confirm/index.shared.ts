export type ConfirmFn = (
  title: string,
  message: string,
  buttons: {
    cancelCallback?: () => void
    cancelLabel?: string
    cancelable?: boolean
    confirmCallback?: () => void
    confirmLabel?: string
    destructive?: boolean
  },
) => void
