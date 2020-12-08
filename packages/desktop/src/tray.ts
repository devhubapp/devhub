import { app, BrowserWindow, nativeImage, Tray } from 'electron'
import path from 'path'

import * as config from './config'
import * as helpers from './helpers'
import * as menu from './menu'
import * as screen from './screen'
import * as window from './window'

const trayIcon = path.join(
  __dirname,
  `../assets/icons/${
    process.platform === 'darwin' ? 'trayIconTemplate' : 'trayIconWhite'
  }.png`,
)

const trayIconWithBadge = path.join(
  __dirname,
  `../assets/icons/${
    process.platform === 'darwin'
      ? 'trayIconWithBadge'
      : 'trayIconWhiteWithBadge'
  }.png`,
)

let tray: Tray | null = null

export function getTray() {
  return tray
}

export function createTray() {
  const image = nativeImage.createFromPath(trayIcon)

  if (tray && !tray.isDestroyed()) tray.destroy()

  tray = new Tray(image)

  tray.on('click', () => {
    const mainWindow = window.getMainWindow()

    if (!mainWindow) {
      showTrayContextPopup()
      return
    }

    if (mainWindow.isFullScreen()) {
      showTrayContextPopup()
      return
    }

    if (mainWindow.isVisible() && !mainWindow.isMinimized()) {
      const isSameDisplay =
        screen.getDisplayFromCursor().id ===
        screen.getDisplayFromWindow(mainWindow).id

      if (
        isSameDisplay &&
        (mainWindow.isFocused() || process.platform !== 'darwin')
      ) {
        if (config.store.get('isMenuBarMode')) {
          mainWindow.hide()
        } else {
          showTrayContextPopup()
        }

        return
      }
    }

    if (config.store.get('isMenuBarMode')) {
      alignWindowWithTray(mainWindow)
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

export function alignWindowWithTray(win: BrowserWindow) {
  if (!(tray && !tray.isDestroyed())) return

  const xSpacing = 10
  const ySpacing = 0

  const workArea = screen.getDisplayFromCursor().workArea
  const screenSize = screen.getDisplayFromCursor().size

  let trayBounds = tray.getBounds()
  if (
    !(trayBounds.width && trayBounds.height && (trayBounds.x || trayBounds.y))
  ) {
    trayBounds = {
      x: trayBounds.x || screenSize.width - xSpacing,
      y: trayBounds.y || 0,
      width: trayBounds.width || 0,
      height: trayBounds.height || 0,
    }
  }

  const windowBounds = win.getBounds()
  const trayCenter = helpers.getCenterPosition({ getBounds: () => trayBounds })

  const top = trayBounds.y < screenSize.height / 3
  const bottom = screenSize.height - trayBounds.y < screenSize.height / 3
  const left = trayBounds.x < screenSize.width / 3
  const right = screenSize.width - trayBounds.x < screenSize.width / 3

  let x: number
  let y: number

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
    workArea.x + xSpacing,
    Math.min(x, workArea.x + workArea.width - windowBounds.width - xSpacing),
  )
  const fixedY = Math.max(
    workArea.y + ySpacing,
    Math.min(y, workArea.y + workArea.height - windowBounds.height - ySpacing),
  )

  win.setPosition(fixedX, fixedY)
}

export function updateUnreadState(unreadCount: number) {
  if (!tray) return

  tray.setImage(unreadCount > 0 ? trayIconWithBadge : trayIcon)
  tray.setTitle(unreadCount > 0 ? `${unreadCount}` : '')
  tray.setToolTip(
    `${app.getName()}${
      unreadCount > 0
        ? unreadCount === 1
          ? ' (1 unread item)'
          : ` (${unreadCount} unread items)`
        : ''
    }`,
  )
}
