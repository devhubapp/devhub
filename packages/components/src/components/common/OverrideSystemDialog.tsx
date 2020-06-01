import React, { useEffect } from 'react'
import { Alert as AlertOriginal } from 'react-native'

import { useDialog } from '../context/DialogContext'

const _alert = window.alert
const _Alert = { alert: AlertOriginal.alert, prompt: AlertOriginal.prompt }

export const OverrideSystemDialog = React.memo(() => {
  const Dialog = useDialog()

  useEffect(() => {
    function alert(message?: string): void {
      Dialog.show(undefined, message)
    }
    window.alert = alert

    const Alert = {
      alert: Dialog.show,
      // prompt: Dialog.show,
    }
    AlertOriginal.alert = Alert.alert
    // AlertOriginal.prompt = Alert.prompt

    return () => {
      if (window.alert === alert) window.alert = _alert

      if (AlertOriginal.alert === Alert.alert)
        AlertOriginal.alert = _Alert.alert

      // if (AlertOriginal.prompt === Alert.prompt)
      //   AlertOriginal.prompt = _Alert.prompt

      Dialog.hide()
    }
  }, [])

  return null
})

OverrideSystemDialog.displayName = 'OverrideSystemDialog'
