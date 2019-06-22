import { BrowserWindow, Tray } from 'electron'

import * as config from './config'
import * as window from './window'

export function showWindow(win: BrowserWindow) {
  if (win.isMinimized()) win.restore()
  if (win.isVisible()) win.focus()
  else win.show()
}

export function getCenterPosition(obj: BrowserWindow | Tray) {
  const bounds = obj.getBounds()

  const x = Math.round(bounds.x + bounds.width / 2)
  const y = Math.round(bounds.y + bounds.height / 2)

  return { x, y }
}

export function enableDesktopMode() {
  config.store.set('isMenuBarMode', false)

  const mainWindow = window.getMainWindow()
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false)
    setTimeout(window.updateOrRecreateWindow, 1000)
  } else {
    window.updateOrRecreateWindow()
  }
}

export function enableMenuBarMode() {
  config.store.set('isMenuBarMode', true)

  const mainWindow = window.getMainWindow()
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false)
    setTimeout(window.updateOrRecreateWindow, 1000)
  } else {
    window.updateOrRecreateWindow()
  }
}
