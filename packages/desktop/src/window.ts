import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import path from 'path'

import * as config from './config'
import * as constants from './constants'
import * as dock from './dock'
import * as helpers from './helpers'
import { __DEV__ } from './libs/electron-is-dev'
import { WindowState, windowStateKeeper } from './libs/electron-window-state'
import * as menu from './menu'
import * as screen from './screen'
import * as tray from './tray'

let mainWindow: BrowserWindow
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
    defaultWidth: 380,
    defaultHeight: 677,
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
    screenId = screen.getDisplayFromWindow(win).id
    tray.updateTrayHightlightMode()
    updateBrowserWindowOptions()
  })

  win.on('hide', () => {
    const _tray = tray.getTray()
    if (_tray) _tray.setHighlightMode('selection')
  })

  win.on('closed', () => {
    win.destroy()
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
    const isSameDisplay = screen.getDisplayFromCursor().id === screenId

    setTimeout(() => {
      if (
        isSameDisplay &&
        config.store.get('isMenuBarMode') &&
        !win.isDestroyed()
      ) {
        win.hide()
      }
    }, 200)
  })

  win.on('enter-full-screen', () => {
    const _dock = dock.getDock()
    if (_dock) _dock.show()
  })

  win.on('leave-full-screen', () => {
    if (!mainWindow.isFocused()) return
    update()
  })

  return win
}

export function getBrowserWindowOptions() {
  const options: BrowserWindowConstructorOptions = {
    minWidth: 320,
    minHeight: 450,
    backgroundColor: '#1F2229',
    darkTheme: true,
    icon:
      process.platform === 'darwin' || process.platform === 'win32'
        ? undefined
        : path.join(__dirname, '../assets/icons/icon.png'),
    resizable: true,
    show: false,
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
          maxWidth: screen.getDisplayFromCursor().workAreaSize.width * 0.8,
          maxHeight: screen.getDisplayFromCursor().workAreaSize.height * 0.8,
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
  tray.updateTrayHightlightMode()
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

function updateBrowserWindowOptions() {
  const options = getBrowserWindowOptions()

  const maximize =
    !config.store.get('isMenuBarMode') &&
    (mainWindow.isMaximized() ||
      mainWindowState.isMaximized ||
      config.store.get('launchCount') === 1)

  mainWindow.setAlwaysOnTop(options.alwaysOnTop === true)

  mainWindow.setMinimumSize(
    Math.floor(options.minWidth || 0),
    Math.floor(options.minHeight || 0),
  )

  mainWindow.setMaximumSize(
    Math.ceil(
      options.maxWidth ||
        (process.platform === 'darwin'
          ? screen.getDisplayFromCursor().workAreaSize.width
          : 0),
    ),
    Math.ceil(
      options.maxHeight ||
        (process.platform === 'darwin'
          ? screen.getDisplayFromCursor().workAreaSize.height
          : 0),
    ),
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

  mainWindowState.unmanage()
  menubarWindowState.unmanage()
  if (config.store.get('isMenuBarMode')) {
    menubarWindowState.manage(mainWindow)
  } else {
    mainWindowState.manage(mainWindow)
  }

  if (config.store.get('isMenuBarMode')) {
    tray.alignWindowWithTray(mainWindow)
  } else {
    if (config.store.get('lockOnCenter')) {
      center(mainWindow)
    }

    if (maximize) {
      mainWindow.maximize()
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
