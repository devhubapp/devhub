import { EventEmitter } from 'fbemitter'
import { useEffect, useState } from 'react'

import { Platform } from '../libs/platform'

const _emitter = new EventEmitter()

// use local emitter to avoid registering multiple listeners on ipc
if (Platform.isElectron) {
  window.ipc.addListener('update-settings', (...args: any[]) => {
    _emitter.emit('update-settings', ...args)
  })
}

export function useDesktopOptions() {
  const [state, setState] = useState<{
    enablePushNotifications: boolean
    enablePushNotificationsSound: boolean
    isMenuBarMode: boolean
    lockOnCenter: boolean
    openAtLogin: boolean
  }>(
    () =>
      (Platform.isElectron && window.ipc.sendSync('get-all-settings')) || {
        enablePushNotifications: true,
        enablePushNotificationsSound: true,
        isMenuBarMode: false,
        lockOnCenter: false,
        openAtLogin: true,
      },
  )

  useEffect(() => {
    if (!Platform.isElectron) return

    function handler(_e: any, payload?: { settings: string; value: boolean }) {
      if (!(payload && payload.settings)) return
      setState(s => ({ ...s, [payload.settings]: payload.value }))
    }

    const listener = _emitter.addListener('update-settings', handler)

    return () => {
      listener.remove()
    }
  }, [])

  return state
}
