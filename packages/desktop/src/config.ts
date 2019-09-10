import Store from 'electron-store'

import * as constants from './constants'
import * as ipc from './ipc'

export const store = new Store({
  defaults: {
    openAtLoginChangeCount: 0,
    lockOnCenter: false,
    launchCount: 0,
    isMenuBarMode: false,
  },
})

if (!constants.FEATURE_FLAGS.LOCK_ON_CENTER && store.get('lockOnCenter')) {
  ipc.emit('update-settings', {
    settings: 'lockOnCenter',
    value: false,
  })
}
