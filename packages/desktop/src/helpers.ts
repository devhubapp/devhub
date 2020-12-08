import { app, BrowserWindow, dialog, nativeImage, Tray } from 'electron'
import fetch from 'electron-fetch'
import path from 'path'

import * as constants from './constants'
import { __DEV__ } from './libs/electron-is-dev'
import { playAudioFile } from './libs/play-sound'
import { getMainWindow } from './window'

export function registerAppSchema() {
  unregisterAppSchema()
  if (__DEV__ && process.platform === 'win32') {
    app.setAsDefaultProtocolClient(
      constants.shared.APP_DEEP_LINK_SCHEMA,
      process.execPath,
      [path.resolve(process.argv[1])],
    )
  } else {
    app.setAsDefaultProtocolClient(constants.shared.APP_DEEP_LINK_SCHEMA)
  }
}

export function unregisterAppSchema() {
  if (__DEV__ && process.platform === 'win32') {
    app.removeAsDefaultProtocolClient(
      constants.shared.APP_DEEP_LINK_SCHEMA,
      process.execPath,
      [path.resolve(process.argv[1])],
    )
  } else {
    app.removeAsDefaultProtocolClient(constants.shared.APP_DEEP_LINK_SCHEMA)
  }
}

export function isDefaultAppSchema() {
  return __DEV__ && process.platform === 'win32'
    ? app.isDefaultProtocolClient(
        constants.shared.APP_DEEP_LINK_SCHEMA,
        process.execPath,
        [path.resolve(process.argv[1])],
      )
    : app.isDefaultProtocolClient(constants.shared.APP_DEEP_LINK_SCHEMA)
}

export function showWindow(win: BrowserWindow) {
  if (win.isMinimized()) win.restore()
  if (win.isVisible()) win.focus()
  win.show()
}

export function getCenterPosition(
  obj: Pick<BrowserWindow | Tray, 'getBounds'>,
) {
  const bounds = obj.getBounds()

  const x = Math.round(bounds.x + bounds.width / 2)
  const y = Math.round(bounds.y + bounds.height / 2)

  return { x, y }
}

export async function imageURLToNativeImage(imageURL: string | undefined) {
  if (!imageURL) return undefined

  try {
    const response = await fetch(imageURL)
    const arrayBuffer = await response.arrayBuffer()

    return nativeImage.createFromBuffer(Buffer.from(arrayBuffer))
  } catch (error) {
    console.error(error)
    if (__DEV__ && getMainWindow()) {
      void dialog.showMessageBox(getMainWindow()!, { message: `${error}` })
    }
  }
}

let lastNotificationSoundPlayedAt: string
export function playNotificationSound() {
  if (
    lastNotificationSoundPlayedAt &&
    Date.now() - new Date(lastNotificationSoundPlayedAt).getTime() < 3000
  ) {
    return
  }

  lastNotificationSoundPlayedAt = new Date().toISOString()
  playAudioFile(constants.notificationSoundPath)
}
