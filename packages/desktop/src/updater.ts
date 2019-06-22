import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

import * as menu from './menu'

let updateInfo: {
  state:
    | 'not-checked'
    | 'error'
    | 'checking-for-update'
    | 'update-not-available'
    | 'update-available'
    | 'downloading'
    | 'update-downloaded'
  date: number
  progress?: number
  lastManuallyCheckedAt?: number
} = {
  state: 'not-checked',
  date: Date.now(),
}

export async function init() {
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.checkForUpdatesAndNotify()

  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify()
  }, 60 * 60 * 1000)
}

export function getUpdateInfo() {
  return updateInfo
}

export function getAutoUpdater() {
  return autoUpdater
}

export async function checkForUpdatesAndNotify() {
  return autoUpdater.checkForUpdatesAndNotify()
}

export function register() {
  autoUpdater.on('error', () => {
    updateInfo = { ...updateInfo, state: 'error', date: Date.now() }
    menu.updateMenu()
  })

  autoUpdater.on('checking-for-update', () => {
    updateInfo = {
      ...updateInfo,
      state: 'checking-for-update',
      date: Date.now(),
    }
    menu.updateMenu()
  })

  autoUpdater.on('update-not-available', () => {
    const fromManualCheck =
      updateInfo.lastManuallyCheckedAt &&
      Date.now() - updateInfo.lastManuallyCheckedAt < 10000

    updateInfo = {
      ...updateInfo,
      state: 'update-not-available',
      date: Date.now(),
    }
    menu.updateMenu()

    if (fromManualCheck) {
      dialog.showMessageBox({
        message: 'There are currently no updates available.',
      })
    }
  })

  autoUpdater.on('update-available', () => {
    updateInfo = { ...updateInfo, state: 'update-available', date: Date.now() }
    menu.updateMenu()
  })

  autoUpdater.on('download-progress', e => {
    updateInfo = {
      ...updateInfo,
      state: 'downloading',
      progress: e.percent,
      date: Date.now(),
    }
    menu.updateMenu()
  })

  autoUpdater.on('update-downloaded', () => {
    updateInfo = { ...updateInfo, state: 'update-downloaded', date: Date.now() }
    menu.updateMenu()
  })
}
