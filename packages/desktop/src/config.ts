import Store from 'electron-store'

import * as constants from './constants'
import * as ipc from './ipc'

export const store = new Store({
  defaults: {
    enablePushNotifications: undefined,
    enablePushNotificationsSound: undefined,
    isMenuBarMode: false,
    isMenuBarModeChangedAt: null,
    launchCount: 0,
    lockOnCenter: false,
    openAtLoginChangeCount: 0,
  },
})

if (!constants.FEATURE_FLAGS.LOCK_ON_CENTER && store.get('lockOnCenter')) {
  ipc.emit('update-settings', {
    settings: 'lockOnCenter',
    value: false,
  })
}
