import { app, dialog, Notification } from 'electron'
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
  version?: string
} = {
  state: 'not-checked',
  date: Date.now(),
}

export async function init() {
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  checkForUpdatesAndNotify()
  setInterval(checkForUpdatesAndNotify, 60 * 60 * 1000)
}

export function getUpdateInfo() {
  return updateInfo
}

export function getAutoUpdater() {
  return autoUpdater
}

let shouldNotify = false
export async function checkForUpdatesAndNotify() {
  try {
    await autoUpdater.checkForUpdates()
    shouldNotify = true
  } catch (error) {
    console.error(error)
  }
}

function notify() {
  const version =
    updateInfo.version && updateInfo.version.startsWith('v')
      ? updateInfo.version.slice(1)
      : updateInfo.version

  const notification = new Notification({
    title: version
      ? `🚀 ${app.getName()} v${version} is now available`
      : '🚀 New version available',
    body: 'Restart the app to update it.',
  })

  notification.on('click', e => {
    autoUpdater.quitAndInstall()
  })

  notification.show()
}

export function register() {
  autoUpdater.removeAllListeners('error')
  autoUpdater.addListener('error', () => {
    updateInfo = { ...updateInfo, state: 'error', date: Date.now() }
    menu.updateMenu()
  })

  autoUpdater.removeAllListeners('checking-for-update')
  autoUpdater.addListener('checking-for-update', () => {
    updateInfo = {
      ...updateInfo,
      state: 'checking-for-update',
      date: Date.now(),
    }
    menu.updateMenu()
  })

  autoUpdater.removeAllListeners('update-not-available')
  autoUpdater.addListener('update-not-available', () => {
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

  autoUpdater.removeAllListeners('update-available')
  autoUpdater.addListener('update-available', () => {
    updateInfo = { ...updateInfo, state: 'update-available', date: Date.now() }
    menu.updateMenu()
  })

  autoUpdater.removeAllListeners('download-progress')
  autoUpdater.addListener('download-progress', e => {
    updateInfo = {
      ...updateInfo,
      state: 'downloading',
      progress: e.percent,
      date: Date.now(),
    }
    menu.updateMenu()
  })

  autoUpdater.removeAllListeners('update-downloaded')
  autoUpdater.addListener('update-downloaded', info => {
    updateInfo = {
      ...updateInfo,
      state: 'update-downloaded',
      date: Date.now(),
      version: info && info.version,
    }
    menu.updateMenu()

    if (shouldNotify) notify()
  })
}
