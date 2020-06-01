import { Alert } from 'react-native'

import { ConfirmFn } from './index.shared'

export const confirm: ConfirmFn = (
  title,
  message,
  {
    cancelCallback,
    cancelLabel,
    cancelable = true,
    confirmCallback,
    confirmLabel,
    destructive = false,
  },
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: confirmLabel || 'Ok',
        onPress: confirmCallback || (() => undefined),
        style: destructive ? 'destructive' : undefined,
      },
      {
        text: cancelLabel || 'Cancel',
        onPress: cancelCallback || (() => undefined),
        style: 'cancel',
      },
    ],
    { cancelable },
  )
}
