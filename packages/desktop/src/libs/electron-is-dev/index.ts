// Source: https://github.com/sindresorhus/electron-is-dev

import electron from 'electron'

const app = electron.app || electron.remote.app

const isEnvSet = 'ELECTRON_IS_DEV' in process.env
const getFromEnv =
  !!process.env.ELECTRON_IS_DEV &&
  parseInt(process.env.ELECTRON_IS_DEV, 10) === 1

export const __DEV__ = isEnvSet ? getFromEnv : !app.isPackaged
