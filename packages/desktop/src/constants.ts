import path from 'path'

import { constants as shared } from '@devhub/core'
import { __DEV__ } from './libs/electron-is-dev'

export { shared }

export const START_URL = __DEV__
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, 'web/index.html')}`

export const FEATURE_FLAGS = {
  OPEN_AT_LOGIN: process.platform !== 'linux',
  LOCK_ON_CENTER: process.platform !== 'linux',
}

export const FRAME_IS_DIFFERENT_BETWEEN_MODES = process.platform !== 'darwin'

// License: https://notificationsounds.com/notification-sounds/unsure-566
export const notificationSoundPath = __DEV__
  ? path.join(__dirname, '../assets/sounds/notification.mp3')
  : path.join(process.resourcesPath!, 'assets/sounds/notification.mp3')
