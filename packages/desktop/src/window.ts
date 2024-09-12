import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import path from 'path'

import { forceQuit } from '.'
import * as config from './config'
import * as constants from './constants'
import * as dock from './dock'
import * as helpers from './helpers'
import * as ipc from './ipc'
import { __DEV__ } from './libs/electron-is-dev'
import { WindowState, windowStateKeeper } from './libs/electron-window-state'
import * as menu from './menu'
import * as screen from './screen'
import * as tray from './tray'

let mainWindow: BrowserWindow | undefined
let mainWindowState: WindowState
let menubarWindowState: WindowState

export function getMainWindow() {
  return mainWindow
}

export function init() {
  const display = screen.getDisplayFromCursor()

  mainWindowState = windowStateKeeper({
    defaultWidth: display.workAreaSize.width,
    defaultHeight:
      display.workAreaSize.height - (process.platform === 'linux' ? 28 : 0),
    file: `main-window-display-${display.id}.json`,
    fullScreen: false,
  })

  menubarWindowState = windowStateKeeper({
    defaultWidth: 350,
    defaultHeight: 630,
    file: `menubar-window-display-${display.id}.json`,
    fullScreen: false,
  })

  mainWindow = createWindow()
  update()
}

let mainWindowReadyToShowCount = 0
let screenId: number
export function createWindow() {
  const win = new BrowserWindow(getBrowserWindowOptions())

  win.loadURL(constants.START_URL)

  win.once('ready-to-show', () => {
    mainWindowReadyToShowCount++
    if (
      mainWindowReadyToShowCount === 1 &&
      (__DEV__ || app.getLoginItemSettings().wasOpenedAsHidden)
    )
      return

    helpers.showWindow(win)
  })

  win.on('show', () => {
    menu.updateMenu()

    screenId = screen.getDisplayFromWindow(win).id
    updateBrowserWindowOptions()
  })

  win.on('hide', () => {
    menu.updateMenu()
  })

  win.on('close', (e) => {
    menu.updateMenu()

    if (process.platform === 'darwin' && !forceQuit) {
      e.preventDefault()
      win.hide()
      return
    } else {
      // For other platforms, allow the window to be closed
      mainWindow = undefined; // Set the reference to mainWindow to undefined
      win.destroy() // Quit the application
    }
  })

  win.on('closed', () => {
    win.destroy()
    mainWindow = undefined
  })
  win.on('resize', () => {
    if (config.store.get('isMenuBarMode')) {
      tray.alignWindowWithTray(win)
    } else if (config.store.get('lockOnCenter')) {
      center(win)
    }
  })

  win.on('move', () => {
    screenId = screen.getDisplayFromWindow(win).id
  })

  win.on('blur', () => {
    menu.updateMenu()

    function shouldHide() {
      const isSameDisplay = screen.getDisplayFromCursor().id === screenId

      return (
        isSameDisplay &&
        config.store.get('isMenuBarMode') &&
        config.store.get('isMenuBarModeChangedAt') &&
        Date.now() - config.store.get('isMenuBarModeChangedAt')! > 1000 &&
        !win.isDestroyed()
      )
    }

    if (!shouldHide()) return

    setTimeout(() => {
      if (!shouldHide()) return
      win.hide()
    }, 200)
  })

  win.on('maximize', () => {
    ipc.emit('is-maximized-change', true)
  })

  win.on('unmaximize', () => {
    ipc.emit('is-maximized-change', false)
  })

  win.on('enter-full-screen', () => {
    ipc.emit('fullscreen-change', true)
    const _dock = dock.getDock()
    if (_dock) _dock.show()
  })

  win.on('leave-full-screen', () => {
    ipc.emit('fullscreen-change', false)
    if (!(mainWindow && mainWindow.isFocused())) return
    update()
  })

  return win
}

export function getBrowserWindowOptions() {
  const options: BrowserWindowConstructorOptions = {
    titleBarStyle:
      process.platform === 'darwin' && !config.store.get('isMenuBarMode')
        ? 'hidden'
        : 'default',
    minWidth: 320,
    minHeight: 450,
    backgroundColor: '#1F2229',
    darkTheme: true,
    icon:
      process.platform === 'darwin' || process.platform === 'win32'
        ? undefined
        : path.join(__dirname, '../assets/icons/icon.png'),
    resizable: true,
    show: !!(getMainWindow() && getMainWindow()!.isVisible()),
    title: 'DevHub',
    webPreferences: {
      affinity: 'main-window',
      backgroundThrottling: false,
      contextIsolation: false,
      nativeWindowOpen: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    ...(config.store.get('isMenuBarMode')
      ? {
          x: menubarWindowState.x,
          y: menubarWindowState.y,
          width: menubarWindowState.width,
          height: menubarWindowState.height,
          alwaysOnTop: true,
          center: false,
          frame: false,
          fullscreenable: false,
          maxWidth: screen.getDisplayFromCursor().size.width * 0.9,
          maxHeight: screen.getDisplayFromCursor().size.height,
          movable: false,
          skipTaskbar: true,
        }
      : {
          x: mainWindowState.x,
          y: mainWindowState.y,
          width: mainWindowState.width,
          height: mainWindowState.height,
          alwaysOnTop: false,
          center: true,
          frame: constants.FRAME_IS_DIFFERENT_BETWEEN_MODES,
          fullscreenable: true,
          maxWidth: undefined,
          maxHeight: undefined,
          movable: !config.store.get('lockOnCenter'),
          skipTaskbar: false,
        }),
  }

  return options
}

export function update() {
  menu.updateMenu()
  updateBrowserWindowOptions()
}

export function updateOrRecreateWindow() {
  if (constants.FRAME_IS_DIFFERENT_BETWEEN_MODES || !mainWindow) {
    const oldWindow = mainWindow
    mainWindow = createWindow()
    if (oldWindow) oldWindow.close()
  }

  update()
  helpers.showWindow(mainWindow)
}

let isFirstTime = true
function updateBrowserWindowOptions() {
  if (!mainWindow) return

  const options = getBrowserWindowOptions()

  if (config.store.get('isMenuBarMode')) {
    mainWindowState.unmanage()
    menubarWindowState.manage(mainWindow)
  } else {
    menubarWindowState.unmanage()
    mainWindowState.manage(mainWindow)
  }

  if (mainWindow.setWindowButtonVisibility)
    mainWindow.setWindowButtonVisibility(options.titleBarStyle === 'hidden')

  const maximize =
    !config.store.get('isMenuBarMode') &&
    (mainWindow.isMaximized() || (isFirstTime && mainWindowState.isMaximized))
  isFirstTime = false

  mainWindow.setAlwaysOnTop(options.alwaysOnTop === true)

  mainWindow.setMinimumSize(
    Math.floor(options.minWidth || 0),
    Math.floor(options.minHeight || 0),
  )

  mainWindow.setMaximumSize(
    Math.ceil(options.maxWidth || screen.getDisplayFromCursor().size.width),
    Math.ceil(options.maxHeight || screen.getDisplayFromCursor().size.height),
  )

  mainWindow.setMovable(options.movable !== false)

  if (!config.store.get('isMenuBarMode')) {
    mainWindow.setPosition(
      maximize ? screen.getDisplayFromCursor().workArea.x || 0 : options.x || 0,
      maximize ? screen.getDisplayFromCursor().workArea.y || 0 : options.y || 0,
      false,
    )
  }

  // Note: setSkipTaskbar was causing the app to freeze on linux
  if (process.platform === 'darwin' || process.platform === 'win32') {
    mainWindow.setSkipTaskbar(options.skipTaskbar === true)
  }

  if (maximize) {
    // Node: workAreaSize.heigth is wrong on linux, causing the app content to jump on window open
    if (process.platform !== 'linux') {
      mainWindow.setSize(
        screen.getDisplayFromCursor().workAreaSize.width,
        screen.getDisplayFromCursor().workAreaSize.height,
        false,
      )
    }
  } else {
    if (mainWindow.isMaximized() || config.store.get('isMenuBarMode'))
      mainWindow.unmaximize()
    mainWindow.setSize(options.width || 500, options.height || 500, false)
  }

  const _dock = dock.getDock()
  if (_dock) {
    if (options.skipTaskbar === true) {
      _dock.hide()
    } else {
      _dock.show()
    }
  }

  if (config.store.get('isMenuBarMode')) {
    tray.alignWindowWithTray(mainWindow)
  } else {
    if (config.store.get('lockOnCenter')) {
      center(mainWindow)
    }
  }
}

export function center(win: BrowserWindow) {
  const windowBounds = win.getBounds()
  const workArea = screen.getDisplayFromCursor().workArea

  win.setPosition(
    Math.round(workArea.x + workArea.width / 2 - windowBounds.width / 2),
    Math.round(workArea.y + workArea.height / 2 - windowBounds.height / 2),
  )
}
