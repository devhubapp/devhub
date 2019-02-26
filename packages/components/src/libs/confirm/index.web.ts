import { ConfirmFn } from './index.shared'

export const confirm: ConfirmFn = (
  title,
  message,
  { cancelCallback, confirmCallback },
) => {
  const _message = title && message ? `${title}\n${message}` : message || title

  const result = window.confirm(_message)

  if (result) {
    if (confirmCallback) confirmCallback()
  } else {
    if (cancelCallback) cancelCallback()
  }
}
