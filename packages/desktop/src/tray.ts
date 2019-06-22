import { BrowserWindow, nativeImage, screen, Tray } from 'electron'
import path from 'path'

import * as config from './config'
import * as helpers from './helpers'
import * as menu from './menu'
import * as window from './window'

let tray: Tray | null = null

export function getTray() {
  return tray
}

export function createTray() {
  const trayIcon = nativeImage.createFromPath(
    path.join(
      __dirname,
      `../assets/icons/${
        process.platform === 'darwin' ? 'trayIconTemplate' : 'trayIconWhite'
      }.png`,
    ),
  )

  if (tray && !tray.isDestroyed()) tray.destroy()

  tray = new Tray(trayIcon)

  tray.on('click', () => {
    const mainWindow = window.getMainWindow()
    if (mainWindow.isFullScreen()) {
      showTrayContextPopup()
      return
    }

    if (mainWindow.isVisible() && !mainWindow.isMinimized()) {
      if (mainWindow.isFocused() || process.platform !== 'darwin') {
        if (config.store.get('isMenuBarMode')) {
          mainWindow.hide()
        } else {
          showTrayContextPopup()
        }

        return
      }
    }

    helpers.showWindow(mainWindow)
  })

  tray.on('right-click', () => {
    showTrayContextPopup()
  })
}

export function showTrayContextPopup() {
  tray!.popUpContextMenu(menu.getTrayContextMenu())
}

export function updateTrayHightlightMode() {
  if (!(tray && !tray.isDestroyed())) return

  const mainWindow = window.getMainWindow()
  tray.setHighlightMode(
    config.store.get('isMenuBarMode') &&
      mainWindow.isVisible() &&
      mainWindow.isFocused() &&
      !mainWindow.isFullScreen()
      ? 'always'
      : 'selection',
  )
}

export function alignWindowWithTray(win: BrowserWindow) {
  if (!(tray && !tray.isDestroyed())) return

  const trayBounds = tray.getBounds()
  if (!(trayBounds.width && trayBounds.height)) {
    win.center()
    return
  }

  const screenSize = screen.getPrimaryDisplay().size
  const workArea = screen.getPrimaryDisplay().workArea
  const windowBounds = win.getBounds()
  const trayCenter = helpers.getCenterPosition(tray)

  const top = trayBounds.y < screenSize.height / 3
  const bottom = screenSize.height - trayBounds.y < screenSize.height / 3
  const left = trayBounds.x < screenSize.width / 3
  const right = screenSize.width - trayBounds.x < screenSize.width / 3

  let x: number
  let y: number
  const spacing = 8

  if (top) {
    y = Math.round(trayCenter.y)
  } else if (bottom) {
    y = Math.round(trayCenter.y - windowBounds.height / 2)
  } else {
    y = Math.round(trayCenter.y - windowBounds.height / 2)
  }

  if (left) {
    x = Math.round(trayCenter.x)
  } else if (right) {
    x = Math.round(trayCenter.x - windowBounds.width / 2)
  } else {
    x = Math.round(trayCenter.x - windowBounds.width / 2)
  }

  const fixedX = Math.max(
    workArea.x + spacing,
    Math.min(x, workArea.x + workArea.width - windowBounds.width - spacing),
  )
  const fixedY = Math.max(
    workArea.y + spacing,
    Math.min(y, workArea.y + workArea.height - windowBounds.height - spacing),
  )

  win.setPosition(fixedX, fixedY)
}
