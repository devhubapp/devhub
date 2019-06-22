import Store from 'electron-store'

import * as constants from './constants'

export const store = new Store({
  defaults: {
    openAtLoginChangeCount: 0,
    lockOnCenter: false,
    launchCount: 0,
    isMenuBarMode: false,
  },
})

if (!constants.FEATURE_FLAGS.LOCK_ON_CENTER && store.get('lockOnCenter')) {
  store.set('lockOnCenter', false)
}
