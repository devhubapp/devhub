import path from 'path'

import { __DEV__ } from './libs/electron-is-dev'

export { constants as shared } from '@devhub/core'

export const START_URL = __DEV__
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, 'web/index.html')}`

export const FEATURE_FLAGS = {
  LOCK_ON_CENTER: process.platform !== 'linux',
}

export const FRAME_IS_DIFFERENT_BETWEEN_MODES = process.platform !== 'darwin'
